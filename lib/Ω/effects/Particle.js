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
			c.fillStyle = "rgba(100, 0, 0, " + (0.3 + this.parent.life / this.parent.maxLife) + ")";
			c.fillRect(this.x + x, this.y + y, this.w, this.h);

		}

	};

	Ω.Particle = Particle;

}(Ω));
