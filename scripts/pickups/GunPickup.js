(function (Ω) {
	"use strict";

	var GunPickup = Pickup.extend({

		sheet: new Ω.SpriteSheet("res/pickups.png", 32),

		sound: new Ω.Sound("res/audio/stab", 0.9, false),

		picked: function (p) {

			this._super();
			this.sound.play();

		},

		render: function (gfx) {

			this.sheet.render(gfx, 1, 0, this.x, this.y);

		}

	});

	window.GunPickup = GunPickup;
}(Ω));
