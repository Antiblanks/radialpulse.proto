if (!window["$"]) {
	//console.log("jquery-radialpulse.js: Error >> JQuery must be defined");
}

/**
 * @component radialPulse
 * Radial pulse animation
 * @requires JQuery http://www.jquery.com
 * @requires JQuery Velocity http://julian.com/research/velocity/
 * @author Daniel Ivanovic dan.ivanovic@antiblanks.com
 */
(function($) {
  	$.fn.radialPulse = function(options) {
  		var self = this;
  		var BEHAVIOR_ROLLOVER = "rollover";
  		var BEHAVIOR_ROLLOUT = "rollout";
  		var BEHAVIOR_ROLLOVEROUT = "rolloverout";
  		var BEHAVIOR_CLICK = "click";

	  	options = $.extend({
	  		"startOpacity": 1,
	  		"startBlur": "blur(0px)",
			"endOpacity": 0,
			"endBlur": "blur(5px)",
			"endScale": 7,
			"numberOfRings": 5,
			"behavior": "rollover",
			"stopEventPropagation": false,
			"preventEventDefault": false,
			"radialImage": "img/radial.png",
			"animationSpeed": 1000,
			"animationEasing": "linear",
			"spawnSpeed": 150,
			"borderColor": "#61959d",
			"borderStartWidth": 2,
			"borderEndWidth": 5
	  	}, options);

	  	// utils

	  	function _isBorderRadiusSupported() {
	  		var cssAttributeNames = ['borderRadius', 'BorderRadius', 'MozBorderRadius', 'WebkitBorderRadius', 'OBorderRadius', 'KhtmlBorderRadius']; 
			for (var i = 0; i < cssAttributeNames.length; i++) {
			    var attributeName = cssAttributeNames[i];
			    if (window.document.body.style[attributeName] !== undefined) {
			        return true;
			    }
			}
			return false;
	  	};

	  	// private 

	  	function spawnRadialPulse(target, delay) {
	  		if ($(target).length == 0)
	  			return false;
	  		var radialTag;
	  		var animationStartObj = {
	  			"position": "absolute",
	  			"left": ($(target).position().left + parseInt($(target).css("margin-left"))) + "px",
	  			"top": ($(target).position().top + parseInt($(target).css("margin-top"))) + "px",
	  			"width": $(target).width() + "px",
	  			"height": $(target).height() + "px",
	  			"opacity": options.startOpacity,
	  			"filter": options.startBlur,
				"webkitFilter": options.startBlur,
				"mozFilter": options.startBlur,
				"oFilter": options.startBlur,
				"msFilter": options.startBlur
	  		};
	  		var animationEndObj = {
	  			"width": ($(target).width() * options.endScale) + "px",
	  			"height": ($(target).height() * options.endScale) + "px",
	  			"left": ($(target).position().left + parseInt($(target).css("margin-left")) + ($(target).width()/2) - (($(target).width() * options.endScale)/2)) + "px",
	  			"top": ($(target).position().top + parseInt($(target).css("margin-top")) + ($(target).height()/2) - (($(target).height() * options.endScale)/2)) + "px",
	  			"opacity": options.endOpacity,
	  			"filter": options.endBlur,
	  			"webkitFilter": options.endBlur,
	  			"mozFilter": options.endBlur,
	  			"oFilter": options.endBlur,
	  			"msFilter": options.endBlur
	  		};
	  		if (_isBorderRadiusSupported()) {
	  			radialTag = $("<div />");
	  			animationStartObj["webkitBorderRadius"] = "50%";
	  			animationStartObj["mozBorderRadius"] = "50%";
	  			animationStartObj["oBorderRadius"] = "50%";
	  			animationStartObj["msBorderRadius"] = "50%";
	  			animationStartObj["borderRadius"] = "50%";
	  			animationStartObj["width"] = ($(target).width() - (options.borderStartWidth*2)) + "px";
	  			animationStartObj["height"] = ($(target).height() - (options.borderStartWidth*2)) + "px";
	  			animationStartObj["border"] = options.borderStartWidth + "px solid " + options.borderColor;
	  			animationEndObj["border"] = options.borderEndWidth + "px solid " + options.borderColor;
	  		}
	  		else {
	  			radialTag = $("<img />");
	  			$(radialTag).attr("src", options.radialImage);
	  		}
	  		$(radialTag).css(animationStartObj);
	  		$(target).before(radialTag);
	  		$(radialTag).stop().delay(delay).velocity(animationEndObj, {
	  			"easing": options.animationEasing,
	  			"duration": options.animationSpeed,
	  			"complete": function() {
	  				$(this).remove();
	  			}
	  		});
	  		return true;
	  	};

	  	function pulse(target) {
	  		if (!$(target).hasClass("radial-pulse"))
	  			return;
	  		if (isNaN(options.numberOfRings))
	  			options.numberOfRings = 1;
	  		for (var i=0; i<options.numberOfRings; i++) {
	  			spawnRadialPulse(target, options.spawnSpeed*i);
	  		}
	  	};

	  	function radialPulse(evt) {
	  		var target = evt.target;
	  		if (!$(target).hasClass("radial-pulse"))
	  			target = evt.currentTarget;
	  		if (!$(target).hasClass("radial-pulse"))
	  			return false;
	  		pulse(target);
	  		if (options.stopEventPropagation) {
	  			evt.stopPropagation();
	  		}
	  		if (options.preventEventDefault) {
	  			evt.preventDefault();
	  		}
	  		return true;
	  	};

	  	function getRadialPulseBehavior(target) {
	  		var behavior = options.behavior;
	  		if ($(target).attr("data-radial-pulse-behavior") == BEHAVIOR_ROLLOVER ||
	  			$(target).attr("data-radial-pulse-behavior") == BEHAVIOR_ROLLOUT ||
	  			$(target).attr("data-radial-pulse-behavior") == BEHAVIOR_CLICK) {
	  			behavior = $(target).attr("data-radial-pulse-behavior");
	  		}
	  		return behavior;
	  	};

	  	function initRadialPulse(item) {
	  		var behavior = getRadialPulseBehavior(item);
	  		switch (behavior) {
		  		case BEHAVIOR_ROLLOVER:
		  			$(item).on('mouseenter.radialPulse', radialPulse);
		  			break;
		  		case BEHAVIOR_ROLLOUT:
		  			$(item).on('mouseleave.radialPulse', radialPulse);
		  			break;
		  		case BEHAVIOR_ROLLOVEROUT:
			  		$(item).on('mouseenter.radialPulse', radialPulse);
			  		$(item).on('mouseleave.radialPulse', radialPulse);
		  			break;
		  		case BEHAVIOR_CLICK:
		  			$(item).on('click.radialPulse', radialPulse);
		  			break;
		  		default:
		  			console.log("jquery-radialpulse.js: Error >> Behavior type not accepted");
		  			return;
		  	}
	  	};

	  	// public

	  	this.pulse = function() {
	  		pulse(this);
	  	};

	  	// init

	  	if ($(self).find(".radial-pulse").length != 0) {
	  		$.each($(self).find(".radial-pulse"), function(index, item) {
		  		initRadialPulse(item);
		  	});
	  	}
	  	else {
	  		initRadialPulse(this);
	  	}
	    
	    return self;
	};
})(jQuery);