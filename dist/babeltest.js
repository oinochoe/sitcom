'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _lerp(a, b, n) {
    return (1 - n) * a + n * b;
}

function scaleBetween(initialVal, minAllow, maxAllow, min, max) {
    // scaleBetween(250, -1, 1, 0, 500) => 0
    return (maxAllow - minAllow) * (initialVal - min) / (max - min) + minAllow;
}

function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Canvas
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

var Canvas = function () {
    function Canvas(_ref) {
        var _this = this;

        var canvas = _ref.canvas,
            _ref$entities = _ref.entities,
            entities = _ref$entities === undefined ? [] : _ref$entities,
            pointer = _ref.pointer;

        _classCallCheck(this, Canvas);

        this.setCanvasSize = function () {
            var _window = window,
                w = _window.innerWidth,
                h = _window.innerHeight;

            var w2 = w * _this.dpr;
            var h2 = h * _this.dpr;
            _this.canvas.width = w2;
            _this.canvas.height = h2;
            _this.canvas.style.width = w + 'px';
            _this.canvas.style.height = h + 'px';
            _this.bounds = new Bounds(0, 0, w2, h2);
        };

        this.addEntity = function (newEntity) {
            _this.entities = [].concat(_toConsumableArray(_this.entities), [newEntity]);
            return _this.entities.length - 1;
        };

        this.render = function () {
            // Main loop

            // Draw and Update items here.
            _this.entities.forEach(function (_ref2) {
                var draw = _ref2.draw,
                    update = _ref2.update;

                draw(_this);
                update(_this);
            });

            // Cleanup "dead" entities
            _this.removeDead();

            ++_this.tick;
            window.requestAnimationFrame(_this.render);
        };

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

    _createClass(Canvas, [{
        key: 'setupListeners',
        value: function setupListeners() {
            window.addEventListener('resize', this.setCanvasSize);
        }
    }, {
        key: 'removeEntity',
        value: function removeEntity(deleteIndex) {
            this.entities = this.entities.filter(function (el, i) {
                return i !== deleteIndex;
            });
            return this.entities;
        }
    }, {
        key: 'removeDead',
        value: function removeDead() {
            this.entities = this.entities.filter(function (_ref3) {
                var _ref3$dead = _ref3.dead,
                    dead = _ref3$dead === undefined ? false : _ref3$dead;
                return !dead;
            });
        }
    }]);

    return Canvas;
}();

//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Entity
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

var Entity = function Entity() {
    var _this2 = this;

    _classCallCheck(this, Entity);

    this.dpr = window.devicePixelRatio || 1;

    this.toValue = function (value) {
        return value * _this2.dpr;
    };

    this.draw = function () {};

    this.update = function () {};
};

//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Background
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

var Background = function (_Entity) {
    _inherits(Background, _Entity);

    function Background() {
        var _ref4;

        var _temp, _this3, _ret;

        _classCallCheck(this, Background);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this3 = _possibleConstructorReturn(this, (_ref4 = Background.__proto__ || Object.getPrototypeOf(Background)).call.apply(_ref4, [this].concat(args))), _this3), _this3.draw = function (context) {
            _this3.drawBG(context);
        }, _temp), _possibleConstructorReturn(_this3, _ret);
    }

    _createClass(Background, [{
        key: 'drawBG',
        value: function drawBG(_ref5) {
            var ctx = _ref5.ctx,
                bounds = _ref5.bounds;

            ctx.fillStyle = '#f5b8b5';
            ctx.fillRect.apply(ctx, _toConsumableArray(bounds.params));
        }
    }]);

    return Background;
}(Entity);

//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Cursor
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

var Cursor = function (_Entity2) {
    _inherits(Cursor, _Entity2);

    function Cursor(radius) {
        _classCallCheck(this, Cursor);

        var _this4 = _possibleConstructorReturn(this, (Cursor.__proto__ || Object.getPrototypeOf(Cursor)).call(this));

        _this4.draw = function (_ref6) {
            var ctx = _ref6.ctx,
                pointer = _ref6.pointer;

            ctx.strokeStyle = _this4.strokeStyle;
            ctx.lineWidth = _this4.lineWidth;
            ctx.beginPath();
            ctx.arc(pointer.position.x, pointer.position.y, _this4.radius, 0, _this4.pi2, true);
            ctx.closePath();
            ctx.stroke();
        };

        _this4.radius = _this4.toValue(radius);
        _this4.pi2 = Math.PI * 2;
        _this4.lineWidth = _this4.toValue(2);
        _this4.strokeStyle = '#fff';
        return _this4;
    }

    return Cursor;
}(Entity);

//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Pointer
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

var Pointer = function () {
    function Pointer() {
        var _this5 = this;

        _classCallCheck(this, Pointer);

        this.update = function (_ref7) {
            var tick = _ref7.tick;

            _this5.modifier && _this5.modifier(_this5, tick);
        };

        this.dpr = window.devicePixelRatio || 1;
        this.delta;
        this.lastPosition = null;
        this.position = new Point(null, null);
        this.addListeners();
    }

    _createClass(Pointer, [{
        key: 'delta',
        value: function delta() {
            return this.position.delta(this.lastPosition);
        }
    }, {
        key: 'addListeners',
        value: function addListeners() {
            var _this6 = this;

            ['mousemove', 'touchmove'].forEach(function (event, touch) {
                window.addEventListener(event, function (e) {
                    // move previous point
                    var _position = _this6.position,
                        px = _position.x,
                        py = _position.y;

                    // disable the demo modifier if it's been added

                    if (_this6.modifier) {
                        _this6.modifier = null;
                    }

                    if (touch) {
                        e.preventDefault();
                        var x = e.targetTouches[0].clientX * _this6.dpr;
                        var y = e.targetTouches[0].clientY * _this6.dpr;
                        if (!_this6.lastPosition) {
                            _this6.lastPosition = new Point(x, y);
                        } else {
                            _this6.lastPosition.moveTo(px, py);
                        }
                        _this6.position.moveTo(x, y);
                    } else {
                        var _x = e.clientX * _this6.dpr;
                        var _y = e.clientY * _this6.dpr;
                        if (!_this6.lastPosition) {
                            _this6.lastPosition = new Point(_x, _y);
                        } else {
                            _this6.lastPosition.moveTo(px, py);
                        }
                        _this6.position.moveTo(_x, _y);
                    }
                }, false);
            });
        }
    }, {
        key: 'addPointerModifier',
        value: function addPointerModifier(modifier) {
            this.modifier = modifier;
        }
    }]);

    return Pointer;
}();

//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Point
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

var Point = function () {
    function Point(x, y) {
        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
    }

    _createClass(Point, [{
        key: 'clone',
        value: function clone() {
            return new Point(this.x, this.y);
        }
    }, {
        key: 'delta',
        value: function delta(point) {
            return [this.x - point.x, this.y - point.y];
        }
    }, {
        key: 'distance',
        value: function distance(point) {
            var dx = point.x - this.x;
            var dy = point.y - this.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }, {
        key: 'moveTo',
        value: function moveTo(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }
    }, {
        key: 'move',
        value: function move(x, y) {
            this.x += x;
            this.y += y;
            return this;
        }
    }, {
        key: 'moveAtAngle',
        value: function moveAtAngle(angle, distance) {
            this.x += Math.cos(angle) * distance;
            this.y += Math.sin(angle) * distance;
            return this;
        }
    }, {
        key: 'applyVelocity',
        value: function applyVelocity(velocity) {
            this.x += velocity.vx;
            this.y += velocity.vy;
            return this;
        }
    }, {
        key: 'angleRadians',
        value: function angleRadians(point) {
            // radians = atan2(deltaY, deltaX)
            var y = point.y - this.y;
            var x = point.x - this.x;
            return Math.atan2(y, x);
        }
    }, {
        key: 'angleDeg',
        value: function angleDeg(point) {
            // degrees = atan2(deltaY, deltaX) * (180 / PI)
            var y = point.y - this.y;
            var x = point.x - this.x;
            return Math.atan2(y, x) * (180 / Math.PI);
        }
    }, {
        key: 'rotate',
        value: function rotate(origin, radians) {
            // rotate the point around a given origin point
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);
            this.x = cos * (this.x - origin.x) + sin * (this.y - origin.y) + origin.x;
            this.y = cos * (this.y - origin.y) - sin * (this.x - origin.x) + origin.y;
            return this;
        }
    }, {
        key: 'lerp',
        value: function lerp(destination, amount) {
            this.x = _lerp(this.x, destination.x, amount);
            this.y = _lerp(this.y, destination.y, amount);
            return this;
        }
    }, {
        key: 'position',
        get: function get() {
            return [this.x, this.y];
        }
    }]);

    return Point;
}();

//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡/
// Bounds
//*‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡*/

var Bounds = function () {
    function Bounds(x, y, w, h) {
        _classCallCheck(this, Bounds);

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        var hw = w / 2;
        var hh = h / 2;
        this.center = new Point(hw, hh);
        this.position = new Point(x, y);
    }

    _createClass(Bounds, [{
        key: 'offsetOuter',
        value: function offsetOuter(offset) {
            var _params = _slicedToArray(this.params, 4),
                x = _params[0],
                y = _params[1],
                w = _params[2],
                h = _params[3];

            return new Bounds(x - offset, y - offset, w + offset * 2, h + offset * 2);
        }
    }, {
        key: 'offsetInner',
        value: function offsetInner(offset) {
            var _params2 = _slicedToArray(this.params, 4),
                x = _params2[0],
                y = _params2[1],
                w = _params2[2],
                h = _params2[3];

            return new Bounds(x + offset, y + offset, w - offset * 2, h - offset * 2);
        }
    }, {
        key: 'params',
        get: function get() {
            return [this.x, this.y, this.w, this.h];
        }
    }]);

    return Bounds;
}();

/*------------------------------*
 * Eye Canvas
 *------------------------------*/

var Eye = function (_Entity3) {
    _inherits(Eye, _Entity3);

    function Eye(_ref8) {
        var radius = _ref8.radius,
            x = _ref8.x,
            y = _ref8.y;

        _classCallCheck(this, Eye);

        var _this7 = _possibleConstructorReturn(this, (Eye.__proto__ || Object.getPrototypeOf(Eye)).call(this));

        _initialiseProps.call(_this7);

        _this7.r = radius;
        _this7.d = _this7.r * 2;
        _this7.x = x;
        _this7.y = y;
        _this7.pad = _this7.r / 1.5;

        _this7.w = _this7.d + _this7.pad * 2;
        _this7.h = _this7.d + _this7.pad * 2;
        _this7.center = new Point(_this7.r + _this7.pad, _this7.r + _this7.pad);

        _this7.pupil = _this7.center.clone();
        _this7.iris = _this7.center.clone();

        // animated
        _this7.pupilSize = _this7.r;
        _this7.pupilMin = _this7.r * 0.8;
        _this7.pupilMax = _this7.r;
        // relatvie sizes
        _this7.pupilRad = _this7.pupilSize / 3.2;
        _this7.irisRad = _this7.pupilSize / 2.2;

        _this7.maxPupilOffset = (_this7.r - _this7.pupilRad) * 0.5;
        _this7.maxIrisOffset = (_this7.r - _this7.irisRad) * 0.5;

        _this7.lidWidth = _this7.r / 12;
        // left and right corners
        _this7.lidLeft = new Point(_this7.pad, _this7.center.y);
        _this7.lidRight = new Point(_this7.w - _this7.pad, _this7.center.y);

        // current lid y pos
        _this7.lidPos = _this7.r / 3 + _this7.pad;
        // max open
        _this7.lidMax = _this7.lidPos;
        // min open
        _this7.lidMin = _this7.lidPos * 1.3;
        // current open height
        _this7.lidOpen = _this7.lidMax;

        _this7.blink = false;

        _this7.setupCanvas();
        _this7.addListeners();
        _this7.drawLocal();
        return _this7;
    }

    _createClass(Eye, [{
        key: 'addListeners',
        value: function addListeners() {
            window.addEventListener('mousedown', this.handleMouse('down'), false);
            window.addEventListener('mouseup', this.handleMouse('up'), false);
        }
    }, {
        key: 'setupCanvas',
        value: function setupCanvas() {
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
    }, {
        key: 'getShadowGradient',
        value: function getShadowGradient() {
            var rx = this.center.x;
            var ry = this.center.y;
            var whiteGradient = this.ctx.createRadialGradient(rx, ry, this.r + this.pad, rx, ry, 0);
            whiteGradient.addColorStop(0, '#f5b8b5');
            whiteGradient.addColorStop(1, '#c68eab');
            return whiteGradient;
        }
    }, {
        key: 'animateBlink',
        value: function animateBlink() {
            var closeY = this.center.y;

            if (this.blink === 'up') {
                this.lidPos = _lerp(this.lidPos, this.lidOpen, 0.3);
            } else if (this.blink === 'down') {
                this.lidPos = _lerp(this.lidPos, closeY, 0.2);
            }

            if (this.lidPos > closeY - 1 && this.blink === 'down') {
                this.blink = 'up';
            }
            if (this.lidPos < this.lidOpen - 1 && this.blink === 'up') {
                this.blink = false;
            }
        }
    }, {
        key: 'animatePupil',
        value: function animatePupil() {
            if (this.leer) {
                this.pupilSize = _lerp(this.pupilSize, this.pupilMin, 0.3);
            } else {
                this.pupilSize = _lerp(this.pupilSize, this.pupilMax, 0.2);
            }
            // update pupil rad
            this.pupilRad = this.pupilSize / 3.2;
        }
    }, {
        key: 'getCurve1Params',
        value: function getCurve1Params() {
            // control points
            var cx1 = this.center.x / 2.2 - this.lidPos / 2.2 + this.pad;
            var cy1 = this.lidPos;
            return [cx1, cy1, this.center.x, this.lidPos];
        }
    }, {
        key: 'getCurve2Params',
        value: function getCurve2Params() {
            // control points
            var cx1 = this.center.x / 2.2 - this.lidPos / 2.2 + this.pad;
            var cy1 = this.lidPos;
            return [this.w - cx1, cy1, this.lidRight.x, this.lidRight.y];
        }
    }, {
        key: 'drawLid',
        value: function drawLid() {
            var _ctx, _ctx2;

            this.ctx.globalCompositeOperation = 'destination-out';

            this.ctx.beginPath();
            this.ctx.moveTo(this.lidLeft.x, this.lidLeft.y);

            // this.ctx.bezierCurveTo(cx1, cy1, cx2, cy2, this.lidRight.x, this.lidRight.y);
            (_ctx = this.ctx).quadraticCurveTo.apply(_ctx, _toConsumableArray(this.getCurve1Params()));
            (_ctx2 = this.ctx).quadraticCurveTo.apply(_ctx2, _toConsumableArray(this.getCurve2Params()));

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
    }, {
        key: 'drawBackgroundShadow',
        value: function drawBackgroundShadow() {
            var _ctx3, _ctx4;

            // gradient for background shadow
            this.ctx.fillStyle = this.getShadowGradient();
            this.ctx.beginPath();
            this.ctx.moveTo(this.lidLeft.x, this.lidLeft.y);
            (_ctx3 = this.ctx).quadraticCurveTo.apply(_ctx3, _toConsumableArray(this.getCurve1Params()));
            (_ctx4 = this.ctx).quadraticCurveTo.apply(_ctx4, _toConsumableArray(this.getCurve2Params()));
            // close off around the edges
            this.ctx.lineTo(this.w, this.center.y);
            this.ctx.lineTo(this.w, 0);
            this.ctx.lineTo(0, 0);
            this.ctx.lineTo(0, this.center.y);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }, {
        key: 'drawEyeLines',
        value: function drawEyeLines(upper) {
            var _tmpCtx, _tmpCtx2;

            // repeating for eye lines
            // drawing to a tmp canvas
            this.tmpCtx.lineWidth = this.lidWidth;
            this.tmpCtx.lineCap = 'round';
            this.tmpCtx.strokeStyle = upper ? '#c68eab' : '#f5b8b5';
            this.tmpCtx.beginPath();
            this.tmpCtx.moveTo(this.lidLeft.x, this.lidLeft.y);
            (_tmpCtx = this.tmpCtx).quadraticCurveTo.apply(_tmpCtx, _toConsumableArray(this.getCurve1Params()));
            (_tmpCtx2 = this.tmpCtx).quadraticCurveTo.apply(_tmpCtx2, _toConsumableArray(this.getCurve2Params()));
            this.tmpCtx.stroke();
            // cuts off stroke ends
            this.tmpCtx.clearRect(0, this.center.y, this.w, this.h / 2);

            // draw tmp to normal canvas
            this.ctx.drawImage(this.tmp, 0, 0, this.w, this.h);

            // clear tmp for later
            this.tmpCtx.clearRect(0, 0, this.w, this.h);
        }
    }, {
        key: 'drawLids',
        value: function drawLids() {
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
    }, {
        key: 'drawWhites',
        value: function drawWhites() {
            // whites
            var rx = this.center.x;
            var ry = this.center.y;
            var gradient = this.ctx.createRadialGradient(rx, ry, this.r, rx, ry, 0);
            gradient.addColorStop(1, 'white');
            gradient.addColorStop(0.5, '#edf8ff');
            gradient.addColorStop(0, '#dce6fa');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.w, this.h);
        }
    }, {
        key: 'drawIris',
        value: function drawIris() {
            // color
            this.ctx.fillStyle = '#4eb1b6';
            this.ctx.beginPath();
            this.ctx.arc(this.iris.x, this.iris.y, this.irisRad, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }, {
        key: 'drawPupil',
        value: function drawPupil() {
            // pupil
            this.ctx.fillStyle = '#2c2f34';
            this.ctx.beginPath();
            this.ctx.arc(this.pupil.x, this.pupil.y, this.pupilRad, 0, 2 * Math.PI);
            this.ctx.fill();
            //glare
            var off = this.r / 4;
            var x = this.center.x - off;
            var y = this.center.y - off;
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(Math.PI / 4);

            this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
            var size = this.r / 15;
            this.ctx.fillRect(0, 0, size, size);
            this.ctx.fillRect(0, size + size / 2, size, size / 2);
            this.ctx.restore();
        }
    }, {
        key: 'drawLocal',
        value: function drawLocal() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawWhites();
            this.drawIris();
            this.drawPupil();
            this.drawLids();
        }
    }, {
        key: 'updatePupilPosition',
        value: function updatePupilPosition(pointer, tick) {
            var center = this.center;

            if (pointer.position.x === null) {
                var x = this.toValue(Math.sin(tick / 100) * window.innerWidth);
                var y = this.toValue(Math.sin(tick / 110) * window.innerHeight / 3 + window.innerHeight / 3);
                pointer = {
                    position: new Point(x, y)
                };
            }

            var angle = pointer.position.angleRadians(this);
            var dist = pointer.position.distance(this);

            var pupDistNorm = scaleBetween(dist, 0, this.maxPupilOffset, 0, 400);
            var maxDistancePup = clamp(pupDistNorm, 0, this.maxPupilOffset);

            var irisDistNorm = scaleBetween(dist, 0, this.maxIrisOffset, 0, 400);
            var maxDistanceIris = clamp(irisDistNorm, 0, this.maxIrisOffset);

            this.pupilDest = center.clone().moveAtAngle(angle, -maxDistancePup);
            this.irisDest = center.clone().moveAtAngle(angle, -maxDistanceIris);

            this.pupil = this.pupil.lerp(this.pupilDest, 0.1);
            this.iris = this.iris.lerp(this.irisDest, 0.1);
        }
    }]);

    return Eye;
}(Entity);

var _initialiseProps = function _initialiseProps() {
    var _this8 = this;

    this.handleMouse = function (direction) {
        return function () {
            _this8.blink = direction;
            _this8.leer = direction === 'down';
            _this8.lidOpen = direction === 'down' ? _this8.lidMin : _this8.lidMax;
        };
    };

    this.draw = function (_ref9) {
        var ctx = _ref9.ctx;

        _this8.drawLocal();

        var width = _this8.canvas.width;
        var x = _this8.x - width / 2;
        var height = _this8.canvas.height;
        var y = _this8.y - height / 2;

        ctx.drawImage(_this8.canvas, x, y, width, height);
    };

    this.update = function (_ref10) {
        var pointer = _ref10.pointer,
            tick = _ref10.tick;

        if (tick % 200 === 0 || tick % 240 === 0 && !_this8.leer) {
            _this8.blink = 'down';
        }
        // @TODO: such poverty animations, use easing functions
        _this8.animateBlink();
        _this8.animatePupil();

        _this8.updatePupilPosition(pointer, tick);
    };
};

var run = function run() {
    var DPR = window.devicePixelRatio || 1;
    var radius = window.innerWidth / 12 * DPR;
    new Canvas({
        canvas: document.getElementById('canvas'),
        pointer: new Pointer(),
        entities: [new Background(), new Eye({
            radius: radius,
            x: window.innerWidth / 2 * DPR - radius * 2,
            y: window.innerHeight / 2 * DPR
        }), new Eye({
            radius: radius,
            x: window.innerWidth / 2 * DPR + radius * 2,
            y: window.innerHeight / 2 * DPR
        }), new Cursor(10)]
    });
};

// window.addEventListener('resize', run, false);

// Kick off
run();