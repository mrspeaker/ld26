(function (Ω) {

	"use strict";

	var MainScreen = Ω.Screen.extend({

		sheet: new Ω.SpriteSheet("res/tiles.png", 32),

		sounds: {

		},

		init: function () {

			$.ajax({
				url: "res/tiled.json",
				context: this
			}).done(function (data) {

				var map = [],
					cells = data.layers[0].data,
        			size = data.layers[0].width;

				while (cells.length > 0) {
				    map.push(cells.splice(0, size));
				}

				this.map = new Ω.Map(this.sheet, map);

				this.player = new Player(15 * 32, 3 * 32, this);
				this.player.setMap(this.map);

				this.camera = new Ω.TrackingCamera(this.player, 0, 0, Ω.env.w, Ω.env.h);
				this.camera = new Ω.TrackingCamera(this.player, 0, 0, Ω.env.w, Ω.env.h);

				this.painted = new PaintedScreen(this.map);


				console.log(data);
			});

			/*this.map2 = new Ω.Map(this.sheet, [
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,2,0,0,0,0,3,3,0,0,0,0,0,0,0,0,2,0,0,0,0,3,3,1],
				[1,0,2,0,0,0,2,3,2,0,0,0,0,0,0,0,0,2,0,0,0,2,3,2,0,0,0,0,0,1],
				[1,1,2,3,1,2,3,1,2,3,1,2,3,1,0,0,0,1,1,0,1,1,1,1,1,1,1,5,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,6,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,6,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,6,0,1],
				[1,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,6,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,1],
				[1,0,0,0,0,0,0,4,0,0,0,0,3,3,0,0,0,0,0,0,0,0,2,0,0,0,0,3,3,1],
				[1,0,2,0,0,0,2,3,2,0,0,0,0,0,0,1,0,4,0,0,0,2,3,2,0,0,0,0,0,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			]);*/

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
