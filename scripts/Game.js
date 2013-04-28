(function (Ω) {

	"use strict";

	var Game = Ω.Game.extend({

		canvas: "#board",

		level: 0,

		init: function (w, h, col) {

			this._super(w, h, col);

			Ω._progress = function (cur, max) {
				// use for progress bar
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

			Ω.Sound._reset();
			Ω.input.reset();
			this.level = 0;
			this.setScreen(new LevelScreen(this.level));

		},

		nextLevel: function () {
			if (++this.level < 2) {
				this.setScreen(new LevelScreen(this.level));
			} else {
				alert("YOU WON THE GAME!");
				this.reset();
			}
		}

	});

	window.Game = Game;

}(Ω));