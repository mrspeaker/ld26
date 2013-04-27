(function (Ω) {

	"use strict";

	var MainScreen = Ω.Screen.extend({

		sheet: new Ω.SpriteSheet("res/tiles.png", 32),

		init: function () {

			this.camera = new Ω.Camera(0, 0, Ω.env.w, Ω.env.h);

			this.map = new Ω.Map(this.sheet, [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,2,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,2,0,0,0,0,3,3,0],
				[1,0,2,0,0,0,2,3,2,0,0,0,0,0,0],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			]);

			this.player = new Player(4, 7, this);
			this.player.setMap(this.map);

		},

		tick: function () {

			this.player.tick(this.map);

			if (Ω.input.pressed("fire")) {
				console.log("FIRE!");
			}

		},

		render: function (gfx) {

			var c = gfx.ctx;

			c.fillStyle = "hsl(120, 10%, 95%)";
			c.fillRect(0, 0, gfx.w, gfx.h);

			this.camera.render(gfx, [this.player]);

		}

	});

	window.MainScreen = MainScreen;

}(Ω));
