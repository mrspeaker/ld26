(function (Ω) {
	"use strict";

	var Cleaner = Ω.Entity.extend({

		sheet: new Ω.SpriteSheet("res/heads.png", 16),

		init: function (x, y) {
			this.x = x;
			this.y = y;
		},

		tick: function () {

			this.x += (Math.random() * 4)- 2;
			this.y += (Math.random() * 4) - 2;

			return true;
		},

		sendTo: function (x, y) {

		},

		render: function (gfx) {

			this.sheet.render(gfx, 0, 0, this.x, this.y);

		}


	});

	window.Cleaner = Cleaner;
}(Ω));
