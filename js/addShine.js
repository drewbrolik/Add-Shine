/*
Add Shine jQuery Plugin
Version 1
Nov 210th, 2012

Documentation: http://drewtotango.com/addShine/index.php
Repository: https://github.com/drewbrolik/Add-Shine

Copyright 2012 Drew Thomas

Dual licensed under the MIT and GPL licenses:
https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt
http://www.gnu.org/licenses/gpl.txt

This file is part of Add Shine.

Add Shine is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Add Shine is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Responsive Img.  If not, see <http://www.gnu.org/licenses/>.
*/

(function($) {

	$.fn.addShine = function(additionalOptions) {
				
		var options = { //- set default options
			amount:.2
		}
		
		if (typeof(additionalOptions == "number")) { //- if additionalOptions is just the amount number, convert it to an object
			additionlOptions = { amount:additionalOptions }
		}
		
		options = $.extend(options, additionalOptions ); //- override default options with user-supplied options
		
		$(this).each(function() { //- do it for 'em all
			
			var $this = $(this); //- get this variable for later
						
			var backgroundColor = $this.css("backgroundColor");
			
			var colors = getShineColors_rgba(backgroundColor,options.amount)
						
			var gradientCSS = " background: "+colors[1]+"; background: -moz-linear-gradient(top, "+colors[1]+" 0%, "+colors[0]+" 100%); background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,"+colors[1]+"), color-stop(100%,"+colors[0]+")); background: -webkit-linear-gradient(top, "+colors[1]+" 0%,"+colors[0]+" 100%); background: -o-linear-gradient(top, "+colors[1]+" 0%,"+colors[0]+" 100%); background: -ms-linear-gradient(top, "+colors[1]+" 0%,"+colors[0]+" 100%); background: linear-gradient(to bottom, "+colors[1]+" 0%,"+colors[0]+" 100%);"; // filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#303030', endColorstr='#3c3c3c',GradientType=0 );
			
			//- apply background color
			if ($this.attr("style")) {		
				$this.attr("style",$this.attr("style")+gradientCSS);
			} else {
				$this.attr("style",gradientCSS);
			}
				
		});
		
		/* function getShineColors_rgba(rgbaValue,amount) {
			
			//---- get an rgba value for the fade FROM color
			
			var rgba = rgbaValue.split(",");
			var rgbaLength = rgba.length;
			if (rgba.length < 4) { rgba.push("1"); }
			
			var r = rgba[0].replace(/\D+/g, '' );
			var g = parseFloat(rgba[1]);
			var b = parseFloat(rgba[2]);
			var a = parseFloat(rgba[3]);
			
			var originalColor = "rgba("+r+","+g+","+b+","+a+")";
			//var originalColorHex = "#"+(g | (b << 8) | (r << 16)).toString(16);
			
			//---- create fade TO color
			
			var num = r.toString(16)+g.toString(16)+b.toString(16);
						
			r = (num >> 16) + amount;
			//r = r + amount;
			//r = r.toString(16);
    		if (r.length == 1) { r = "0" + r; }
			
			if ( r > 255 ) r = 255;
			else if  (r < 0) r = 0;
			//r = parseInt(r,16);
			
			g = (num & 0x0000FF) + amount;
			//g = (g & 0x0000FF) + amount;
			//g = g.toString(16);
    		if (g.length == 1) { g = "0" + g; }
			
			if ( g > 255 ) g = 255;
			else if  ( g < 0 ) g = 0;
			//g = parseInt(g,16);
			
			b = ((num >> 8) & 0x00FF) + amount;
			//b = (b & 0x00FF) + amount;
			//b = b.toString(16);
    		if (b.length == 1) { b = "0" + b; }
			
			if ( b > 255 ) b = 255;
			else if  (b < 0) b = 0;
			//b = parseInt(b,16);
			
			var newColor = "rgba("+r+","+g+","+b+","+a+")";
			//var newColorHex = "#"+(g | (b << 8) | (r << 16)).toString(16);
			
			return Array(originalColor,newColor);
			
		} */
		
		function getShineColors_rgba(rgbaValue,amount) {
			
			//- get an rgba value for the fade FROM color
			
			var rgba = rgbaValue.split(",");
			var rgbaLength = rgba.length;
			if (rgba.length < 4) { rgba.push("1"); }
			
			var r = rgba[0].replace(/\D+/g, '' );
			var g = parseFloat(rgba[1]);
			var b = parseFloat(rgba[2]);
			var a = parseFloat(rgba[3]);
			
			var originalColor = "rgba("+r+","+g+","+b+","+a+")";
			
			//- get rgba value for the fade TO color
			
			var hsl = rgbToHsl(r, g, b);
			hsl[2] = hsl[2]+amount;
			var newRgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
			
			r = parseInt(newRgb[0]);
			g = parseInt(newRgb[1]);
			b = parseInt(newRgb[2]);
			
			var newColor = "rgba("+r+","+g+","+b+","+a+")";
			
			return Array(originalColor,newColor);
			
		}
		
		/**
		 * Converts an RGB color value to HSL. Conversion formula
		 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
		 * Assumes r, g, and b are contained in the set [0, 255] and
		 * returns h, s, and l in the set [0, 1].
		 *
		 * @param   Number  r       The red color value
		 * @param   Number  g       The green color value
		 * @param   Number  b       The blue color value
		 * @return  Array           The HSL representation
		 */
		function rgbToHsl(r, g, b){
			r /= 255, g /= 255, b /= 255;
			var max = Math.max(r, g, b), min = Math.min(r, g, b);
			var h, s, l = (max + min) / 2;
		
			if(max == min){
				h = s = 0; // achromatic
			}else{
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch(max){
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
			}
		
			return [h, s, l];
		}
		
		/**
		 * Converts an HSL color value to RGB. Conversion formula
		 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
		 * Assumes h, s, and l are contained in the set [0, 1] and
		 * returns r, g, and b in the set [0, 255].
		 *
		 * @param   Number  h       The hue
		 * @param   Number  s       The saturation
		 * @param   Number  l       The lightness
		 * @return  Array           The RGB representation
		 */
		function hslToRgb(h, s, l){
			var r, g, b;
		
			if(s == 0){
				r = g = b = l; // achromatic
			}else{
				function hue2rgb(p, q, t){
					if(t < 0) t += 1;
					if(t > 1) t -= 1;
					if(t < 1/6) return p + (q - p) * 6 * t;
					if(t < 1/2) return q;
					if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
					return p;
				}
		
				var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				var p = 2 * l - q;
				r = hue2rgb(p, q, h + 1/3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1/3);
			}
		
			return [r * 255, g * 255, b * 255];
		}

		
		return this;
	};
	
})(jQuery);