(function (Ω) {

	"use strict";

	var sounds = {},
		Sound;

	Sound = Ω.Class.extend({

		ext: document.createElement('audio').canPlayType('audio/mpeg;') === "" ? ".ogg" : ".mp3",

		init: function (path, volume, loop) {

			var audio = new window.Audio();

			audio.src = path + this.ext;
			audio.volume = volume || 1;
			audio.loop = loop;

			// FIXME: add to preload list
			audio.addEventListener("canplaythrough", (function (){
				return Ω.preload();
			}()));
			audio.load();

			this.audio = audio;

		},

		rewind: function () {

			this.audio.pause();
			this.audio.currentTime = 0;

		},

		play: function () {

			this.rewind();
			this.audio.play();
		}

	});

	Ω.Sound = Sound;

}(Ω));
