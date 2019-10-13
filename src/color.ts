const saturation = 0.75;
const value = 1.0;

function hueToRgb(H: number) {
    let S = saturation;
    let V = value;
    let C = V * S;
    let Hp = H / 60;
    let X = C * (1 - Math.abs(Hp % 2 - 1));

    let R = 0, G = 0, B = 0;
    if (0 <= Hp && Hp < 1) {[R,G,B]=[C,X,0]};
    if (1 <= Hp && Hp < 2) {[R,G,B]=[X,C,0]};
    if (2 <= Hp && Hp < 3) {[R,G,B]=[0,C,X]};
    if (3 <= Hp && Hp < 4) {[R,G,B]=[0,X,C]};
    if (4 <= Hp && Hp < 5) {[R,G,B]=[X,0,C]};
    if (5 <= Hp && Hp < 6) {[R,G,B]=[C,0,X]};

    let m = V - C;
    [R, G, B] = [R+m, G+m, B+m];

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);

    return [R ,G, B];
}

export default function(resolution: number) {
    let canvas = document.createElement("canvas");
    canvas.width = 180 * resolution;
    canvas.height = resolution;
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    
    for(var i = 0; i < 360; i++) {
        ctx.beginPath();
        ctx.rect(i * resolution / 2, 0, resolution / 2, resolution);
        ctx.fillStyle = `rgb(${hueToRgb(i).join(",")})`;
        ctx.fill();
        ctx.closePath();
    }
    return canvas.toDataURL();
} 
