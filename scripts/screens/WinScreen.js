(function (Ω) {

	"use strict";

	var WinScreen = Ω.Screen.extend({

		sheet: new Ω.SpriteSheet("res/heads.png", 16),

		ticks: 0,

		tick: function () {

			this.ticks++;
			if(this.ticks > 100) {
				if (
					Ω.input.pressed("fire") ||
					Ω.input.pressed("jump")
				) {
						game.reset();
				}
			}


		},

		render: function (gfx) {

			var c = gfx.ctx,
				msg = [
					"Fin.",
					"Fin.",
					"",
					"A game by Mr Speaker",
					"A game by Mr Speaker",
					"",
					"For Ludum Dare 26",
					"For Ludum Dare 26",
					"",
					"@mrspeaker",
					"@mrspeaker",
					"@mrspeaker",
					"",
					""
				][(this.ticks / 100 | 0) % 13];

			c.fillStyle = "#fff";
			c.fillRect(0, 0, gfx.w, gfx.h);

			c.fillStyle = "rgb(230, 74, 149)";
			c.fillText(msg, gfx.w / 2 - (gfx.text.getWidth(msg) / 2), gfx.h * 0.40);

			var x = gfx.w / 4 - 10,
				y = gfx.h / 4

			gfx.ctx.save();
			gfx.ctx.scale(2, 2);

			// Head
			this.sheet.render(gfx, 6, 0, x + 2, y - 11);

			// Body
			this.sheet.render(gfx, 0, 2, x + 1, y - 3);
			this.sheet.render(gfx, 0, 3, x +1, y + 11);

			// Legs
			this.sheet.render(gfx, 1, 2, x + 1, y + 17);

			// Arms
			this.sheet.render(gfx, 6, 1, x + 2, y + 5);

			gfx.ctx.restore();


		}

	});

	window.WinScreen = WinScreen;
}(Ω));
