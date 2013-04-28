(function (Ω) {

	"use strict";

	var MainScreen = Ω.Screen.extend({

		sheet: new Ω.SpriteSheet("res/tiles.png", 32),

		init: function () {

			$.ajax({
				url: "res/tiled.json",
				context: this
			}).done(function (data) {

				var map = [],
					mainLayer = Ω.utils.getByKeyValue(data.layers, "name", "main"),
					cells =  mainLayer.data,
        			size = mainLayer.width;

				while (cells.length > 0) {
				    map.push(cells.splice(0, size));
				}

				this.map = new Ω.Map(this.sheet, map);

				var entLayer = Ω.utils.getByKeyValue(data.layers, "name", "entities");
				var ps = Ω.utils.getByKeyValue(entLayer.objects, "name", "player_start");

				this.player = new Player(ps.x, ps.y, this);
				this.player.setMap(this.map);

				this.camera = new Ω.TrackingCamera(this.player, 0, 0, Ω.env.w, Ω.env.h);
				this.camera = new Ω.TrackingCamera(this.player, 0, 0, Ω.env.w, Ω.env.h);

				this.painted = new PaintedScreen(this.map);

			});

			this.bullets = [];

		},

		tick: function () {

			var self = this;

			this.player.tick(this.map);
			this.bullets = this.bullets.filter(function (b) {
				return b.tick(self.map);
			});
			this.camera.tick();

			if (Math.random () < 0.01) {
				this.bullets.push(new PaintBullet(15 * 32, 3 * 32, Math.random() * (Math.PI * 2), this));
			}

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

		render: function (gfx) {

			var c = gfx.ctx;

			c.fillStyle = "hsl(120, 3%, 0%)";
			c.fillRect(0, 0, gfx.w, gfx.h);

			this.camera.render(gfx, [this.painted, this.player, this.bullets]);

		}

	});

	window.MainScreen = MainScreen;

}(Ω));
