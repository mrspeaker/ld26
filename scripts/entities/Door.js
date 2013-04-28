(function (Ω) {
	"use strict";

	var Door = Ω.Entity.extend({

		sheet: new Ω.SpriteSheet("res/tiles.png", 32),

		init: function (x, y, hitCb) {
			this.x = x;
			this.y = y;
			this.hitCb = hitCb;
		},

		render: function (gfx) {

			this.sheet.render(gfx, 0, 1, this.x, this.y);

		},

		doorhit: function (){

			this.hitCb && this.hitCb();

		}

	});

	window.Door = Door;
}(Ω));
