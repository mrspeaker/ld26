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
					this.user.x + this.user.w / 2,
					this.user.y + this.user.h / 2,
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

				// TODO: figure out if angle === hit things.

				// var self = this;
				// screen.pickups.map(function (p) {

				// 	var playerAngle = Ω.utils.angleBetween(self.user, p);
				// 	var gunAngle = self.user.angle;

				// 	console.log(Ω.utils.rad2deg(playerAngle), Ω.utils.rad2deg(gunAngle));
				// 	var c = gfx.ctx;
				// 	c.strokeStyle = "rgba(155, 264, 156, 0.2)";
				// 	c.lineWidth = 3;
				// 	c.beginPath();
				// 	c.moveTo(self.user.x, self.user.y);
				// 	c.lineTo(p.x, p.y);
				// 	c.closePath();
				// 	c.stroke();

				// });

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
				c.moveTo(this.user.x + this.user.w / 2, this.user.y + this.user.h / 2);
				c.lineTo(this.hit.x, this.hit.y);
				c.closePath();
				c.stroke();

			}

		}

	})

	window.VisionBrush = VisionBrush;
}(Ω));
