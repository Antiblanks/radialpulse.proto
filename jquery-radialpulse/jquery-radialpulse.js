if (!window["$"]) {
	console.log("jquery-radialpulse.js: Error >> JQuery must be defined");
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
			"spawnSpeed": 150
	  	}, options);

	  	function spawnRadialPulse(target, delay) {
	  		console.log("spawnRadialPulse", target, delay);
	  		if ($(target).length == 0)
	  			return false;
	  		var radialImageTag = $("<img />")
	  			.attr("src", options.radialImage)
	  			.css("position", "absolute")
	  			.css("left", $(target).position().left + parseInt($(target).css("margin-left")))
	  			.css("top", $(target).position().top + parseInt($(target).css("margin-top")))
	  			.css("width", $(target).width())
	  			.css("height", $(target).height())
	  			.css("opacity", options.startOpacity)
	  			.css("filter", options.startBlur)
				.css("webkitFilter", options.startBlur)
				.css("mozFilter", options.startBlur)
				.css("oFilter", options.startBlur)
				.css("msFilter", options.startBlur);
	  		$(target).before(radialImageTag);
	  		$(radialImageTag).stop().delay(delay).velocity({
	  			"width": $(target).width() * options.endScale,
	  			"height": $(target).height() * options.endScale,
	  			"left": $(target).position().left + parseInt($(target).css("margin-left")) + ($(target).width()/2) - (($(target).width() * options.endScale)/2),
	  			"top": $(target).position().top + parseInt($(target).css("margin-top")) + ($(target).height()/2) - (($(target).height() * options.endScale)/2),
	  			"opacity": options.endOpacity,
	  			"filter": options.endBlur,
	  			"webkitFilter": options.endBlur,
	  			"mozFilter": options.endBlur,
	  			"oFilter": options.endBlur,
	  			"msFilter": options.endBlur
	  		}, {
	  			"easing": options.animationEasing,
	  			"duration": options.animationSpeed,
	  			"complete": function() {
	  				$(this).remove();
	  			}
	  		});
	  		return true;
	  	};

	  	// private 

	  	function pulse(target) {
	  		console.log("pulse", target);
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