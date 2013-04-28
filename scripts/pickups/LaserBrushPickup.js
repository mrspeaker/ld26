(function (Ω) {
	"use strict";

	var LaserBrushPickup = Pickup.extend({

		sheet: new Ω.SpriteSheet("res/pickups.png", 32),

		render: function (gfx) {

			this.sheet.render(gfx, 0, 0, this.x, this.y);

		}

	});

	window.LaserBrushPickup = LaserBrushPickup;
}(Ω));
