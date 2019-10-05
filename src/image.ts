import * as PIXI from "pixi.js";
import { generateOutline, generateFlash } from "./common";
import * as residence from "./img/residence.png"
import * as company from "./img/company.png"

const load = (img: string) => {
    let resource = PIXI.resources.autoDetectResource(img);
    return new Promise<PIXI.BaseTexture>((resolve, reject) => 
        new PIXI.BaseTexture()
        .on("loaded", (b: PIXI.BaseTexture) => resolve(b))
        .on("error", (_: PIXI.BaseTexture, err: ErrorEvent) =>  reject(err))
        .setResource(resource));
}


export const loadRsidence = () => load(residence);
export const loadCompany = () => load(company);

export function generate(base: PIXI.BaseTexture, resolution: number, offset: number) {
    let container = new PIXI.Container();

    let graphics = new PIXI.Graphics();
    graphics.lineStyle(0, 0, 0);
    graphics.drawRect(0, 0, 60 * resolution, 60 * resolution);
    container.addChild(graphics);

    let sprite = new PIXI.Sprite(new PIXI.Texture(base))
    let size = Math.max(base.width, base.height);
    let scale = 50.0 / size * resolution;
    sprite.setTransform(5 * resolution, 5 * resolution, scale, scale);
    sprite.filters = [
        generateOutline(resolution),
        generateFlash(resolution, offset)
    ];
    container.addChild(sprite);

    return container;
}