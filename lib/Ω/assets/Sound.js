(function (Ω) {

	"use strict";

	var sounds = [],
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

			sounds.push(audio);

		},

		rewind: function () {

			this.audio.pause();
			try{
	        	this.audio.currentTime = 0;
	    	} catch(err){
	        	//console.log(err);
	    	}

		},

		play: function () {

			this.rewind();
			this.audio.play();
		}

	});

	Sound._reset = function () {

		// Should check for canplaythrough before doing anything...
		for(var i = 0; i < sounds.length; i++) {
			sounds[i].pause();
			try{
	        	sounds[i].currentTime  = 0;
	    	} catch(err){
	        	//console.log(err);
	    	}
		}
	};

	Ω.Sound = Sound;

}(Ω));
