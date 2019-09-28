import * as PIXI from "pixi.js";
import cursor from "./cursor";
import anchor from "./anchor";
import rail_node from "./rail_node";
import rail_edge from "./rail_edge";
import * as residence from "./residence";

let images = ["residence"]

let args = new URL(document.URL);
let type = args.searchParams.get("type");
let resolution = parseInt(args.searchParams.get("resolution") as string);

let app = new PIXI.Application({
    width: 40, height: 40, preserveDrawingBuffer: true
});

function toDataURL(obj: PIXI.DisplayObject) {
    return app.renderer.plugins.extract.canvas(obj).toDataURL();
}

function register(
    base: PIXI.BaseTexture, 
    fn: (base: PIXI.BaseTexture, resolution: number, offset: number) => PIXI.DisplayObject) {
    for(var offset = 0; offset < 240; offset++) {
        let anchorElm = document.createElement("a");
        anchorElm.id = `offset${offset}`;
        anchorElm.href = toDataURL(fn(base, resolution, offset));
        document.body.appendChild(anchorElm);
    }
}

if (type !== null && images.includes(type)) {
    window.addEventListener("load", () => {
        switch(type) {
            case "residence":
                residence.load().then(base => {
                    register(base, residence.generate);
                }).catch(err => console.error(err));
        }
    });
} else {
    window.addEventListener("load", () => {
        for(var offset = 0; offset < 240; offset++) {
            let anchorElm = document.createElement("a");
            anchorElm.id = `offset${offset}`;
            switch(type) {
                case "cursor":
                    anchorElm.href = toDataURL(cursor(resolution, offset));
                    break;
                case "anchor":
                    anchorElm.href = toDataURL(anchor(resolution, offset));
                    break;
                case "rail_node":
                    anchorElm.href = toDataURL(rail_node(resolution, offset));
                    break;
                case "rail_edge":
                    anchorElm.href = toDataURL(rail_edge(resolution, offset));
                    break;
            }
            document.body.appendChild(anchorElm);
        }
    });
}