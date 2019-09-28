import * as PIXI from "pixi.js";
import { load as _load, generateOutline, generateFlash } from "./common";
import * as img from "./img/residence.png"

export const load = () => _load(img);

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