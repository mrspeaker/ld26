(function (Ω) {

	"use strict";

	var Player = Ω.Entity.extend({

		w: 25,
		h: 45,

		init: function (startX, startY, screen) {

			// FIXME: need event system (or something) instead of this.
			this.screen = screen;

			this.x = startX;
			this.y = startY;

			this.speed = 1;

			this.rays = [];

		},

		setMap: function (map) {
			this.map = map;
		},

		tick: function (map) {

			var x1 = 0,
				y1 = 0;

			if (Ω.input.isDown("left")) {
				x1 -= this.speed;
			}
			if (Ω.input.isDown("right")) {
				x1 += this.speed;
			}
			if (Ω.input.isDown("up")) {
				y1 -= this.speed;
			}
			if (Ω.input.isDown("down")) {
				y1 += this.speed;
			}

			this.move(x1, y1, map);

			// Test raycastin'
			this.rays = [];
			for (var i = 0; i < Math.PI * 2; i+= 0.2) {
				var hit = Ω.rays.cast(i, this.x + this.w / 2, this.y + this.h / 2, this.map);
				if (hit) {
					this.rays.push([
						this.x + this.w / 2,
						this.y + this.h / 2,
						hit.x * this.map.sheet.w,
						hit.y * this.map.sheet.h]);
				}
			}

		},

		hitBlocks: function (blocks) {

		},

		hit: function (by) {

		},

		render: function (gfx, map) {

			//Test raycastin'
			this.rays.forEach(function (r) {
				Ω.rays.draw(gfx, r[0], r[1], r[2], r[3], r[4], 32, 32);
			});

			gfx.ctx.strokeStyle = "rgba(100, 0, 0, 0.3)";
			gfx.ctx.strokeRect(this.x, this.y, this.w, this.h);

		}

	});

	window.Player = Player;

}(Ω));
