import { Component, OnInit, Input } from '@angular/core';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import { GraphData } from 'src/app/shared/interfaces/graph-data';
import { PieGraphData } from 'src/app/shared/interfaces/pie-graph-data';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';
import { CanvasService } from 'src/app/shared/services/data/canvas.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-data-graph-canvas',
    templateUrl: './data-graph-canvas.component.html',
    styleUrls: ['./data-graph-canvas.component.css']
})
export class DataGraphCanvasComponent implements OnInit {

    @Input() graphTypeName: string;
    @Input() isCoverageGraph: boolean;
    @Input() set graphOptions(val: DataGraphConfiguration) {
        if (!(val && Object.keys(val))) return;
        const titleYear = val.selectedStartYear === val.selectedEndYear ?
            `${val.selectedStartYear}` : `${val.selectedStartYear}~${val.selectedEndYear}`;
        let title = `${titleYear}-${val.selectedDepartment.name}-${this.graphTypeName}`;
        // 教师统计标题不需要时间信息
        if (val.selectedStartYear === undefined && val.selectedEndYear === undefined) {
            title = `${val.selectedDepartment.name}-${this.graphTypeName}`;
        }
        // 覆盖率统计标题包含项目信息
        if (this.isCoverageGraph) {
            if (val.selectedProgram.id) {
                title = `${val.selectedProgram.name}-${titleYear}-全校-${this.graphTypeName}`;
            } else {
                title = `${val.selectedDepartment.name}全部项目-${titleYear}-全校-${this.graphTypeName}`;
            }
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = this.canvasService.getCanvasData(val).subscribe(canvasData => {
            this.axisList = canvasData.label;
            this.seriesData = canvasData.group_by_data;
            this.buildPieChartOption();
            this.buildBarChartOption(title);
        });
    }

    barChartOption?: EChartOption;
    pieChartOptionList: EChartOption[] = [];

    axisList: string[] = [];
    seriesData: GraphData[];

    baseDoubleBarChartOption: EChartOption = {
        legend: {
            data: ['', ''],
            x: '10%',
            y: '3%'
        },
        grid: {
            containLabel: true,
        },
        tooltip: {
            formatter: '{b}'
        },
        title: [{
            text: '',
            left: '50%',
            textAlign: 'center'
        }],
        xAxis: {
            type: 'value',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            data: [],
            splitLine: {
                show: false
            },
            axisLabel: {
                interval: 0,
            },
        },
        series: [{
            name: '',
            type: 'bar',
            label: {
                normal: {
                    position: 'right',
                    show: true
                }
            },
            data: []
        }]
    };

    baseCoverageBarChartOption: EChartOption = {
        legend: {
            data: ['', ''],
            x: '10%',
            y: '3%'
        },
        grid: {
            containLabel: true,
        },
        title: [{
            text: '',
            left: '50%',
            textAlign: 'center'
        }],
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: [],
            axisLabel: {
                interval: 0,
            },
        },
        tooltip: {
            trigger: 'axis',
        },
        series: [
            {
                name: '',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true,
                    position: 'right',
                },
                data: []
            }
        ]
    };
    basePieChartOption: EChartOption = {
        title: [{
            text: '',
            subtext: '',
            left: '50%',
            textAlign: 'center',
        }],
        grid: {
            containLabel: true,
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            type: 'scroll',
            orient: 'horizontal',
            y: '85%',
            data: ['']
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [],
                label: {
                    normal: {
                        show: true,
                        formatter: '{b}: ({d}%)'
                    }
                },
                labelLine: {
                    normal: {
                        length: 1
                    }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut'
            }
        ]
    };

    private subscription: Subscription;

    /* istanbul ignore next */
    private formatLabel(params: {value: number}) {
        return params.value && params.value > 0 ? `${params.value}` : '';
    }

    /* istanbul ignore next */
    private formatTooltip(c: { value: number, name: string }): string {
        const c0 = c[0] ? c[0].value : 0;
        const c1 = c[1] ? c[1].value : 0;
        const name = c[0] ? c[0].name : c[1].name;
        const val = Math.min(100, Math.max(0, Math.round(c0 / (c0 + c1) * 100)));
        return `${name} 覆盖率: ${c0 + c1 !== 0 ? val + '%' : '暂无相关数据'}`;
    }

    buildPieChartOption() {
        this.pieChartOptionList = [];
        // Only SeriesBar's legend data is string[] type and then SeriesPie is number[]
        (this.basePieChartOption.legend as echarts.EChartOption.SeriesBar).data = this.axisList;
        // Expand the series by the length of seriesData which obtained from backend.
        const pieNum = this.seriesData.length;
        for (let j = 0; j < pieNum; j++) {
            // build pieSeriesData based on seriesData.
            const data: number[] = this.seriesData[j].data;
            const pieGraphData: PieGraphData[] = [];
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                if (data[i] !== 0) {
                    pieGraphData.push({ value: data[i], name: this.axisList[i] } as PieGraphData);
                    sum += data[i];
                } else {
                    pieGraphData.push({ value: null, name: this.axisList[i] } as PieGraphData);
                }
            }
            pieGraphData.sort((a, b) => a.value - b.value);
            // Assign the prepared data to pieChartOption.
            this.basePieChartOption.title[0].text = this.seriesData[j].seriesName + '占比';
            this.basePieChartOption.title[0].subtext = '总计: ' + sum;
            (this.basePieChartOption.series as echarts.EChartOption.SeriesPie[])[0]
                .data = pieGraphData;
            (this.basePieChartOption.series as echarts.EChartOption.SeriesPie[])[0]
                .name = this.seriesData[j].seriesName;
            if (sum !== 0) {
                this.pieChartOptionList.push(JSON.parse(JSON.stringify(this.basePieChartOption)));
            }
        }
    }

    buildBarChartOption(title: string) {
        const chartOption = this.isCoverageGraph ?
            this.baseCoverageBarChartOption : this.baseDoubleBarChartOption;
        (chartOption.yAxis as echarts.EChartOption.SeriesBar).data = this.axisList;
        (chartOption.title as echarts.EChartTitleOption[])[0].text = title;
        // Expand the series based on the length of seriesData which obtained from backend.
        const barSeriesLength = chartOption.series.length;
        const barSeries = chartOption.series[0];
        const legendList: string[] = [];
        for (let i = 0; i < this.seriesData.length; i++) {
            legendList.push(this.seriesData[i].seriesName);
            // Add a series when the length of the current series small than seriesData's length.
            if (i >= barSeriesLength) {
                chartOption.series.push(JSON.parse(JSON.stringify(barSeries)));
            }
            (chartOption.series as echarts.EChartOption.SeriesBar[])[i]
                .name = this.seriesData[i].seriesName;
            (chartOption.series as echarts.EChartOption.SeriesBar[])[i]
                .data = this.seriesData[i].data;
        }
        chartOption.series.splice(this.seriesData.length, chartOption.series.length);
        (chartOption.legend as echarts.EChartOption.SeriesBar).data = legendList;
        this.barChartOption = JSON.parse(JSON.stringify(chartOption));
        if (this.isCoverageGraph) {
            /* istanbul ignore next */
            this.barChartOption.tooltip.formatter = this.formatTooltip;
            for (let i = 0; i < this.seriesData.length; i++) {
                (this.barChartOption.series as echarts.EChartOption.SeriesBar[])[i].label.formatter = this.formatLabel;
            }
        }
    }

    constructor(
        private readonly canvasService: CanvasService
    ) { }

    ngOnInit() {
    }
}
