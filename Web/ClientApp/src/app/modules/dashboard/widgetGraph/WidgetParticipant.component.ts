// Angular
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// Layout config
import { LayoutConfigService } from './../../../core/_base/layout';

export interface FinancialInfo {
	budget: number;
	spent: number;
}

/**
 * Sample components with sample data
 */
@Component({
	selector: 'kt-WidgetParticipant',
	templateUrl: './WidgetParticipant.component.html',
	styleUrls: ['./WidgetParticipant.component.scss']
})
export class WidgetParticipantComponent implements OnInit {
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	// Public properties
	@Input() data: { labels: string[], datasets: any[] };
	@Input() type: string = 'bar';
	@ViewChild('chart', { static: true }) chart: ElementRef;

	labels = ['Speach Therapy', 'Speach Therapy1'];

	/**
	 * Component constructor
	 * @param layoutConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	colors = [];
	getRandomColor(label) {
	  var dynamicColors = function() {
		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		return "rgb(" + r + "," + g + "," + b + ")";
	 };

	 for (var i in label) {
		this.colors.push(dynamicColors());
	 }
	}

	/**
	 * On init
	 */
	ngOnInit(): void {
		if (!this.data) {
			const color = Chart.helpers.color;
			this.getRandomColor(this.labels);
			this.data = {
				labels: this.labels,
				datasets: [{
					label: 'Budget 1',
					backgroundColor: "rgba(151,241,005)",
					data: [1000, 2000]
				}, {
					label: 'Budget 2',
					backgroundColor: "rgba(62,154,100)",
					data: [8500, 6000]
				}, {
					label: 'Budget 3',
					backgroundColor: "rgba(92,154,190)",
					data: [5000]
				}, {
					label: 'Budget 4',
					backgroundColor: "rgba(62,154,100)",
					data: [8500, 6000]
				}, {
					label: 'Budget 5',
					backgroundColor: "rgba(92,154,190)",
					data: [5000, 5000]
				}]
			};
		}
		this.initChart();
	}

	private initChart() {
		// For more information about the chartjs, visit this link
		// https://www.chartjs.org/docs/latest/getting-started/usage.html

		const chart = new Chart(this.chart.nativeElement, {
			type: this.type,
			data: this.data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				legend: false,
				scales: {
					xAxes: [{
						stacked: true,
						// categoryPercentage: 0.35,
						// barPercentage: 0.70,
						// display: true,
						// scaleLabel: {
						// 	display: false,
						// 	labelString: 'Month'
						// },
						// gridLines: false,
						// ticks: {
						// 	display: true,
						// 	beginAtZero: true,
						// 	fontColor: this.layoutConfigService.getConfig('colors.base.shape.3'),
						// 	fontSize: 13,
						// 	padding: 10
						// }
					}],
					yAxes: [{
						stacked: true,
						// categoryPercentage: 0.35,
						// barPercentage: 0.70,
						// display: true,
						// scaleLabel: {
						// 	display: false,
						// 	labelString: 'Value'
						// },
						// gridLines: {
						// 	color: this.layoutConfigService.getConfig('colors.base.shape.2'),
						// 	drawBorder: false,
						// 	offsetGridLines: false,
						// 	drawTicks: false,
						// 	borderDash: [3, 4],
						// 	zeroLineWidth: 1,
						// 	zeroLineColor: this.layoutConfigService.getConfig('colors.base.shape.2'),
						// 	zeroLineBorderDash: [3, 4]
						// },
						// ticks: {
						// 	max: 5000,
						// 	stepSize: 500,
						// 	display: true,
						// 	beginAtZero: true,
						// 	fontColor: this.layoutConfigService.getConfig('colors.base.shape.3'),
						// 	fontSize: 13,
						// 	padding: 10
						// }
					}]
				},
				title: {
					display: false
				},
				hover: {
					mode: 'index'
				},
				tooltips: {
					mode: 'label',
					callbacks: {
						label: function(tooltipItem, data) {
							var corporation = data.datasets[tooltipItem.datasetIndex].label;
							var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
							var total = 0;
							for (var i = 0; i < data.datasets.length; i++)
								total += data.datasets[i].data[tooltipItem.index];
							if (tooltipItem.datasetIndex != data.datasets.length - 1) {
								return corporation + " : $" + valor.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
							} else {
								return [corporation + " : $" + valor.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'), "Total : $" + total];
							}
						}
					}
				},
				layout: {
					padding: {
						left: 0,
						right: 0,
						top: 5,
						bottom: 5
					}
				}
			}
		});
	}
}
