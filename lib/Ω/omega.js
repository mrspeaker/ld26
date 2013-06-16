var Ω = (function() {

	"use strict";

	var preloading = true,
		assetsToLoad = 0,
		maxAssets = 0,
		timers = []

	return {
		_onload: null,
		_progress: null,

		env: {
			w: 0,
			h: 0
		},

		preload: function () {

			if (!preloading) {
				return function () {};
			}

			maxAssets = Math.max(++assetsToLoad, maxAssets);

			return function () {

				if (--assetsToLoad === 0) {
					preloading = false;
					Ω._onload && Ω._onload();
				} else {
					Ω._progress && Ω._progress(assetsToLoad, maxAssets)
				}

			}
		},

		timers: {

			add: function (timer) {

				timers.push(timer);

			},

			tick: function () {

				timers = timers.filter(function (t) {

					return t.tick();

				});

			}

		}

	};

}());

// Polyfills
Array.isArray || (Array.isArray = function (a){ return '' + a !== a && {}.toString.call(a) == '[object Array]' });
window.requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function( callback ){
    	window.setTimeout(callback, 1000 / 60);
  	};

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(Ω){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  Ω.Class = function(){};

  // Create a new Class that inherits from this class
  Ω.Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init ) {
        this.init.apply(this, arguments);
      }
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
}(Ω));(function (Ω) {

	"use strict";

	Ω.utils = {

		rand: function (min, max) {

			return Math.floor(Math.random() * min);

		},

		now: function () {

			return utils.now(); // window.game.time * 1000; //

		},

		since: function (time) {

			return utils.now() - time;

		},

		toggle: function (time, steps, offset) {

			return ((utils.now() + (offset || 0)) / time) % steps >> 0;

		},

		dist: function (a, b) {

			var dx = a.x ? a.x - b.x : a[0] - b[0],
				dy = a.y ? a.y - b.y : a[1] - b[1];

			return Math.sqrt(dx * dx + dy * dy);

		},

		center: function (e) {

			return {
				x: e.x + e.w / 2,
				y: e.y + e.h / 2
			};

		},

		angleBetween: function (a, b) {

			var dx = a.x - b.x,
				dy = a.y - b.y,
				angle = Math.atan2(dy, dx);

			return angle;// % Math.PI;

		},

		snap: function(value, snapSize) {

			return Math.floor(value / snapSize) * snapSize;

		},

		loadScripts: function (scripts, cb) {

			var loaded = 0;

			scripts.forEach(function (path) {

				var script = document.createElement('script'),
					qs = env.desktop ? "?" + new Date().getTime() : "";

				script.src = "scripts/" + path + ".js" + qs;
				script.onload = function () {
					resources.toLoadLoaded++;
					if (loaded++ === scripts.length - 1) {
						cb && cb();
					}
				};

				document.body.appendChild(script);

			});

		},

		getByKeyValue: function (arrayOfObj, key, value) {

			return this.getAllByKeyValue(arrayOfObj, key, value)[0];

		},

		getAllByKeyValue: function (arrayOfObj, key, value) {

			var found = [];

			for (var i in arrayOfObj) {
				if (arrayOfObj[i][key] && arrayOfObj[i][key] === value) {
					found.push(arrayOfObj[i]);
				}
			}
			return found;

		}

	};

}(Ω));
(function (Ω) {

	"use strict";

	var rays = {

		cast: function (angle, originX, originY, map) {

			angle %= Math.PI * 2;
			if (angle < 0) angle += Math.PI * 2;

			var twoPi = Math.PI * 2,
				ox = originX / map.sheet.w,
				oy = originY / map.sheet.h,
				right = angle > twoPi * 0.75 || angle < twoPi * 0.25,
				up = angle > Math.PI,
				sin = Math.sin(angle),
				cos = Math.cos(angle),
				dist = 0,
				distVertical = 0,
				distX,
				distY,
				xHit = 0,
				yHit = 0,
				cell = 0,
				wallX,
				wallY,

				slope = sin / cos,
				dx = right ? 1 :  -1,
				dy = dx * slope,

				x = right ? Math.ceil(ox) : Math.floor(ox),
				y = oy + (x - ox) * slope;

			while (x >= 0 && x < map.cellW && y >=0 && y < map.cellH) {

				wallX = Math.floor(x + (right ? 0 : -1));
				wallY = Math.floor(y);

				cell = map.cells[wallY][wallX];
				if (cell > 0) {
					distX = x - ox;
					distY = y - oy;
					dist = Math.sqrt(distX * distX + distY * distY);

					xHit = x;
					yHit = y;
					break;
				}
				x += dx;
				y += dy;
			}

			// Check vertical walls
			slope = cos / sin;
			dy = up ? -1 : 1;
			dx = dy * slope;
			y = up ? Math.floor(oy) : Math.ceil(oy);
			x = ox + (y - oy) * slope;

			while (x >= 0 && x < map.cellW && y >=0 && y < map.cellH) {

				wallY = Math.floor(y + (up ? -1 : 0));
				wallX = Math.floor(x);

				if(wallY < 0) {
					break;
				}

				cell = map.cells[wallY][wallX];
				if (cell > 0) {
					distX = x - ox;
					distY = y - oy;
					distVertical = Math.sqrt(distX * distX + distY * distY);
					if (!dist || distVertical < dist) {
						dist = distVertical;
						xHit = x;
						yHit = y;
					}
					break;
				}
				x += dx;
				y += dy;
			}

			if (dist) {
				return {
					x: xHit,
					y: yHit
				}
			} else {
				return null;
			}

		},

		draw: function (gfx, ox, oy, rayX, rayY) {

			var c = gfx.ctx;


			c.save();
			c.strokeStyle = "rgba(255, 64, 156, 0.2)";
			c.lineWidth = 10;

			c.beginPath();
			c.moveTo(ox, oy);
			c.lineTo(rayX, rayY);
			c.closePath();
			c.stroke();

			c.strokeStyle = "rgba(255, 64, 156, 0.7)";
			c.lineWidth = 3;

			c.beginPath();
			c.moveTo(ox, oy);
			c.lineTo(rayX, rayY);
			c.closePath();
			c.stroke();


			c.restore();

		}

	}

	Ω.rays = rays;

}(Ω));
(function (Ω) {

	"use strict";

	var Timer = Ω.Class.extend({

		init: function (time, cb, done) {

			Ω.timers.add(this);

			this.time = time;
			if (!done) {
				done = cb;
				cb = null
			}
			this.max = time;
			this.cb = cb;
			this.done = done;

		},

		tick: function () {

			this.time -= 1;

			if (this.time < 0) {
				this.done && this.done();
				return false;
			}
			this.cb && this.cb(1 - (this.time / this.max));

			return true;
		}

	});

	Ω.timer = function (time, cb, done) {
		return new Timer(time, cb, done);
	};

}(Ω));
(function (Ω) {

	"use strict";

	var images = {};

	var gfx = {

		init: function (ctx) {

			this.ctx = ctx;
			this.canvas = ctx.canvas;

			this.w = this.canvas.width;
			this.h = this.canvas.height;

		},

		loadImage: function (path, cb) {

			if (images[path]) {
				setTimeout(function () {
					cb && cb(images[path]);
				}, 0);
				return images[path];
			}

			var image = new Image();

			image.src = path;
			image.onload = function() {
				cb && cb();
			};
			images[path] = image;
			return image;

		},

		drawImage: function (img, x, y) {

			this.ctx.drawImage(
				img,
				x,
				y);
		},

		createCanvas: function (w, h) {
			var cn = document.createElement("canvas");
			cn.setAttribute("width", w);
			cn.setAttribute("height", h);
			return cn.getContext("2d");
		},

		text: {

			drawShadowed: function (msg, x, y, shadow, font) {

				var c = gfx.ctx;

				shadow = shadow || 2;
				if (font) {
					c.font = font;
				}
				c.fillStyle = "#000";
				c.fillText(msg, x + shadow, y + shadow);
				c.fillStyle = "#fff";
				c.fillText(msg, x, y);

			},


			getWidth: function (msg) {

				return gfx.ctx.measureText(msg).width;

			},

			getHalfWidth: function (msg) {

				return this.getWidth(msg) / 2;

			},

			getHeight: function (msg) {

				return gfx.ctx.measureText(msg).height;

			},

			getHalfHeight: function (msg) {

				return this.getHeight(msg) / 2;

			}

		}

	};

	Ω.gfx = gfx;

}(Ω));
(function (Ω) {

	"use strict";

	var keys = {},
		mouse = {
			x: null,
			y: null
		},
		actions = {},
		input,
		el;

	input = {

		KEYS: {
			enter: 13,
			space: 32,
			escape: 27,
			up: 38,
			down: 40,
			left: 37,
			right: 39,

			w: 87,
			a: 65,
			s: 83,
			d: 68,

			az_w: 90,
			az_a: 81,
			az_s: 83,
			az_d: 68,

			mouse1: -1,
			mouse2: -2,
			mouse3: -3,
			wheelUp: -4,
			wheelDown: -5
		},

		mouse: mouse,

		init: function (dom) {

			el = dom;

			bindKeys();
			bindMouse();

		},

		reset: function () {

			for(var i in keys) {
				var key = keys[i];
				key.isDown = false;
				key.wasDown = false;
			};

		},

		tick: function () {

			var key;

			for(key in keys) {
				keys[key].wasDown = keys[key].isDown;
			}

		},

		bind: function (code, action) {

			if (typeof code !== "number") {
				code = this.KEYS[code];
				if (!code) {
					console.error("Could not bind input: ", code);
					return;
				}
			}

			keys[code] = {
				action: action,
				isDown: false,
				wasDown: false
			};
			if (!actions[action]) {
				actions[action] = [];
			}
			actions[action].push(code);

		},

		binds: function (keys) {

			var self = this;

			keys.forEach(function (k) {

				self.bind(k[0], k[1]);

			});

		},

		pressed: function (action) {

			return this.isDown(action) && !(this.wasDown(action));

		},

		isDown: function (action) {
			var actionCodes = actions[action] || [];
			var back = actionCodes.some(function (code) {
				return keys[code].isDown;
			});
			return back;

		},

		wasDown: function (action) {
			var actionCodes = actions[action] || [];
			return actionCodes.some(function (k) {
				return keys[k].wasDown;
			});
		},

		release: function (action) {
			var actionCodes = actions[action] || [];
			actionCodes.forEach(function (code) {
				keyed(code, false);
			});
		}
	}

	function keyed(code, isDown) {

		if (keys[code]) {
			keys[code].wasDown = keys[code].isDown;
			keys[code].isDown = isDown;
		}

	}

	function bindKeys() {

		document.addEventListener('keydown', function(e){
			keyed(e.keyCode, true);
		}, false );

		document.addEventListener('keyup', function(e){
			keyed(e.keyCode, false);
		}, false );

	}

	function bindMouse() {

		function setPos(e) {

			var relX = e.clientX - el.offsetLeft,
				relY = e.clientY - el.offsetTop;

			mouse.diff = {
				x: mouse.x - relX,
				y: mouse.y - relY
			};
			mouse.prev = {
				x: mouse.x,
				y: mouse.y
			};
			mouse.x = relX;
			mouse.y = relY;
		}

		document.addEventListener('mousedown', function(e){

			if (e.which === 1) {
				setPos(e);
				keyed(-1, true);
			}

		});

		document.addEventListener('mousemove', function(e){

			setPos(e);

		});

		document.addEventListener('mouseup', function(e){

			if (e.which === 1) {
				setPos(e);
				keyed(-1, false);
			}

		});
	}

	Ω.input = input;

}(Ω));
(function (Ω) {

	"use strict";

	var Image = Ω.Class.extend({

		init: function (path) {

			this.path = path;
			this.img = Ω.gfx.loadImage(path, (function (){
				return Ω.preload();
			}()));

		},

		render: function (gfx, x, y) {

			gfx.ctx.drawImage(
				this.img,
				x,
				y
			);
		}

	});

	Ω.Image = Image;

}(Ω));
(function (Ω) {

	"use strict";

	var sounds = [],
		Sound;

	Sound = Ω.Class.extend({

		ext: document.createElement('audio').canPlayType('audio/mpeg;') === "" ? ".ogg" : ".mp3",

		init: function (path, volume, loop) {

			var audio = new window.Audio();

			audio.src = path + this.ext;
			audio.volume = volume || 1;
			audio.loop = loop;

			// FIXME: add to preload list
			audio.addEventListener("canplaythrough", (function (){
				return Ω.preload();
			}()));
			audio.load();

			this.audio = audio;

			sounds.push(audio);

		},

		rewind: function () {

			this.audio.pause();
			try{
	        	this.audio.currentTime = 0;
	    	} catch(err){
	        	//console.log(err);
	    	}

		},

		play: function () {

			this.rewind();
			this.audio.play();
		}

	});

	Sound._reset = function () {

		// Should check for canplaythrough before doing anything...
		for(var i = 0; i < sounds.length; i++) {
			sounds[i].pause();
			try{
	        	sounds[i].currentTime  = 0;
	    	} catch(err){
	        	//console.log(err);
	    	}
		}
	};

	Ω.Sound = Sound;

}(Ω));
(function (Ω) {

	"use strict";

	var Camera = Ω.Class.extend({

		x: 0,
		y: 0,
		w: 0,
		h: 0,
		debug: false,

		init: function (x, y, w, h) {
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.zoom = 1;
		},

		tick: function () {},

		render: function (gfx, renderables) {
			var c = gfx.ctx,
				self = this,
				minX = this.x,
				minY = this.y,
				maxX = this.x + this.w,
				maxY = this.y + this.h;

			c.save();
			c.translate(-this.x, -this.y);
			//c.scale(this.zoom, this.zoom);

			renderables
				// Flatten to an array
				.reduce(function (ac, e) {

					if (Array.isArray(e)) {
						return ac.concat(e);
					}
					if (e !== null) {
						ac.push(e);
					}
					return ac;

				}, [])
				// Remove out-of-view entites
				.filter(function (r) {

					if (r._forceRender) {
						return true;
					}

					return !(
						r.x + r.w < self.x ||
						r.y + r.h < self.y ||
						r.x > self.x + self.w ||
						r.y > self.y + self.h);

				})
				// Draw 'em
				.forEach(function (r) {

					r.render(gfx, self);

				});

			c.restore();

		}

	});

	Ω.Camera = Camera;

}(Ω));
(function (Ω) {

	"use strict";

	var TrackingCamera = Ω.Camera.extend({

		x: 0,
		y: 0,
		w: 0,
		h: 0,
		xRange: 80,
		yRange: 60,

		init: function (entity, x, y, w, h) {

			this.w = w;
			this.h = h;
			this.zoom = 1;

			this.track(entity);

		},

		track: function (entity) {
			this.entity = entity;
			this.x = entity.x - (Ω.env.w / 2) + (entity.w / 2);
			this.y = entity.y - (Ω.env.h / 2);
		},

		tick: function () {

			var center = Ω.utils.center(this),
				e = this.entity,
				xr = this.xRange,
				yr = this.yRange;

			if(e.x < center.x - xr) {
				this.x = e.x - (Ω.env.w / 2) + xr;
			}
			if(e.x + e.w > center.x + xr) {
				this.x = e.x + e.w - (Ω.env.w / 2) - xr;
			}
			if(e.y < center.y - yr) {
				this.y = e.y - (Ω.env.h / 2) + yr;
			}
			if(e.y + e.h > center.y + yr) {
				this.y = e.y + e.h - (Ω.env.h / 2) - yr;
			}

		},

		render: function (gfx, renderables) {

			if (!this.debug) {
				this._super(gfx, renderables);
				return;
			}

			this._super(gfx, renderables.concat([{
				render: function (gfx, cam) {

					var center = Ω.utils.center(cam);

					gfx.ctx.strokeStyle = "rgba(200, 0, 0, 0.6)";
					gfx.ctx.strokeRect(
						center.x - cam.xRange,
						center.y - cam.yRange,
						cam.xRange * 2,
						cam.yRange * 2);

				}
			}]));

		}

	});

	Ω.TrackingCamera = TrackingCamera;

}(Ω));
(function (Ω) {

	"use strict";

	var Physics = Ω.Class.extend({

		checkCollision: function (entity, entities, cbName) {

			var i,
				j,
				a = entity,
				b,
				cbName = cbName || "hit",
				len = entities.length;

			for (i = 0; i < len; i++) {

				b = entities[i];

				if (a.x + a.w >= b.x &&
				    a.x <= b.x + b.w &&
				    a.y + a.h >= b.y &&
				    a.y <= b.y + b.h) {
					a[cbName](b);
					b[cbName](a);
				}
			}

		},

		checkCollisions: function (entities, cbName) {

			var i,
				j,
				a,
				b,
				cbName = cbName || "hit",
				all = entities.reduce(function (ac, e) {
					if (Array.isArray(e)) {
						return ac.concat(e);
					}
					ac.push(e);
					return ac;

				}, []),
				len = all.length;

			for (i = 0; i < len - 1; i++) {
				a = all[i];
				for (j = i + 1; j < len; j++) {
					b = all[j];

					if (a.x + a.w >= b.x &&
					    a.x <= b.x + b.w &&
					    a.y + a.h >= b.y &&
					    a.y <= b.y + b.h) {
						a[cbName](b);
						b[cbName](a);
					}
				}
			}
		}

	});

	Ω.Physics = Physics;

}(Ω));

(function (Ω) {

	"use strict";

	var Particle = Ω.Class.extend({

		particles: null,
		running: false,

		init: function (opts, cb) {

			this.maxLife = opts.life || 40;
			this.life = this.maxLife;
			this.cb = cb;

			this.particles = [];
			for(var i = 0; i < 20; i++) {
				this.particles.push(
					new Part({}, this)
				);
			}

		},

		play: function (x, y, angle) {

			this.life = this.maxLife;
			this.x = x;
			this.y = y;
			this.running = true;
			this.particles.forEach(function (p) {
				p.reset(angle);
			});

		},

		tick: function (angle) {

			if (!this.running) {
				return;
			}

			this.life -= 1;

			this.particles.forEach(function (p) {
				if(!p.tick()){
					// restart with angle
				};
			});

			if (this.life < 0) {
				this.running = false;
				this.cb && this.cb();
			}

		},

		render: function (gfx) {

			var self = this;

			if (!this.running) {
				return;
			}

			this.particles.forEach(function (p) {
				p.render(gfx, self.x, self.y);
			});

		}

	});

	function Part (opts, parent) {
		this.parent = parent;
		this.x = 0;
		this.y = 0;
		this.w = 4;
		this.h = 4;
	}
	Part.prototype = {

		reset: function (angle) {
			this.life = this.parent.maxLife;
			this.x = 0;
			this.y = 0;

			this.xSpeed = Math.cos(angle) * (2 + (Math.random() * 2));
			this.ySpeed = Math.sin(angle) * (2 + (Math.random() * 2));
		},

		tick: function () {
			this.x += this.xSpeed;
			this.y += this.ySpeed;
			return this.life -= 1;
		},

		render: function (gfx, x, y) {

			var c = gfx.ctx;
			c.fillStyle = "rgba(255, 64, 156, " + (0.3 + this.parent.life / this.parent.maxLife) + ")";
			c.fillRect(this.x + x, this.y + y, this.w, this.h);

		}

	};

	Ω.Particle = Particle;

}(Ω));
(function (Ω) {

	"use strict";

	var Spring = Ω.Class.extend({

		vel: [0, 0],

		init: function (length, strength, friction, gravity) {

			this.springLength = length;
			this.spring = strength;
			this.friction = friction;
			this.gravity = gravity;

		},

		tick: function (fixed, springer) {

			var dx = springer.x - fixed.x,
				dy = springer.y - fixed.y,
				angle = Math.atan2(dy, dx),
				tx = fixed.x + Math.cos(angle) * this.springLength,
				ty = fixed.y + Math.sin(angle) * this.springLength;

			this.vel[0] += (tx - springer.x) * this.spring;
			this.vel[1] += (ty - springer.y) * this.spring;

			this.vel[0] *= this.friction;
			this.vel[1] *= this.friction;

			this.vel[1] += this.gravity;

			return this.vel;

		},

		reset: function () {

			this.vel = [0, 0];


		}

	});

	window.Spring = Spring;

}(Ω));
(function (Ω) {

	"use strict";

	var Shake = Ω.Class.extend({

		init: function (time) {

			this.time = time || 10;

		},

		tick: function () {

			return this.time--;

		},

		render: function (gfx, x, y) {

			gfx.ctx.translate(Math.random() * 8, Math.random() * 4);

		}

	});

	Ω.Shake = Shake;

}(Ω));
(function (Ω) {

	"use strict";

	var Screen = Ω.Class.extend({

		loaded: true,

		tick: function () {},

		render: function (gfx) {

			var c = gfx.ctx;

			c.fillStyle = "hsl(0, 100%, 100%)";
			c.fillRect(0, 0, gfx.w, gfx.h);

		}

	});

	Ω.Screen = Screen;

}(Ω));
(function (Ω) {

	"use strict";

	var Dialog = Ω.Class.extend({

		killKey: "escape",

		tick: function () {

			if (Ω.input.pressed(this.killKey)) {
				game.clearDialog();
			}

		},

		render: function (gfx) {

			var c = gfx.ctx;

			c.fillStyle = "rgba(0, 0, 0, 0.7)";
			c.fillRect(gfx.w * 0.15, gfx.h * 0.25, gfx.w * 0.7, gfx.h * 0.5);

		}

	});

	Ω.Dialog = Dialog;

}(Ω));
(function (Ω) {

	"use strict";

	var SpriteSheet = Ω.Class.extend({

		init: function (path, width, height) {

			this.path = path;
			this.w = width;
			this.h = height || width;
			this.cellW = 2;
			this.cellH = 0;

			var self = this;

			this.sheet = Ω.gfx.loadImage(path, (function (){
				return function (img) {
					// Holy poopballs - fix this mess! if image already
					// loaded by gfx.load image then its returned before load event...
					if (img) {
						img && img.addEventListener("load", function(){
							self.cellW = img.width / self.w | 0;
							self.cellH = img.height / self.h | 0;
							Ω.preload();
						}, false);
					} else {
						self.cellW = self.sheet.width / self.w | 0;
						self.cellH = self.sheet.height / self.h | 0;
						Ω.preload();
					}
				}
			}()));

		},

		render: function (gfx, col, row, x, y, w, h, scale) {
			if(col === -1) {
				return;
			}
			scale = scale || 1;
			h = h || 1;
			w = w || 1;

			gfx.ctx.drawImage(
				this.sheet,
				col * this.w,
				row * this.h,
				w * this.w,
				h * this.h,
				x,
				y,
				w * this.w * scale,
				h * this.h * scale);
		}

	});

	Ω.SpriteSheet = SpriteSheet;

}(Ω));
(function (Ω) {

	"use strict";

	var Anims = Ω.Class.extend({

		current: null,
		all: null,

		init: function (anims) {

			if (anims.length) {
				this.all = anims;
				this.current = anims[0];
			}

		},

		tick: function () {

			this.current.tick();

		},

		add: function (anim) {

			if (!this.all) {
				this.all = [];
				this.current = anim;
			}
			this.all.push(anim);

		},

		get: function () {

			return this.current.name;

		},

		set: function (animName) {

			var anim = this.all.filter(function (anim) {
				return anim.name === animName;
			});

			if (anim.length) {
				this.current = anim[0];
				this.current.reset();
			}

		},

		setTo: function (animName) {

			if (this.get() !== animName) {
				this.set(animName);
			}

		},

		changed: function () {

			return this.current.changed;

		},

		render: function (gfx, x, y) {

			this.current.render(gfx, x, y);

		}

	});


	Ω.Anims = Anims;

}(Ω));(function (Ω) {

	"use strict";

	var Anim = Ω.Class.extend({

		init: function (name, sheet, speed, frames) {

			this.name = name;
			this.sheet = sheet;
			this.frames = frames;
			this.speed = speed;

			this.changed = false;

			this.reset();

		},

		tick: function () {

			var diff = Date.now() - this.frameTime;
			this.changed = false;

			if (diff > this.speed) {
				this.frameTime = Date.now() + (Math.min(this.speed, diff - this.speed));
				if (++this.curFrame > this.frames.length - 1) {
					this.curFrame = 0;
				};
				this.changed = true;
			};

		},

		reset: function () {
			this.curFrame = 0;
			this.frameTime = Date.now();
		},

		render: function (gfx, x, y) {

			this.sheet.render(
				gfx,
				this.frames[this.curFrame][0],
				this.frames[this.curFrame][1],
				x,
				y,
				1,
				1,
				1);

		}

	});

	Ω.Anim = Anim;

}(Ω));
(function (Ω) {

	"use strict";

	var Map = Ω.Class.extend({

		init: function (sheet, data) {

			this.sheet = sheet;
			this.cells = data;
			this.cellH = this.cells.length;
			this.cellW = this.cells[0].length;
			this.h = this.cellH * this.sheet.h;
			this.w = this.cellW * this.sheet.w;

		},

		render: function (gfx, camera) {

			// TODO: shouldn't mandate a camera. Draw to current view port?
			if (!camera) {
				console.error("Map needs a camera to render with");
				return;
			}

			var tw = this.sheet.w,
				th = this.sheet.h,
				cellW = this.sheet.cellW,
				cellH = this.sheet.cellH,
				stx = camera.x / tw | 0,
				sty = camera.y / th | 0,
				endx = stx + (camera.w / camera.zoom / tw | 0) + 1,
				endy = sty + (camera.h / camera.zoom / th | 0) + 1,
				j,
				i,
				cell;

			for (j = sty; j <= endy; j++) {
				if (j < 0 || j > this.cellH - 1) {
					continue;
				}
				for (i = stx; i <= endx; i++) {
					if (i > this.cellW - 1) {
						continue;
					}

					cell = this.cells[j][i];
					if (cell === 0) {
						continue;
					}

					this.sheet.render(
						gfx,
						(cell - 1) % cellW  | 0,
						(cell - 1) / cellW | 0,
						i * tw,
						j * th);
				}
			}

		},

		getBlocks: function (blocks) {

			var self = this;

			return blocks.map(function (b, i) {

				var row = b[1] / self.sheet.h | 0,
					col = b[0] / self.sheet.w | 0;

				if (row < 0 || row > self.cellH - 1) {
					return;
				}

				return self.cells[row][col];
			});

		},

		getBlockEdge: function(pos, vertical) {

			var snapTo = vertical ? this.sheet.h : this.sheet.w;

		    return Ω.utils.snap(pos, snapTo);

		}

	});

	Ω.Map = Map;

}(Ω));
(function (Ω) {

	"use strict";

	var IsoMap = Ω.Map.extend({

		init: function (sheet, data) {

			this._super(sheet, data);

		},

		render: function (gfx, camera) {

			var tw = this.sheet.w,
				th = this.sheet.h / 2,
				stx = camera.x / tw | 0,
				sty = camera.y / th | 0,
				endx = stx + (camera.w / camera.zoom / tw | 0) + 1,
				endy = sty + (camera.h / 0.25 / camera.zoom / th | 0) + 1,
				j,
				i,
				tileX,
				tileY,
				cell;

			for (j = sty; j <= endy; j++) {
				if (j < 0 || j > this.cellH - 1) {
					continue;
				}
				for (i = stx; i <= endx; i++) {
					if (i > this.cellW - 1) {
						continue;
					}
					cell = this.cells[j][i];
					if (cell === 0) {
						continue;
					}

					tileX = (i - j) * th;
					tileX += ((gfx.w / 2) / camera.zoom) - (tw / 2);
					tileY = (i + j) * (th / 2);

					this.sheet.render(
						gfx,
						cell - 1,
						0,
						tileX,
						tileY);
				}
			}

		}

	});

	Ω.IsoMap = IsoMap;

}(Ω));
(function (Ω) {

	"use strict";

	var RayCastMap = Ω.Map.extend({

		init: function (sheet, data, entity) {

			this.entity = entity;

			this._super(sheet, data);

		},

		castRays: function (gfx) {

			var idx = 0,
				i,
				rayPos,
				rayDist,
				rayAngle,
				fov = 60 * Math.PI / 180,
				viewDistance = (gfx.w / 2) / Math.tan((fov / 2)),
				numRays = 15,
				w = 16;

			/*for (var i = 0; i < numRays; i++) {
				rayPos = (-numRays / 2 + i) * w;
				rayDist = Math.sqrt(rayPos * rayPos + viewDistance * viewDistance);
				rayAngle = Math.asin(rayPos / rayDist);

				this.castRay(gfx, Math.PI + rayAngle, idx++);
			}*/
			var p = this.entity;
			for (var i = 0; i < Math.PI * 2; i+= 0.2) {
				var hit = Ω.rays.cast(i, p.x + p.w / 2, p.y + p.h / 2, this);

				if (hit) {
					Ω.rays.draw(gfx, p.x + p.w / 2, p.y + p.h / 2, hit.x, hit.y, this);
				}
			}

		},

		render: function (gfx, camera) {

			// TODO: raycast texture draw
			this._super(gfx, camera);

			this.castRays(gfx);

		}

	});

	Ω.RayCastMap = RayCastMap;

}(Ω));
(function (Ω) {

	"use strict";

	var Entity = Ω.Class.extend({

		x: 0,
		y: 0,
		w: 32,
		h: 32,

		falling: false,
		wasFalling: false,

		init: function () {

		},

		tick: function () {},

		hit: function (entity) {},

		hitBlocks: function(blocks) {},

		move: function (x, y, map) {

			// Temp holder for movement
			var xo,
				yo,

				xv,
				yv,

				hitX = false,
				hitY = false,

				xBlocks,
				yBlocks;

			if (this.falling) {
				y += this.speed * 2;
			}
			xo = x;
			yo = y;

			xv = this.x + xo;
			yv = this.y + yo;

			// check blocks given vertical movement
			yBlocks = map.getBlocks([
				[this.x, yv],
				[this.x, yv + (this.h - 1)],
				[this.x + (this.w - 1), yv],
				[this.x + (this.w - 1), yv + (this.h - 1)]
			]);

			// if overlapping edges, move back a little
			if (y < 0 && (yBlocks[0] || yBlocks[2])) {
				yo = map.getBlockEdge(this.y, "VERT") - this.y;
				hitY = true;
			}
			if (y > 0 && (yBlocks[1] || yBlocks[3])) {
				yo = map.getBlockEdge(yv + (this.h - 1), "VERT") - this.y - this.h;
				hitY = true;
				this.falling = false;
			}

			// Now check blocks given horizontal movement
			xBlocks = map.getBlocks([
				[xv, this.y],
				[xv, this.y + (this.h - 1)],
				[xv + (this.w - 1), this.y],
				[xv + (this.w - 1), this.y + (this.h - 1)]
			]);

			// if overlapping edges, move back a little
			if (x < 0 && (xBlocks[0] || xBlocks[1])) {
				xo = map.getBlockEdge(this.x) - this.x;
				hitX = true;
			}
			if (x > 0 && (xBlocks[2] || xBlocks[3])) {
				xo = map.getBlockEdge(xv + (this.w - 1)) - this.x - this.w;
				hitX = true;
			}

			if (hitX || hitY) {
				this.hitBlocks(hitX ? xBlocks : null, hitY ? yBlocks : null);
			}

			// Add the allowed movement
			this.x += xo;
			this.y += yo;

			return [xo, yo];
		},

		render: function (gfx) {}

	});

	Ω.Entity = Entity;

}(Ω));
(function (Ω) {

	"use strict";

	var Game = Ω.Class.extend({

		canvas: "body",

		running: false,

		preset_dt: 1 / 60,
		currentTime: Date.now(),
		accumulator: 0,

		screen: new Ω.Screen(),
		_screenPrev: null,
		_screenFade: 0,
		dialog: null,

		init: function (w, h, bgColor) {

			var ctx = initCanvas(this.canvas, w, h),
				self = this;

			Ω.env.w = ctx.canvas.width;
			Ω.env.h = ctx.canvas.height;

			ctx.fillStyle = bgColor || "#333";
			ctx.fillRect(0, 0, Ω.env.w, Ω.env.h);

			Ω.gfx.init(ctx);
			Ω.input.init(ctx.canvas);

			Ω._onload = function () {
				self.run(Date.now());
			};

			if (!Ω.preloading) {
				Ω._onload();
			}

            this.running = true;

		},

		reset: function () {},

		run: function () {

            var now = Date.now(),
                frameTime = Math.min((now - this.currentTime) / 1000, this.preset_dt),
                c;

            this.currentTime = now;
            this.accumulator += frameTime;

            if (this.running) {
                c = 0;
                while (this.accumulator >= this.preset_dt) {
                    c++;
                    this.tick();
                    this.accumulator -= this.preset_dt;
                }
                if (c > 1) {
                    console.log("ran " + c + " ticks");
                }

                this.render();
            }

            window.requestAnimationFrame(function () {
                game.run(Date.now());
            });

		},

		stop: function () {},

		tick: function () {

			if (this.dialog) {
				this.dialog.tick();
			} else {
				this.screen.loaded &&this.screen.tick();
				Ω.timers.tick();
			}
			Ω.input.tick();

		},

		render: function () {

			var gfx = Ω.gfx;

			if (!this.screen.loaded) {
				return;
			}

			this.screen.render(gfx);
			if (this.screenFade > 0) {
				gfx.ctx.globalAlpha = this.screenFade;
				this.screenPrev.render(gfx);
				gfx.ctx.globalAlpha = 1;
			}
			this.dialog && this.dialog.render(gfx);

		},

		setScreen: function (screen) {


			var self = this;

			this.screenPrev = this.screen;
			this.screen = screen;

			if (this.screenPrev) {
			    this.screenFade = 1;
			    Ω.timer(10, function (ratio) {

			        self.screenFade = 1 - ratio;

			    }, function () {

			        self.screenFade = 0;

			    });
			}

		},

		setDialog: function (dialog) {

			this.dialog = dialog;

		},

		clearDialog: function () {

			this.setDialog(null);

		}
	});

	/*
		Create or assign the canvas element
	*/
	function initCanvas(canvasSelector, w, h) {

		w = w || 400;
		h = h || 225;

		var selCanvas = document.querySelector(canvasSelector),
			newCanvas,
			ctx;

		if (selCanvas == null) {
			console.error("Canvas DOM container not found:", canvasSelector);
			canvasSelector = "body";
			selCanvas = document.querySelector(canvasSelector);
		}

		if (selCanvas.nodeName.toUpperCase() === "CANVAS") {
			var explicitWidth = selCanvas.getAttribute("width"),
				explicitHeight = selCanvas.getAttribute("height");

			if (explicitWidth === null) {
				selCanvas.setAttribute("width", w);
			}
			if (explicitHeight === null) {
				selCanvas.setAttribute("height", h);
			}
			ctx = selCanvas.getContext("2d");
		} else {
			newCanvas = document.createElement("canvas");
			newCanvas.setAttribute("width", w);
			newCanvas.setAttribute("height", h);
			selCanvas.appendChild(newCanvas);
			ctx = newCanvas.getContext("2d");
		}

		if (!ctx) {
			console.error("Could not get 2D context.");
		}

		return ctx;
	}

	Ω.Game = Game;

}(Ω));
