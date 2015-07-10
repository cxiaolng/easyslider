/*
The MIT License (MIT)

Copyright (c) 2015 harry chang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function($){

	var settings = {};
	var init = function(options){
		/*
		* 默认参数
		*/
		var defaults = { 
			width:"15px",
			height:null,
			bgColor:"#262626",
			fgColor:null,
			scrollRate:1//滚动倍率
		};
		settings = $.extend(defaults, options);			
	}
	var _mouse_wheel = function(fn){
		var _this = this.context;
		if(typeof fn == 'function'){
			var _callback = function(e){
				e = e || event;
				if(e.preventDefault){
					e.preventDefault();
				}
				e.returnValue = false;
				fn(e.wheelDelta ? e.wheelDelta / 120 : -(e.detail % 3 == 0 ? e.detail / 3 : e.detail));
				
			}
			var isFirefox = typeof document.body.style.MozUserSelect != 'undefined';
			if(_this.addEventListener){
				_this.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', _callback, false);
			}else{
				_this.attachEvent('onmousewheel', _callback);
			}
		}
	}
	$.fn.easySlider = function(options){

		init(options);
		this.each(function(){
			var _this = $(this);
			var panelHeight = _this.children("ul").height();
			//如果ul高度小于外层div,则不出现滚动条
			if(panelHeight <= settings.height){
				return;
			}
			//计算出滚动条的高度
			var sliderHeight = (settings.height*settings.height - 20)/panelHeight;
			//ul被遮盖掉的高
			var contentHideHeight = panelHeight - settings.height;
			//滚动条可滚动的高度
			var sliderScrollHeight = settings.height - sliderHeight - 20;
			//滚动条滚动1时，内容层滚动高度比率
			var offsetRate = contentHideHeight/sliderScrollHeight;
			
			_create_container(_this, sliderHeight);
			
			/*
			*	如果num 大于 max,则返回max,如果小于min,则返回min,否则返回num
			*/
			var range = function(num, max, min){
				return Math.min(max, Math.max(num, min));
			}
			_mouse_wheel.call(_this, function(deltaY){
				var slider = $(".sliderthumb");
				var top = slider.position().top;
				var offsetY = top - deltaY * settings.scrollRate;

				var minY = 10;
				var maxY = settings.height - minY - slider.height();		
				slider.css("top", range(offsetY, maxY, minY) +"px");
				var contentContarin = _this.children("ul");
				var contentTop = contentContarin.position().top;
				var contentOffsetY = contentTop + deltaY * offsetRate * settings.scrollRate;
				var contentMaxOffsetY = contentContarin.height() - settings.height;
				contentContarin.css("top", range(contentOffsetY, 0, -contentMaxOffsetY)+"px");
			});
			$(".sliderthumb").live("mousedown",function(event){
				//debugger;
				var key = event.keyCode|| event.which;
				console.log(key);
			});
		});
	}

	var _create_container = function(_target, sliderHeight){
		_target.css({"position":"absolute","overflow":"hidden"});
		var maxWidth = _target.width()-26;
		_target.children().css({"position":"relative","margin":0,"padding":0,"max-width":maxWidth,"word-wrap":"break-word"});
		_target.append('\
			<div id="slider_component_container" style="background-color:'+settings.bgColor+';">\
				<div class="slidertop"></div>\
				<div class="sliderbottom"></div>\
				<div class="sliderrail">\
					<div class="railtop"></div>\
					<div class="railback"></div>\
					<div class="railbottom"></div>\
				</div>\
				<div class="sliderthumb" style="height:'+sliderHeight+'px;">\
				<div class="thumbtop"></div>\
				<div class="thumbback"></div>\
				<div class="thumbbottom"></div>\
				</div>\
			</div>\
		');	
	}
})($);