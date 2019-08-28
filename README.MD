# Canvas engine

It's a small learning/experiment project. My own drawing on canvas API. Uses ES6. standard.

## Functionalities:

* fill entire canvas with a color
* draw a pixel
* draw a line
* draw a triangle
* render loop
* pressed keys available for render loop
* arbitrary canvas size
* arbitrary pixel size

## TODO:

* drawing of a square
* drawing of a filled shapes
* moving to TypeScript
* ?

# Example usage

```
import {
    CanvasEngine,
    COLOR_BLACK,
    COLOR_RED,
    COLOR_GREEN,
    COLOR_BLUE,
    COLOR_BROWN,
    COLOR_WHITE,
    COLOR_DARK_BLUE,
    COLOR_GREY,
} from './canvas-engine';

let dx = 0;
let dy = 0;
const canvas = new CanvasEngine(
    document.getElementById('canvas'),
    {
        pixelSize: 4,
        width: 320,
        height: 240,
    },
    function(status) {
        if (status.keys.d) {
            dx += 1;
        }
        if (status.keys.a) {
            dx -= 1;
        }
        if (status.keys.w) {
            dy -= 1;
        }
        if (status.keys.s) {
            dy += 1;
        }

        this.fill(COLOR_BLACK);

        this.drawPixel({ x: 0 + dx, y: 0 + dy }, COLOR_WHITE);
        this.drawLine({ x: dx + 3, y: dy + 4 }, { x: dx + 18, y: dy + 9 }, COLOR_GREEN);
        this.drawLine({ x: dx + 3, y: dy + 9 }, { x: dx + 18, y: dy + 4 }, COLOR_GREEN);
        this.drawLine({ x: dx + 3, y: dy + 3 }, { x: dx + 19, y: dy + 17 }, COLOR_BLUE);
        this.drawTriangle(
            { x: dx + 40, y: dy + 40 },
            { x: dx + 20, y: dy + 20 },
            { x: dx + 18, y: dy + 4 },
            COLOR_GREY
        );
    }
);

```