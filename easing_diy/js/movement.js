(function($) {
	$(function() {
		$('.bt_start').triggerAnimation();
	});

	$.fn.triggerAnimation = function(options) {
		var settings = {
			selectorContainer: '.container_example',
			selectorGauge: '.gauge_animation',
			selectorProgress: '.progress_animation',
			easingAnim: 'easeOutExpo',
			nameAttrEasingAnimInline: 'data-anim-easing'
		};
		$.extend(settings, options)

		var $seriesElemCtrl = this;

		var easingAnim = settings.easingAnim;

		$seriesElemCtrl.each(function() {
			var $elemCtrl = $(this);

			var $elemRange = $elemCtrl.closest(settings.selectorContainer);
			var $elemGauge = $elemRange.find(settings.selectorGauge);
			var $elemProgressBar = $elemRange.find(settings.selectorProgress);

			$elemCtrl.on('click.startAnim', function() {
				var widthDest = $elemGauge.width();
				if($elemProgressBar.width() > 0) { widthDest = 0; }

				var easingAnimInline = $elemProgressBar.get(0).getAttribute(settings.nameAttrEasingAnimInline);
				if(easingAnimInline) {
					easingAnim = easingAnimInline;
				}

				$elemProgressBar.animate({ width: widthDest + 'px' }, 1000, easingAnim);
			});
		});
	}
})(jQuery);
