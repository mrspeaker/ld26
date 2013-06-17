(function (Ω) {
	"use strict";

	// Paints in the level as you shoot
	var KillRay = Weapon.extend({

		shooting: false,
		ooo: false,

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

					screen.unpaint(this.hit.x, this.hit.y);
				}

				var self = this,
					angleUser = self.user.angle;

				self.ooo = ">";

				screen.pickups.map(function(p) {

					var ab = Ω.utils.angleBetween(p, self.user);

					var walltest = "",
						distToWall = 0;

					var hitEntity = Math.abs(ab - angleUser) < 0.05 || (ab - angleUser) > (Math.PI - 0.05);

					if (hitEntity) {
						var distToWall = Ω.utils.dist(self.hit, self.user),
							distToEntity = Ω.utils.dist(self.user, p);

						if (distToEntity < distToWall) {
							walltest = "ENTIY!";
						} else {
							walltest = "WALLL";
						}

						self.ooo += walltest

					} else {
						self.ooo += "-";
					}

				});

			} else {
				this.hit = null;
				this.ooo = "-";
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

				c.fillStyle = "green";
				c.fillText(this.ooo, this.user.x, this.user.y + this.user.h + 10);

			}

		}

	})

	window.KillRay = KillRay;
}(Ω));
