//https://www.jqueryscript.net/time-clock/Dynamic-Animated-Timeline-Slider.html
define( [ "qlik","jquery","css!./jquery.roadmap.min.css","./jquery.roadmap","css!./style.css"],
function ( qlik,$) {

	return {
	initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 10,
					qHeight: 1000
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					max: 1,
					items:{	
						content: {
							label:"Content",
							type: "string",
							ref: "qAttributeExpressions.0.qExpression",
							component: "expression"
						},
						Orientation: {
							type: "string",
							component: "buttongroup",
							label: "Orientation",
							ref: "qDef.orientation",
							options: [{
								value: "vertical",
								label: "Vertical",
								tooltip: "Select for vertical"
							}, {
								value: "horizontal",
								label: "Horizontal",
								tooltip: "Select for horizontal"
							}],
							defaultValue: "v"
						},
						slidstart: {
							label:"Slide Start",
							type: "number",
							ref: "qDef.slidstart",
							defaultValue:1
						},
						eventsPerSlide:{
							label:"Event Per Slide",
							type: "number",
							ref: "qDef.eventsPerSlide",
							defaultValue:6
						}
					}
				},
				measures: {
					uses: "measures",
					min:0,
					max: 9
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
					
					}
			}
		},
		support : {
			snapshot: true,
			export: true,
			exportData : false
		},
		paint: function ($element,layout) {
			console.log(layout);
			var events = [],objID=layout.qInfo.qId;
			layout.qHyperCube.qDataPages[0].qMatrix.map(function(v) {
				var mes='';
				
				v.map(function(v2,k){
					
					if(!k == 0){
						//console.log(k);
						mes += layout.qHyperCube.qMeasureInfo[k-1].qFallbackTitle + ' : ' +v2.qText+'<br>';
					}
				});
				events.push({
					"date":v[0].qText,
					"content":(v[0].qAttrExps.qValues[0].qText == undefined ? '' : v[0].qAttrExps.qValues[0].qText),
					"measure":mes
				});
			});
        	//console.log(events);
			$element.html( '<div id="timeline_'+objID+'"></div>' );
			$element.css({
				"overflow":"auto"
			});
            $('#timeline_'+objID).roadmap(events, {
                eventsPerSlide: layout.qHyperCube.qDimensionInfo[0].eventsPerSlide,
                slide: layout.qHyperCube.qDimensionInfo[0].slidstart,
				orientation: layout.qHyperCube.qDimensionInfo[0].orientation,
				eventTemplate: '<div class="event"><div class="event__date">####DATE###</div><div class="event__content">####CONTENT###</div><div class="measures">####MEASURE####</div></div>',
                prevArrow: '<span class="lui-icon lui-icon--arrow-left" style="font-size: 30px;"></span>',
                nextArrow: '<span class="lui-icon lui-icon--arrow-right" style="font-size: 30px;"></span>'
            });
			//needed for export
			return qlik.Promise.resolve();
		},resize:function($element,layout){
			
		}
	};

} );

