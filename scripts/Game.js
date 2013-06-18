(function (Ω) {

	"use strict";

	var Game = Ω.Game.extend({

		canvas: "#board",

		level: 0,
		levels: 4,

		volume: 1,

		jumped: false,

		init: function (w, h, col) {

			this._super(w, h, col);

			Ω.evt.progress.push(function (cur, max) {
				document.querySelector("#spinner").style.color = "hsl(331, 76%, " + (Math.random() * 40 + 20)  +"%)"
			});

			var az = Ω.urlParams.azerty;

			Ω.input.bind([
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
				["mouse1", "fire"],
				["wheelUp", "changeWeaponUp"],
				["wheelDown", "changeWeaponDown"],
				[49, "changeWeapon0"],
				[50, "changeWeapon1"]
			]);

			this.reset();

		},

		reset: function () {

			document.querySelector("#spinner").style.display = "none";

			Ω.Sound._reset();
			Ω.Sound._setVolume(this.volume);
			Ω.input.reset();
			this.level = 0;
			this.setScreen(new LevelScreen(this.level, false));

		},

		nextLevel: function () {
			if (++this.level < this.levels) {
				this.setScreen(new LevelScreen(this.level), this.level === this.levels - 1);
			} else {
				this.setScreen(new WinScreen());
			}
		}

	});

	window.Game = Game;

}(Ω));