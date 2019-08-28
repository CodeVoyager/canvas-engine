const DEFAULT_PIXEL_SIZE = 5;
const DEFAULT_WIDTH = 20;
const DEFAULT_HEIGHT = 20;
const COLOR_SIZE = 4; // r,g,b,a
const COLOR_WHITE = {
    r: 255,
    g: 255,
    b: 255,
};
const COLOR_BLACK = {
    r: 0,
    g: 0,
    b: 0,
};
const COLOR_RED = {
    r: 255,
    g: 0,
    b: 0,
};
const COLOR_GREEN = {
    r: 0,
    g: 255,
    b: 0,
};
const COLOR_BLUE = {
    r: 0,
    g: 0,
    b: 255,
};
const COLOR_GREY = {
    r: 140,
    g: 138,
    b: 145,
};
const COLOR_BROWN = {
    r: 201,
    g: 138,
    b: 101,
};
const COLOR_DARK_BLUE = {
    r: 53,
    g: 137,
    b: 189,
};

class CanvasEngine {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {object} config
     * @param {() => void)} render
     */
    constructor(canvas, config, render) {
        if (!render) {
            throw new Error('Render function not defined');
        }

        this.width = config.width || DEFAULT_WIDTH;
        this.height = config.height || DEFAULT_HEIGHT;
        this.pixelSize = config.pixelSize || DEFAULT_PIXEL_SIZE;
        this.canvas = canvas;
        this.keys = [];

        this.canvas.width = this.width * this.pixelSize;
        this.canvas.height = this.height * this.pixelSize;
        this.canvasContext = this.canvas.getContext('2d');
        this.imageData = this.canvasContext.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        this.render = render.bind(this);
        window.addEventListener('keydown', e => {
            console.log(e.key);

            this.keys.push(e.key);
        });
        window.addEventListener('keyup', e => {
            this.keys = this.keys.filter(key => key !== e.key);
        });
        this.renderLoop = this.renderLoop.bind(this);
        requestAnimationFrame(this.renderLoop);
    }

    renderLoop() {
        this.render({
            keys: this.keys.reduce((acc, x) => {
                acc[x] = true;

                return acc;
            }, {}),
        });
        this.canvasContext.putImageData(this.imageData, 0, 0);
        requestAnimationFrame(this.renderLoop);
    }

    /**
     *
     *
     * @param {{r: number, g: number, b: number}} color
     * @memberof CanvasEngine
     */
    fill(color) {
        for (var i = 0; i < this.imageData.data.length; i += 4) {
            this.imageData.data[i] = color.r; // red
            this.imageData.data[i + 1] = color.g; // green
            this.imageData.data[i + 2] = color.b; // blue
            this.imageData.data[i + 3] = 255; // alpha
        }
    }

    /**
     *
     *
     * @param {{x: number, y: number}} point
     * @param {{r: number, g: number, b: number}} color
     * @memberof CanvasEngine
     */
    drawPixel(point, color) {
        let index = CanvasEngine.getIndex(point.y, point.x, this);
        const pixelsInRow = this.width * COLOR_SIZE * this.pixelSize;

        for (
            let currentNativePixelY = 0;
            currentNativePixelY < this.pixelSize;
            currentNativePixelY++
        ) {
            for (
                let currentNativePixelX = 0;
                currentNativePixelX < this.pixelSize * COLOR_SIZE;
                currentNativePixelX += 4
            ) {
                this.imageData.data[currentNativePixelX + index] = color.r; // red
                this.imageData.data[currentNativePixelX + index + 1] = color.g; // green
                this.imageData.data[currentNativePixelX + index + 2] = color.b; // blue
                this.imageData.data[currentNativePixelX + index + 3] = 255; // blue
            }

            index += pixelsInRow;
        }


    }

    /**
     * @see {https://www.cs.helsinki.fi/group/goa/mallinnus/lines/gsoft2.html}
     *
     * @param {{x: number, y: number}} pointA
     * @param {{x: number, y: number}} pointB
     * @param {{r: number, g: number, b: number}} color
     * @memberof CanvasEngine
     */
    drawLine(pointA, pointB, color) {
        let dx = pointA.x - pointB.x;
        let dy = pointA.y - pointB.y;

        if (dx === 0) {
            let y1 = Math.min(pointA.y, pointB.y);
            let y2 = Math.max(pointA.y, pointB.y);

            while (y1 <= y2) {
                this.drawPixel(
                    {
                        x: pointA.x,
                        y: y1,
                    },
                    color
                );
                y1++;
            }

            return;
        }

        if (dy === 0) {
            let x1 = Math.min(pointA.x, pointB.x);
            let x2 = Math.max(pointA.x, pointB.x);

            while (x1 <= x2) {
                this.drawPixel(
                    {
                        x: x1,
                        y: pointA.y,
                    },
                    color
                );
                x1++;
            }

            return;
        }

        dx = pointB.x - pointA.x;
        dy = pointB.y - pointA.y;

        if (Math.abs(dx) >= Math.abs(dy)) {
            let y = pointA.y + 0.5;
            const dly = dy / dx;

            if (dx > 0) {
                let x = pointA.x - 1;
                while (++x <= pointB.x) {
                    this.drawPixel(
                        {
                            x,
                            y: Math.floor(y),
                        },
                        color
                    );
                    y += dly;
                }
            } else {
                let x = pointA.x + 1;
                while (--x >= pointB.x) {
                    this.drawPixel(
                        {
                            x,
                            y: Math.floor(y),
                        },
                        color
                    );
                    y -= dly;
                }
            }
        } else {
            let x = pointA.x + 0.5;
            const dlx = dx / dy;
            if (dy > 0) {
                let y = pointA.y - 1;
                while (++y <= pointB.y) {
                    this.drawPixel(
                        {
                            x: Math.floor(x),
                            y,
                        },
                        color
                    );
                    x += dlx;
                }
            } else {
                let y = pointA.y + 1;
                while (--y >= pointB.y) {
                    this.drawPixel(
                        {
                            x: Math.floor(x),
                            y,
                        },
                        color
                    );
                    x -= dlx;
                }
            }
        }
    }

    /**
     *
     *
     * @param {{x: number, y: number}} a
     * @param {{x: number, y: number}} b
     * @param {{x: number, y: number}} c
     * @param {{r: number, g: number, b: number}} color
     * @memberof CanvasEngine
     */
    drawTriangle(a, b, c, color) {
        this.drawLine(a, b, color);
        this.drawLine(b, c, color);
        this.drawLine(a, c, color);
    }

    /**
     *
     *
     * @static
     * @param {number} row
     * @param {number} column
     * @param {CanvasEngine} column
     * @returns number
     * @memberof CanvasEngine
     */
    static getIndex(row, column, canvas) {
        if (undefined === canvas.rowItemsCount) {
            canvas.rowItemsCount =
                canvas.width * COLOR_SIZE * canvas.pixelSize * canvas.pixelSize;
        }
        if (undefined === canvas.columnOffset) {
            canvas.columnOffset = canvas.pixelSize * COLOR_SIZE;
        }
        return row * canvas.rowItemsCount + column * canvas.columnOffset;
    }
}

module.exports = {
    CanvasEngine,
    COLOR_WHITE,
    COLOR_BLACK,
    COLOR_RED,
    COLOR_GREEN,
    COLOR_BLUE,
    COLOR_GREY,
    COLOR_BROWN,
    COLOR_DARK_BLUE,
};
