(function (Ω) {

	"use strict";

	var MainScreen = Ω.Screen.extend({

		sheet: new Ω.SpriteSheet("res/tiles.png", 32),

		loaded: false,

		init: function () {

			$.ajax({
				url: "res/tiled.json",
				context: this
			}).done(function (data) {

				// For some reason data from tiles is 1 tile too high.
				// Hence the y-32 everywhere.

				var mapped = [],
					mainLayer = Ω.utils.getByKeyValue(data.layers, "name", "main"),
					cells =  mainLayer.data;

				while (cells.length > 0) {
				    mapped.push(cells.splice(0, mainLayer.width));
				}

				this.map = new Ω.Map(this.sheet, mapped);

				var entities = Ω.utils.getByKeyValue(data.layers, "name", "entities"),
					player = Ω.utils.getByKeyValue(entities.objects, "name", "player_start"),
					pickups = Ω.utils.getAllByKeyValue(entities.objects, "name", "pickup")

				this.player = new Player(player.x, player.y - 32, this);
				this.player.setMap(this.map);

				this.physics = new Ω.Physics();

				this.pickups = pickups.map(function (pickup) {
					var p = null;
					switch (pickup.type) {
						case "laser":
							p = new LaserBrushPickup(pickup.x, pickup.y - 32);
							break;
					}
					return p;
				});

				this.camera = new Ω.TrackingCamera(this.player, 0, 0, Ω.env.w, Ω.env.h);
				this.painted = new PaintedScreen(this.map);

				this.loaded = true;

			});

			this.bullets = [];

		},

		tick: function () {

			var self = this;

			this.player.tick(this.map);

			if (Math.random () < 0.01) {
				//this.addBullet(15 * 32, 3 * 32, Math.random() * (Math.PI * 2));
			}

			this.pickups = this.pickups.filter(function (p) {
				return p.tick();
			});

			this.bullets = this.bullets.filter(function (b) {
				return b.tick(self.map);
			});

			this.physics.checkCollision(this.player, this.pickups, "pickhit");

			this.camera.tick();

		},

		addBullet: function (x, y, angle) {

			this.bullets.push(new PaintBullet(x, y, angle, this));

		},

		bombed: function (x, y) {

			this.painted.bombed(x, y);

		},

		paint: function (x, y, angle, pow) {

			this.painted.paint(x, y, angle, pow);

		},

		paint_laser: function (x, y, angle) {

			this.painted.paint(x, y, angle, true);
		},

		paint_vision: function (x, y, angle) {

			this.painted.paint(x, y, angle, false);

		},

		render: function (gfx) {

			var c = gfx.ctx;

			c.fillStyle = "hsl(120, 3%, 0%)";
			c.fillRect(0, 0, gfx.w, gfx.h);

			this.camera.render(gfx, [this.painted, this.player, this.bullets, this.pickups]);

		}

	});

	window.MainScreen = MainScreen;

}(Ω));
