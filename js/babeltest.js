
function lerp(a, b, n) {
    return (1 - n) * a + n * b;
}

function scaleBetween(initialVal, minAllow, maxAllow, min, max) {
    // scaleBetween(250, -1, 1, 0, 500) => 0
    return (
        ((maxAllow - minAllow) * (initialVal - min)) / (max - min) + minAllow
    );
}

function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}


//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Canvas
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

class Canvas {
    constructor({ canvas, entities = [], pointer }) {
        // setup a canvas
        this.canvas = canvas;
        this.dpr = window.devicePixelRatio || 1;
        this.ctx = canvas.getContext('2d');
        this.ctx.scale(this.dpr, this.dpr);

        // tick counter
        this.tick = 0;

        // entities to be drawn on the canvas
        this.entities = entities;

        // track mouse/touch movement
        this.pointer = pointer || null;

        // setup and run
        this.setCanvasSize();
        this.setupListeners();
        this.render();
    }

    setupListeners() {
        window.addEventListener('resize', this.setCanvasSize);
    }

    setCanvasSize = () => {
        const { innerWidth: w, innerHeight: h } = window;
        const w2 = w * this.dpr;
        const h2 = h * this.dpr;
        this.canvas.width = w2;
        this.canvas.height = h2;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.bounds = new Bounds(0, 0, w2, h2);
    };

    addEntity = newEntity => {
        this.entities = [...this.entities, newEntity];
        return this.entities.length - 1;
    };

    removeEntity(deleteIndex) {
        this.entities = this.entities.filter((el, i) => i !== deleteIndex);
        return this.entities;
    }

    removeDead() {
        this.entities = this.entities.filter(({ dead = false }) => !dead);
    }

    render = () => {
        // Main loop

        // Draw and Update items here.
        this.entities.forEach(({ draw, update }) => {
            draw(this);
            update(this);
        });

        // Cleanup "dead" entities
        this.removeDead();

        ++this.tick;
        window.requestAnimationFrame(this.render);
    };
}


//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Entity
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

class Entity {
    dpr = window.devicePixelRatio || 1;
    toValue = value => value * this.dpr;
    draw = () => {};
    update = () => {};
}


//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Background
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

class Background extends Entity {
    drawBG({ ctx, bounds }) {
        ctx.fillStyle = '#f5b8b5';
        ctx.fillRect(...bounds.params);
    }

    draw = context => {
        this.drawBG(context);
    };
}


//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Cursor
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

class Cursor extends Entity {
    constructor(radius) {
        super();
        this.radius = this.toValue(radius);
        this.pi2 = Math.PI * 2;
        this.lineWidth = this.toValue(2);
        this.strokeStyle = '#fff';
    }

    draw = ({ ctx, pointer }) => {
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.arc(
            pointer.position.x,
            pointer.position.y,
            this.radius,
            0,
            this.pi2,
            true
        );
        ctx.closePath();
        ctx.stroke();
    };
}

//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Pointer
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

class Pointer {
    constructor() {
        this.dpr = window.devicePixelRatio || 1;
        this.delta;
        this.lastPosition = null;
        this.position = new Point(null, null);
        this.addListeners();
    }

    delta() {
        return this.position.delta(this.lastPosition);
    }

    addListeners() {
        ['mousemove', 'touchmove'].forEach((event, touch) => {
            window.addEventListener(
                event,
                e => {
                    // move previous point
                    const { x: px, y: py } = this.position;

                    // disable the demo modifier if it's been added
                    if (this.modifier) {
                        this.modifier = null;
                    }

                    if (touch) {
                        e.preventDefault();
                        const x = e.targetTouches[0].clientX * this.dpr;
                        const y = e.targetTouches[0].clientY * this.dpr;
                        if (!this.lastPosition) {
                            this.lastPosition = new Point(x, y);
                        } else {
                            this.lastPosition.moveTo(px, py);
                        }
                        this.position.moveTo(x, y);
                    } else {
                        const x = e.clientX * this.dpr;
                        const y = e.clientY * this.dpr;
                        if (!this.lastPosition) {
                            this.lastPosition = new Point(x, y);
                        } else {
                            this.lastPosition.moveTo(px, py);
                        }
                        this.position.moveTo(x, y);
                    }
                },
                false
            );
        });
    }

    addPointerModifier(modifier) {
        this.modifier = modifier;
    }

    update = ({ tick }) => {
        this.modifier && this.modifier(this, tick);
    };
}




//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Point
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get position() {
        return [this.x, this.y];
    }

    clone() {
        return new Point(this.x, this.y);
    }

    delta(point) {
        return [this.x - point.x, this.y - point.y];
    }

    distance(point) {
        const dx = point.x - this.x;
        const dy = point.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    move(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }

    moveAtAngle(angle, distance) {
        this.x += Math.cos(angle) * distance;
        this.y += Math.sin(angle) * distance;
        return this;
    }

    applyVelocity(velocity) {
        this.x += velocity.vx;
        this.y += velocity.vy;
        return this;
    }

    angleRadians(point) {
        // radians = atan2(deltaY, deltaX)
        const y = point.y - this.y;
        const x = point.x - this.x;
        return Math.atan2(y, x);
    }

    angleDeg(point) {
        // degrees = atan2(deltaY, deltaX) * (180 / PI)
        const y = point.y - this.y;
        const x = point.x - this.x;
        return Math.atan2(y, x) * (180 / Math.PI);
    }

    rotate(origin, radians) {
        // rotate the point around a given origin point
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        this.x =
            cos * (this.x - origin.x) + sin * (this.y - origin.y) + origin.x;
        this.y =
            cos * (this.y - origin.y) - sin * (this.x - origin.x) + origin.y;
        return this;
    }

    lerp(destination, amount) {
        this.x = lerp(this.x, destination.x, amount);
        this.y = lerp(this.y, destination.y, amount);
        return this;
    }
}



//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Bounds
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

class Bounds {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        const hw = w / 2;
        const hh = h / 2;
        this.center = new Point(hw, hh);
        this.position = new Point(x, y);
    }

    get params() {
        return [this.x, this.y, this.w, this.h];
    }

    offsetOuter(offset) {
        const [x, y, w, h] = this.params;
        return new Bounds(
            x - offset,
            y - offset,
            w + offset * 2,
            h + offset * 2
        );
    }

    offsetInner(offset) {
        const [x, y, w, h] = this.params;
        return new Bounds(
            x + offset,
            y + offset,
            w - offset * 2,
            h - offset * 2
        );
    }
}

/*------------------------------*
 * Eye Canvas
 *------------------------------*/

class Eye extends Entity {
    constructor({ radius, x, y }) {
        super();
        this.r = radius;
        this.d = this.r * 2;
        this.x = x;
        this.y = y;
        this.pad = this.r / 1.5;

        this.w = this.d + this.pad * 2;
        this.h = this.d + this.pad * 2;
        this.center = new Point(this.r + this.pad, this.r + this.pad);

        this.pupil = this.center.clone();
        this.iris = this.center.clone();

        // animated
        this.pupilSize = this.r;
        this.pupilMin = this.r * 0.8;
        this.pupilMax = this.r;
        // relatvie sizes
        this.pupilRad = this.pupilSize / 3.2;
        this.irisRad = this.pupilSize / 2.2;

        this.maxPupilOffset = (this.r - this.pupilRad) * 0.5;
        this.maxIrisOffset = (this.r - this.irisRad) * 0.5;

        this.lidWidth = this.r / 12;
        // left and right corners
        this.lidLeft = new Point(this.pad, this.center.y);
        this.lidRight = new Point(this.w - this.pad, this.center.y);

        // current lid y pos
        this.lidPos = this.r / 3 + this.pad;
        // max open
        this.lidMax = this.lidPos;
        // min open
        this.lidMin = this.lidPos * 1.3;
        // current open height
        this.lidOpen = this.lidMax;

        this.blink = false;

        this.setupCanvas();
        this.addListeners();
        this.drawLocal();
    }

    addListeners() {
        window.addEventListener('mousedown', this.handleMouse('down'), false);
        window.addEventListener('mouseup', this.handleMouse('up'), false);
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.w;
        this.canvas.height = this.h;

        // tmp canvas to draw stuff to
        this.tmp = document.createElement('canvas');
        this.tmpCtx = this.tmp.getContext('2d');
        this.tmp.width = this.w;
        this.tmp.height = this.h;
    }

    handleMouse = direction => () => {
        this.blink = direction;
        this.leer = direction === 'down';
        this.lidOpen = direction === 'down' ? this.lidMin : this.lidMax;
    };

    getShadowGradient() {
        const rx = this.center.x;
        const ry = this.center.y;
        const whiteGradient = this.ctx.createRadialGradient(
            rx,
            ry,
            this.r + this.pad,
            rx,
            ry,
            0
        );
        whiteGradient.addColorStop(0, '#f5b8b5');
        whiteGradient.addColorStop(1, '#c68eab');
        return whiteGradient;
    }

    animateBlink() {
        const closeY = this.center.y;

        if (this.blink === 'up') {
            this.lidPos = lerp(this.lidPos, this.lidOpen, 0.3);
        } else if (this.blink === 'down') {
            this.lidPos = lerp(this.lidPos, closeY, 0.2);
        }

        if (this.lidPos > closeY - 1 && this.blink === 'down') {
            this.blink = 'up';
        }
        if (this.lidPos < this.lidOpen - 1 && this.blink === 'up') {
            this.blink = false;
        }
    }

    animatePupil() {
        if (this.leer) {
            this.pupilSize = lerp(this.pupilSize, this.pupilMin, 0.3);
        } else {
            this.pupilSize = lerp(this.pupilSize, this.pupilMax, 0.2);
        }
        // update pupil rad
        this.pupilRad = this.pupilSize / 3.2;
    }

    getCurve1Params() {
        // control points
        const cx1 = this.center.x / 2.2 - this.lidPos / 2.2 + this.pad;
        const cy1 = this.lidPos;
        return [cx1, cy1, this.center.x, this.lidPos];
    }

    getCurve2Params() {
        // control points
        const cx1 = this.center.x / 2.2 - this.lidPos / 2.2 + this.pad;
        const cy1 = this.lidPos;
        return [this.w - cx1, cy1, this.lidRight.x, this.lidRight.y];
    }

    drawLid() {
        this.ctx.globalCompositeOperation = 'destination-out';

        this.ctx.beginPath();
        this.ctx.moveTo(this.lidLeft.x, this.lidLeft.y);

        // this.ctx.bezierCurveTo(cx1, cy1, cx2, cy2, this.lidRight.x, this.lidRight.y);
        this.ctx.quadraticCurveTo(...this.getCurve1Params());
        this.ctx.quadraticCurveTo(...this.getCurve2Params());

        // close off around the edges
        this.ctx.lineTo(this.w, this.center.y);
        this.ctx.lineTo(this.w, 0);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(0, this.center.y);
        this.ctx.closePath();

        // this.ctx.stroke();
        this.ctx.fill();
        this.ctx.globalCompositeOperation = 'source-over';
    }

    drawBackgroundShadow() {
        // gradient for background shadow
        this.ctx.fillStyle = this.getShadowGradient();
        this.ctx.beginPath();
        this.ctx.moveTo(this.lidLeft.x, this.lidLeft.y);
        this.ctx.quadraticCurveTo(...this.getCurve1Params());
        this.ctx.quadraticCurveTo(...this.getCurve2Params());
        // close off around the edges
        this.ctx.lineTo(this.w, this.center.y);
        this.ctx.lineTo(this.w, 0);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(0, this.center.y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawEyeLines(upper) {
        // repeating for eye lines
        // drawing to a tmp canvas
        this.tmpCtx.lineWidth = this.lidWidth;
        this.tmpCtx.lineCap = 'round';
        this.tmpCtx.strokeStyle = upper ? '#c68eab' : '#f5b8b5';
        this.tmpCtx.beginPath();
        this.tmpCtx.moveTo(this.lidLeft.x, this.lidLeft.y);
        this.tmpCtx.quadraticCurveTo(...this.getCurve1Params());
        this.tmpCtx.quadraticCurveTo(...this.getCurve2Params());
        this.tmpCtx.stroke();
        // cuts off stroke ends
        this.tmpCtx.clearRect(0, this.center.y, this.w, this.h / 2);

        // draw tmp to normal canvas
        this.ctx.drawImage(this.tmp, 0, 0, this.w, this.h);

        // clear tmp for later
        this.tmpCtx.clearRect(0, 0, this.w, this.h);
    }

    drawLids() {
        // upper
        this.drawLid();
        this.drawBackgroundShadow();
        this.drawEyeLines(true);

        // flip ctx
        this.ctx.save();
        this.ctx.translate(0, this.h);
        this.ctx.scale(1, -1);

        // lower
        this.drawLid();
        this.drawBackgroundShadow();
        this.drawEyeLines();
        this.ctx.restore();
    }

    drawWhites() {
        // whites
        const rx = this.center.x;
        const ry = this.center.y;
        const gradient = this.ctx.createRadialGradient(
            rx,
            ry,
            this.r,
            rx,
            ry,
            0
        );
        gradient.addColorStop(1, 'white');
        gradient.addColorStop(0.5, '#edf8ff');
        gradient.addColorStop(0, '#dce6fa');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.w, this.h);
    }

    drawIris() {
        // color
        this.ctx.fillStyle = '#4eb1b6';
        this.ctx.beginPath();
        this.ctx.arc(this.iris.x, this.iris.y, this.irisRad, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawPupil() {
        // pupil
        this.ctx.fillStyle = '#2c2f34';
        this.ctx.beginPath();
        this.ctx.arc(this.pupil.x, this.pupil.y, this.pupilRad, 0, 2 * Math.PI);
        this.ctx.fill();
        //glare
        const off = this.r / 4;
        const x = this.center.x - off;
        const y = this.center.y - off;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(Math.PI / 4);

        this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
        const size = this.r / 15;
        this.ctx.fillRect(0, 0, size, size);
        this.ctx.fillRect(0, size + size / 2, size, size / 2);
        this.ctx.restore();
    }

    drawLocal() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawWhites();
        this.drawIris();
        this.drawPupil();
        this.drawLids();
    }

    updatePupilPosition(pointer, tick) {
        const { center } = this;
        if (pointer.position.x === null) {
            const x = this.toValue(Math.sin(tick / 100) * window.innerWidth);
            const y = this.toValue(Math.sin(tick / 110) * window.innerHeight / 3 + window.innerHeight / 3);
            pointer = {
                position: new Point(x, y)
            };
        }
        
        const angle = pointer.position.angleRadians(this);
        const dist = pointer.position.distance(this);

        const pupDistNorm = scaleBetween(dist, 0, this.maxPupilOffset, 0, 400);
        const maxDistancePup = clamp(pupDistNorm, 0, this.maxPupilOffset);

        const irisDistNorm = scaleBetween(dist, 0, this.maxIrisOffset, 0, 400);
        const maxDistanceIris = clamp(irisDistNorm, 0, this.maxIrisOffset);

        this.pupilDest = center.clone().moveAtAngle(angle, -maxDistancePup);
        this.irisDest = center.clone().moveAtAngle(angle, -maxDistanceIris);

        this.pupil = this.pupil.lerp(this.pupilDest, 0.1);
        this.iris = this.iris.lerp(this.irisDest, 0.1);
    }

    draw = ({ ctx }) => {
        this.drawLocal();

        const width = this.canvas.width;
        const x = this.x - width / 2;
        const height = this.canvas.height;
        const y = this.y - height / 2;

        ctx.drawImage(this.canvas, x, y, width, height);
    };

    update = ({ pointer, tick }) => {
        if (tick % 200 === 0 || (tick % 240 === 0 && !this.leer)) {
            this.blink = 'down';
        }
        // @TODO: such poverty animations, use easing functions
        this.animateBlink();
        this.animatePupil();

        this.updatePupilPosition(pointer, tick);
    };
}

const run = () => {
    const DPR = window.devicePixelRatio || 1;
    const radius = (window.innerWidth / 12) * DPR;
    new Canvas({
        canvas: document.getElementById('canvas'),
        pointer: new Pointer(),
        entities: [
            new Background(),
            new Eye({
                radius,
                x: (window.innerWidth / 2) * DPR - radius * 2,
                y: window.innerHeight / 2  * DPR,
            }),
            new Eye({
                radius,
                x: (window.innerWidth / 2) * DPR + radius * 2,
                y: window.innerHeight / 2  * DPR,
            }),
            new Cursor(10),
        ],
    });
};

// window.addEventListener('resize', run, false);

// Kick off
run();

