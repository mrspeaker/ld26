(function (Ω) {
	"use strict";

	var PaintBullet = Ω.Entity.extend({

		w: 10,
		h: 10,
		falling: false,
		speed: 1,

		alive: true,

		init: function (x, y, angle, parent) {

			this.x = x;
			this.y = y;
			this.xspeed = Math.cos(angle) * 12;
			this.yspeed = Math.sin(angle) * 12;

			this.parent = parent;

		},

		tick: function (map) {

			var xo = this.xspeed,
				yo = this.yspeed;

			yo += 1;

			this.move(xo, yo, map);

			return this.alive;

		},

		hitBlocks: function (b) {

			this.alive = false;
			this.parent.bombed(this.x, this.y);

		},

		render: function (gfx) {

			var c = gfx.ctx;

			c.fillStyle = "rgb(255, 64, 156)";
			c.fillRect(this.x, this.y, this.w, this.h);

		}

	});

	window.PaintBullet = PaintBullet;
}(Ω));
