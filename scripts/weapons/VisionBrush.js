(function (Ω) {
	"use strict";

	// Paints in the level as you shoot
	var VisionBrush = Weapon.extend({

		shooting: false,

		fire: function (angle) {

			this.shooting = true;
			this.angle = angle;

		},

		released: function () {

			this.shooting = false;

		},

		tick: function (screen) {

			if (this.shooting) {

				this.hit = Ω.rays.cast(
					this.user.angle,
					this.user.x,
					this.user.y,
					screen.map
				);

				if (this.hit) {
					this.hit.x *= screen.map.sheet.w;
					this.hit.y *= screen.map.sheet.h;

					screen.paint_vision(
						this.hit.x,
						this.hit.y,
						this.angle);
				}

			} else {
				this.hit = null;
			}

		},

		render: function (gfx) {

			if (this.shooting && this.hit) {

				var c = gfx.ctx;

				c.strokeStyle = "rgba(255, 64, 156, 0.2)";
				c.lineWidth = 3;

				c.beginPath();
				c.moveTo(this.user.x, this.user.y);
				c.lineTo(this.hit.x, this.hit.y);
				c.closePath();
				c.stroke();

			}

		}

	})

	window.VisionBrush = VisionBrush;
}(Ω));
