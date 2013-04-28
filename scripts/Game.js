(function (Ω) {

	"use strict";

	var Game = Ω.Game.extend({

		canvas: "#board",

		level: 0,
		levels: 3,

		jumped: false,

		init: function (w, h, col) {

			this._super(w, h, col);

			Ω._progress = function (cur, max) {
				document.querySelector("#spinner").style.color = "hsl(331, 76%, " + (Math.random() * 40 + 20)  +"%)"
			};

			var az = urlParams.azerty;

			Ω.input.binds([
				["space", "jump"],
				["escape", "escape"],
				[az ? "az_a" : "a", "left"],
				[az ? "az_d" : "d", "right"],
				[az ? "az_w" : "w", "jump"],
				[az ? "az_s" : "s", "down"],
				["left", "left"],
				["right", "right"],
				["up", "jump"],
				["down", "down"],
				["mouse1", "fire"]
			]);

			this.reset();

		},

		reset: function () {

			document.querySelector("#spinner").style.display = "none";

			Ω.Sound._reset();
			Ω.input.reset();
			this.level = 0;
			this.setScreen(new LevelScreen(this.level));

		},

		nextLevel: function () {
			if (++this.level < this.levels) {
				this.setScreen(new LevelScreen(this.level));
			} else {
				this.setScreen(new WinScreen());
			}
		}

	});

	window.Game = Game;

}(Ω));