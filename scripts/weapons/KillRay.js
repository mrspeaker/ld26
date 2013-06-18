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

				screen.baddie_spawner.baddies.map(function(p) {

					var ab = Ω.utils.angleBetween(p, self.user);

					var walltest = "",
						distToWall = 0;

					var hitEntity = Math.abs(ab - angleUser) < 0.05 || (ab - angleUser) > (Math.PI - 0.05);

					if (hitEntity) {
						var distToWall = Ω.utils.dist(self.hit, self.user),
							distToEntity = Ω.utils.dist(self.user, p);

						if (distToEntity < distToWall) {
							walltest = "ENTIY!";
							self.hit.x = p.x;
							self.hit.y = p.y;
							p.remove();
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

				c.strokeStyle = "rgba(64, 255, 156, 0.2)";
				c.lineWidth = 10;

				var xstart = this.user.x + (this.user.w / 2) + (Math.sin(Math.PI / 2 - this.angle) * 5),
					ystart = this.user.y + (Math.cos(Math.PI / 2 - this.angle) * 5);

				c.beginPath();
				c.moveTo(xstart, ystart);
				c.lineTo(this.hit.x, this.hit.y);
				c.closePath();
				c.stroke();

				c.strokeStyle = "rgba(64, 255, 156, 0.7)";
				c.lineWidth = 3;

				c.beginPath();
				c.moveTo(xstart, ystart);
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
