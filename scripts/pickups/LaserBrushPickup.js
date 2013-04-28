(function (Ω) {
	"use strict";

	var LaserBrushPickup = Pickup.extend({

		sheet: new Ω.SpriteSheet("res/pickups.png", 32),

		sound: new Ω.Sound("res/audio/stab", 0.5, false),

		picked: function (p) {
			this._super();
			this.sound.play();
		},

		render: function (gfx) {

			this.sheet.render(gfx, 0, 0, this.x, this.y + (Math.sin(Date.now() / 300) * 3));

		}

	});

	window.LaserBrushPickup = LaserBrushPickup;
}(Ω));
