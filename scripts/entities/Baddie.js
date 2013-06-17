(function (Ω) {
	"use strict";

	var Baddie = Ω.Entity.extend({

		sheet: new Ω.SpriteSheet("res/heads.png", 16),

		ticks: 0,

		init: function (x, y, speed, screen) {
			this.x = x;
			this.y = y;
			this.speed = speed;

			this.alive = true;
			this.screen = screen;
		},

		tick: function () {

			this.x += (Math.random() * 8)- 4;
			this.y += (Math.random() * 8) - 4;
			return this.alive;
		},

		remove: function() {

			this.alive = false;

		},


		render: function (gfx) {

			this.sheet.render(gfx, 1, 0, this.x, this.y);

		}


	});

	window.Baddie = Baddie;
}(Ω));
