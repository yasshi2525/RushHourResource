const puppeteer = require("puppeteer");
const fs = require("fs");

const baseUrl = "file:///" + __dirname + "/build/index.html";
const baseSavedPath = __dirname + "/build/img";
const distPath = __dirname + "/build/dist";

const round = 240;
const types = ["color", "anchor", "cursor","rail_node", "rail_edge", "residence", "company", "station", "train", "destroy"];
const resolutions = [1, 2, 3, 4];

(async () => {
    let browser = null;
    try {
        if (!fs.existsSync(distPath)) {
            fs.mkdirSync(distPath, { recursive: true });
        }

        const args = puppeteer.defaultArgs().filter(arg => arg !== "--disable-gpu");
        args.push("--use-gl=desktop");
        args.push("--no-sandbox");
        browser = await puppeteer.launch({ headless: true, ignoreDefaultArgs: true, args });
        let page = await browser.newPage();
        
        page.on("pageerror", (msg) => console.error(`[puppeteer] ${msg}`));

        let progress = 0;
        for (var type of types) {
            for (var resolution of resolutions) {
                let path = `${baseSavedPath}/${type}/@${resolution}x`;
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path, { recursive: true });
                }
                console.info("type=%s, resolution=%s (completed %s%%)", type, resolution, (progress * 100).toFixed(1));
                let url = `${baseUrl}?type=${type}&resolution=${resolution}`;
                await page.goto(url, { timeout: 0 });

                if (type == "color") {
                    await page.waitForSelector("a#image");
                    let res = await page.$eval("a#image", selector => selector.href);
                    var base64Data = res.replace(/^data:image\/png;base64,/, "");
                    fs.writeFile(`${distPath}/${type}@${resolution}x.png`, base64Data, "base64" , err => {
                        if (err !== null) {
                            console.error(err);
                        }
                    });
                } else {
                    for (var offset = 0; offset < round; offset++) {
                        await page.waitForSelector(`a#offset${offset}`);
                        let res = await page.$eval(`a#offset${offset}`, selector => selector.href);
                        var base64Data = res.replace(/^data:image\/png;base64,/, "");
                        fs.writeFile(`${path}/${type}${offset}.png`, base64Data, "base64" , err => {
                            if (err !== null) {
                                console.error(err);
                            }
                        });
                    }
                }
                progress += 1 / resolutions.length / types.length;
            }
        }
        console.log("completed");
    } catch(e) {
        console.error(e);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
})();
