"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

{
  var Robot = function () {
    function Robot(color, light, size, x, y, struct) {
      _classCallCheck(this, Robot);

      this.x = x;
      this.points = [];
      this.links = [];
      this.frame = 0;
      this.dir = 1;
      this.size = size;
      this.color = Math.round(color);
      this.light = light;
      // ---- create points ----
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = struct.points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var p = _step.value;

          this.points.push(new Robot.Point(size * p.x + x, size * p.y + y, p.f));
        }
        // ---- create links ----
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = struct.links[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var link = _step2.value;

          var p0 = this.points[link.p0];
          var p1 = this.points[link.p1];
          var dx = p0.x - p1.x;
          var dy = p0.y - p1.y;
          this.links.push(new Robot.Link(this, p0, p1, Math.sqrt(dx * dx + dy * dy), link.size * size / 3, link.lum, link.force, link.disk));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    _createClass(Robot, [{
      key: "update",
      value: function update() {
        if (++this.frame % 20 === 0) this.dir = -this.dir;
        if (dancerDrag && this === dancerDrag && this.size < 16 && this.frame > 600) {
          dancerDrag = null;
          dancers.push(new Robot(this.color + 90, this.light * 1.25, this.size * 2, pointer.x, pointer.y - 100 * this.size * 2, struct));
          dancers.sort(function (d0, d1) {
            return d0.size - d1.size;
          });
        }
        // ---- update links ----
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.links[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var link = _step3.value;

            var p0 = link.p0;
            var p1 = link.p1;
            var dx = p0.x - p1.x;
            var dy = p0.y - p1.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist) {
              var tw = p0.w + p1.w;
              var r1 = p1.w / tw;
              var r0 = p0.w / tw;
              var dz = (link.distance - dist) * link.force;
              var sx = dx / dist * dz;
              var sy = dy / dist * dz;
              p1.x -= sx * r0;
              p1.y -= sy * r0;
              p0.x += sx * r1;
              p0.y += sy * r1;
            }
          }
          // ---- update points ----
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.points[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var point = _step4.value;

            // ---- dragging ----
            if (this === dancerDrag && point === pointDrag) {
              point.x += (pointer.x - point.x) * 0.1;
              point.y += (pointer.y - point.y) * 0.1;
            }
            // ---- dance ----
            if (this !== dancerDrag) {
              point.fn && point.fn(16 * Math.sqrt(this.size), this.dir);
            }
            // ---- verlet integration ----
            point.vx = point.x - point.px;
            point.vy = point.y - point.py;
            point.px = point.x;
            point.py = point.y;
            point.vx *= 0.995;
            point.vy *= 0.995;
            point.x += point.vx;
            point.y += point.vy + 0.01;
          }
          // ---- ground ----
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.links[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _link = _step5.value;

            var p1 = _link.p1;
            if (p1.y > canvas.height * ground - _link.size * 0.5) {
              p1.y = canvas.height * ground - _link.size * 0.5;
              p1.x -= p1.vx;
              p1.vx = 0;
              p1.vy = 0;
            }
          }
          // ---- screen limits ----
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        if (this.points[1].x < 0) this.points[1].x = 0;else if (this.points[1].x > canvas.width) this.points[1].x = canvas.width;
      }
    }, {
      key: "draw",
      value: function draw() {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = this.links[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var link = _step6.value;

            if (link.size) {
              var dx = link.p1.x - link.p0.x;
              var dy = link.p1.y - link.p0.y;
              var a = Math.atan2(dy, dx);
              var d = Math.sqrt(dx * dx + dy * dy);
              // ---- shadow ----
              ctx.save();
              ctx.translate(link.p0.x + link.size * 0.25, link.p0.y + link.size * 0.25);
              ctx.rotate(a);
              ctx.drawImage(link.shadow, -link.size * 0.5, -link.size * 0.5, d + link.size, link.size);
              ctx.restore();
              // ---- stroke ----
              ctx.save();
              ctx.translate(link.p0.x, link.p0.y);
              ctx.rotate(a);
              ctx.drawImage(link.image, -link.size * 0.5, -link.size * 0.5, d + link.size, link.size);
              ctx.restore();
            }
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }
      }
    }]);

    return Robot;
  }();

  Robot.Link = function Link(parent, p0, p1, dist, size, light, force, disk) {
    _classCallCheck(this, Link);

    // ---- cache strokes ----
    function stroke(color, axis) {
      var image = document.createElement("canvas");
      image.width = dist + size;
      image.height = size;
      var ict = image.getContext("2d");
      ict.beginPath();
      ict.lineCap = "round";
      ict.lineWidth = size;
      ict.strokeStyle = color;
      if (disk) {
        ict.arc(size * 0.5 + dist, size * 0.5, size * 0.5, 0, 2 * Math.PI);
        ict.fillStyle = color;
        ict.fill();
      } else {
        ict.moveTo(size * 0.5, size * 0.5);
        ict.lineTo(size * 0.5 + dist, size * 0.5);
        ict.stroke();
      }
      if (axis) {
        var s = size / 10;
        ict.fillStyle = "#000";
        ict.fillRect(size * 0.5 - s, size * 0.5 - s, s * 2, s * 2);
        ict.fillRect(size * 0.5 - s + dist, size * 0.5 - s, s * 2, s * 2);
      }
      return image;
    }
    this.p0 = p0;
    this.p1 = p1;
    this.distance = dist;
    this.size = size;
    this.light = light || 1.0;
    this.force = force || 0.5;
    this.image = stroke("hsl(" + parent.color + " ,30%, " + parent.light * this.light + "%)", true);
    this.shadow = stroke("rgba(0,0,0,0.5)");
  };
  Robot.Point = function Point(x, y, fn, w) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
    this.w = w || 0.5;
    this.fn = fn || null;
    this.px = x;
    this.py = y;
    this.vx = 0.0;
    this.vy = 0.0;
  };
  // ---- set canvas ----
  var canvas = {
    init: function init() {
      var _this = this;

      this.elem = document.querySelector("canvas");
      this.resize();
      window.addEventListener("resize", function () {
        return _this.resize();
      }, false);
      return this.elem.getContext("2d");
    },
    resize: function resize() {
      this.width = this.elem.width = this.elem.offsetWidth;
      this.height = this.elem.height = this.elem.offsetHeight;
      ground = this.height > 500 ? 0.85 : 1.0;
      for (var i = 0; i < dancers.length; i++) {
        dancers[i].x = (i + 2) * canvas.width / 9;
      }
    }
  };
  // ---- set pointer ----
  var pointer = {
    init: function init(canvas) {
      var _this2 = this;

      this.x = 0;
      this.y = 0;
      window.addEventListener("mousemove", function (e) {
        return _this2.move(e);
      }, false);
      canvas.elem.addEventListener("touchmove", function (e) {
        return _this2.move(e);
      }, false);
      window.addEventListener("mousedown", function (e) {
        return _this2.down(e);
      }, false);
      window.addEventListener("touchstart", function (e) {
        return _this2.down(e);
      }, false);
      window.addEventListener("mouseup", function (e) {
        return _this2.up(e);
      }, false);
      window.addEventListener("touchend", function (e) {
        return _this2.up(e);
      }, false);
    },
    down: function down(e) {
      this.move(e);
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = dancers[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var dancer = _step7.value;
          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = dancer.points[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var point = _step8.value;

              var dx = pointer.x - point.x;
              var dy = pointer.y - point.y;
              var d = Math.sqrt(dx * dx + dy * dy);
              if (d < 60) {
                dancerDrag = dancer;
                pointDrag = point;
                dancer.frame = 0;
              }
            }
          } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
              }
            } finally {
              if (_didIteratorError8) {
                throw _iteratorError8;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    },
    up: function up(e) {
      dancerDrag = null;
    },
    move: function move(e) {
      var touchMode = e.targetTouches,
          pointer = void 0;
      if (touchMode) {
        e.preventDefault();
        pointer = touchMode[0];
      } else pointer = e;
      this.x = pointer.clientX;
      this.y = pointer.clientY;
    }
  };
  // ---- init ----
  var dancers = [];
  var ground = 1.0;
  var ctx = canvas.init();
  pointer.init(canvas);
  var dancerDrag = null;
  var pointDrag = null;
  // ---- main loop ----
  var run = function run() {
    requestAnimationFrame(run);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.15);
    ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15);
    for (var i = 0; i < dancers.length; i++) {
      var d0 = dancers[i];
      d0.update();
      d0.draw();
      // separation behavior
      for (var j = i + 1; j < dancers.length; j++) {
        var d1 = dancers[j];
        var minDist = Math.abs(d0.x - d1.x);
        var actDist = Math.abs(d0.points[2].x - d1.points[2].x);
        if (actDist < minDist * 0.8) {
          var d = minDist - actDist;
          if (d0.points[2].x < d1.points[2].x) {
            d0.points[2].x -= d * 0.001;
            d1.points[2].x += d * 0.001;
          } else {
            d0.points[2].x += d * 0.001;
            d1.points[2].x -= d * 0.001;
          }
        }
      }
    }
  };
  // ---- robot structure ----
  var struct = {
    points: [{
      x: 0,
      y: -4,
      f: function f(s, d) {
        this.y -= 0.01 * s;
      }
    }, {
      x: 0,
      y: -16,
      f: function f(s, d) {
        this.y -= 0.02 * s * d;
      }
    }, {
      x: 0,
      y: 12,
      f: function f(s, d) {
        this.y += 0.02 * s * d;
      }
    }, { x: -12, y: 0 }, { x: 12, y: 0 }, {
      x: -3,
      y: 34,
      f: function f(s, d) {
        if (d > 0) {
          this.x += 0.01 * s;
          this.y -= 0.015 * s;
        } else {
          this.y += 0.02 * s;
        }
      }
    }, {
      x: 3,
      y: 34,
      f: function f(s, d) {
        if (d > 0) {
          this.y += 0.02 * s;
        } else {
          this.x -= 0.01 * s;
          this.y -= 0.015 * s;
        }
      }
    }, {
      x: -28,
      y: 0,
      f: function f(s, d) {
        this.x += this.vx * 0.025;
        this.y -= 0.001 * s;
      }
    }, {
      x: 28,
      y: 0,
      f: function f(s, d) {
        this.x += this.vx * 0.025;
        this.y -= 0.001 * s;
      }
    }, {
      x: -3,
      y: 64,
      f: function f(s, d) {
        this.y += 0.015 * s;
        if (d > 0) {
          this.y -= 0.01 * s;
        } else {
          this.y += 0.05 * s;
        }
      }
    }, {
      x: 3,
      y: 64,
      f: function f(s, d) {
        this.y += 0.015 * s;
        if (d > 0) {
          this.y += 0.05 * s;
        } else {
          this.y -= 0.01 * s;
        }
      }
    }],
    links: [{ p0: 3, p1: 7, size: 12, lum: 0.5 }, { p0: 1, p1: 3, size: 24, lum: 0.5 }, { p0: 1, p1: 0, size: 60, lum: 0.5, disk: 1 }, { p0: 5, p1: 9, size: 16, lum: 0.5 }, { p0: 2, p1: 5, size: 32, lum: 0.5 }, { p0: 1, p1: 2, size: 50, lum: 1 }, { p0: 6, p1: 10, size: 16, lum: 1.5 }, { p0: 2, p1: 6, size: 32, lum: 1.5 }, { p0: 4, p1: 8, size: 12, lum: 1.5 }, { p0: 1, p1: 4, size: 24, lum: 1.5 }]
  };
  // ---- instanciate robots ----
  for (var i = 0; i < 6; i++) {
    dancers.push(new Robot(i * 360 / 7, 80, 4, (i + 2) * canvas.width / 9, canvas.height * ground - 300, struct));
  }
  run();
}