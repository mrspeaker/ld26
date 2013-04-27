(function (Ω) {
	"use strict";

	var paintLayers = {
		layers: {},

		add: function (name, parentSelector) {
			var main = Ω.gfx.ctx;

			var layer = Ω.gfx.createCanvas(main.canvas.width, main.canvas.height);
			document.querySelector(parentSelector).appendChild(layer.canvas);

			layer.fillStyle = "hsla(" + (Math.random() * 360 | 0) + ", 50%, 50%, 0.2)";
			layer.fillRect(10, 10, layer.canvas.width - 20, layer.canvas.height - 20);

			this.layers[name] = layer;
		},

		reset: function () {

			var i;
			for(i in this.layers) {
				var can = this.layers[i].canvas;
				if(can.parentNode) {
					can.parentNode.removeChild(can);
				}
			}
			this.layers = {};

		}
	}

	window.paintLayers = paintLayers;
}(Ω));
