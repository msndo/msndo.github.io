(function($, global) {

	$(function() {
		$('.loading').hide();
		$.initGrid();

		$('.bt_apply').bindMovementGetDataFromChart().bindMovementDeactChart();

		$('.ctrl_toggle_elem').bindMovementToggleChart();
	});

	$.fn.bindMovementToggleChart = function() {
		var $elemCtrl = this;

		$elemCtrl.on('click.showchart', function() {
			setTimeout(function() {
				$elemCtrl.parent().after('<div id="container_editgrid"></div>');
				$.initGrid();
				$('.showcode').applyTimelineToChart();
			}, 0);

			return false;
		});

		$('.showcode').applyTimelineToChart().on('change.applyToChart', function() {
			$(this).applyTimelineToChart();
		});
	};

	// textareaに記述されたJSON配列をグリッドチャートに反映する
	$.fn.applyTimelineToChart = function() {
		var $elemText = $(this);
		var textSrc = $elemText.val()
		if(textSrc == '') { return this; }

		var seriesTimeline = JSON.parse(textSrc);

		var $elemChart = $('.gridchart').first();

		var $seriesElemRow = $elemChart.find('.row');

		if($seriesElemRow.length) {
			$.each(seriesTimeline, function(ix, val) {
				var positionVert = -1 * Math.floor(val * $seriesElemRow.length);
				plotDot($elemChart, ix, positionVert);
			});
		}

		seriesTimeline.unshift(0);
		seriesTimeline.push(1);

		global.seriesEasingTimeline = seriesTimeline;

		return this;
	};

	$.fn.bindMovementDeactChart = function(options) {
		var settings = {
			selectorShowCode: '.showcode'
		};
		$.extend(settings, options);

		var $elemShowChart = $('.ctrl_toggle_elem');

		var $seriesElemCtrl = this;
		$seriesElemCtrl.each(function() {
			var $elemCtrl = $(this);

			$elemCtrl.on('click.deactEdit', function() {
				var $elemChart = $('#editgrid');
				$elemChart.fadeOut().remove();
				$elemShowChart.fadeIn();
			});
		});

		return this;
	};

	$.fn.bindMovementGetDataFromChart = function(options) {
		var settings = {
			selectorShowCode: '.showcode'
		};
		$.extend(settings, options);

		var $seriesElemCtrl = this;

 		var seriesCurveEasing = [];

		$seriesElemCtrl.each(function() {
			var $elemCtrl = $(this);

			$elemCtrl.on('click.getData', function() {
				var $elemTarg = $($elemCtrl.attr('href'));
				seriesCurveEasing = [];
				var $seriesRow = $elemTarg.find('.row');

				$seriesRow.each(function(ixVert) {
					var $row = $(this);
					var ixRow = $row.get(0).getAttribute('data-ix-row');

					$row.find('.cell').each(function(ixHoriz) {
						var $cell = $(this);

						if($cell.get(0).getAttribute('data-isactv') == 1) {
							seriesCurveEasing[ixHoriz] = ixRow / $seriesRow.length;
						}
					});
				});

				$(settings.selectorShowCode).val('[ ' + seriesCurveEasing.join(', ') + ' ]');

				$(settings.selectorShowCode).applyTimelineToChart();

				global.seriesEasingTimeline = [];
				global.seriesEasingTimeline = seriesCurveEasing;
				global.seriesEasingTimeline.unshift(0);
				global.seriesEasingTimeline.push(1);

				//console.log(global.seriesEasingTimeline)
				//console.log(global.seriesEasingTimeline.length)

				return false;
			});
		});

		return this;
	}

	$.extend({
		initGrid:function(options) {
			new Vue({
				el: '#container_editgrid',
				template: '#grid-template'
			});

			$('#editgrid .cell').toggleAttrData();
		}
	});

	$.fn.toggleAttrData = function(options) {
		var settings = {
			selectorElemRange: '.gridchart',
			nameAttrToggle: 'data-isactv',
			selectorElemPage: 'body',
			selectorRow: '.row',
			selectorCell: '.cell',
			nameAttrIsMousedown: 'data-ismousedown',
			nameAttrPointHoriz: 'data-pointhoriz',
			nameAttrPointVert: 'data-pointvert'
		};
		$.extend(settings, options);

		var $seriesElemTarg = this;
		var $elemPage = $(settings.selectorElemPage);
		var $elemRange = $seriesElemTarg.first().closest(settings.selectorElemRange);

		$elemRange.get(0).setAttribute(settings.nameAttrPointHoriz, 0);
		$elemRange.get(0).setAttribute(settings.nameAttrPointVert, $elemRange.find('.row').length - 1);

		$seriesElemTarg.each(function() {
			var $elemTarg = $(this);

			$elemTarg.on('mouseover.toggleAttrData', function() {
				var isMouseDown = $elemPage.get(0).getAttribute(settings.nameAttrIsMousedown);
				if(isMouseDown !== '1') { return; }

				movementToggle($elemTarg);
			});
			$elemTarg.on('mousedown.toggleAttrData', function() {
				movementToggle($elemTarg);
			});
		});

		$elemPage.on('mousedown', function(ev) {
			ev.stopPropagation();
			$elemPage.get(0).setAttribute(settings.nameAttrIsMousedown, '1');
		}).
		on('mouseup', function(ev) {
			ev.stopPropagation();
			$elemPage.get(0).setAttribute(settings.nameAttrIsMousedown, '0');
		});

		return this;

		// ++++++++++++++++++++++++++++++++++++++++ Sub Routines
		function movementToggle($elemTarg) {
			var statusSrc = $elemTarg.get(0).getAttribute(settings.nameAttrToggle);

			var $elemRowCurrent = $elemTarg.closest(settings.selectorRow);

			var indexCellInRowPrev = $elemRange.get(0).getAttribute(settings.nameAttrPointHoriz) - 0;
			var indexRowPrev = $elemRange.get(0).getAttribute(settings.nameAttrPointVert) - 0;

			var indexRowCurrent = $elemRowCurrent.index() - 0;
			var indexCellInRowCurrent = $elemRowCurrent.find(settings.selectorCell).index($elemTarg) - 0;

			if((indexCellInRowPrev != indexCellInRowCurrent)) {
				plotLine($elemRange, indexCellInRowPrev, indexRowPrev, indexCellInRowCurrent, indexRowCurrent);
			}

			// 現在座標保持(次回ループ時の比較対象)
			$elemRange.get(0).setAttribute(settings.nameAttrPointVert, indexRowCurrent.toString());
			$elemRange.get(0).setAttribute(settings.nameAttrPointHoriz, indexCellInRowCurrent.toString());

			plotDot($elemRange, indexCellInRowCurrent, indexRowCurrent);
		}



		function plotLine($elemChart, fromHoriz, fromVert, toHoriz, toVert) {
			var ixHoriz = 0;
			var ixVert = 0;

			fromHoriz = fromHoriz - 0;
			fromVert = fromVert - 0;
			toHoriz = toHoriz - 0;
			toVert = toVert - 0;

			var distanceHoriz = toHoriz - fromHoriz;
			var distanceVert = toVert - fromVert;
			var ratio = distanceVert / distanceHoriz;

			var ixLoop = 0;

			var direction = 1;
			if(toHoriz < ixHoriz) {
				direction = -1;
			}
			if(toHoriz >= ixHoriz) {
				for(ixHoriz = fromHoriz; ixHoriz < toHoriz; ixHoriz = ixHoriz + (direction)) {
					vertPlot = Math.floor(ixLoop * ratio * direction + fromVert);

					plotDot(
						$elemChart,
						ixHoriz,
						vertPlot
					);

					ixLoop ++;
				}
			}
			if(toHoriz < ixHoriz) {
				for(ixHoriz = fromHoriz; ixHoriz > toHoriz; ixHoriz --) {
					vertPlot = Math.floor(ixLoop * ratio * -1 + fromVert);

					plotDot(
						$elemChart,
						ixHoriz,
						vertPlot
					);

					ixLoop ++;
				}
			}
		}
	};

	function plotDot($elemChart, horiz, vert, options) {
		var settings = {
			selectorElemRange: '.gridchart',
			nameAttrToggle: 'data-isactv',
			selectorElemPage: 'body',
			selectorRow: '.row',
			selectorCell: '.cell',
			nameAttrIsMousedown: 'data-ismousedown',
			nameAttrPointHoriz: 'data-pointhoriz',
			nameAttrPointVert: 'data-pointvert'
		};
		$.extend(settings, options);

		var statusDest = '1';

		horiz = Number(horiz);
		vert = Number(vert);

		var $elemTarg = $elemChart.find('.row').eq(vert).find('.cell').eq(horiz);
		var $seriesCellOnVerticalLine = $elemChart.find(settings.selectorRow + ' ' + settings.selectorCell + ':nth-child(' + (horiz + 1) + ')');

		$seriesCellOnVerticalLine.each(function() {
			$(this).get(0).setAttribute(settings.nameAttrToggle, '0');
		});
		$elemTarg.get(0).setAttribute(settings.nameAttrToggle, statusDest);
	}
})(jQuery, window);
