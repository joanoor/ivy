import * as echarts from 'echarts';
import { BarSeriesOption, XAXisComponentOption, EChartsOption, EChartsCoreOption } from 'echarts';
export { echarts as default };

type ChartType = 'mix' | 'vbar' | 'hbar' | 'pictorialBar' | 'pie' | 'pie_m' | 'line' | 'scatter' | 'map' | 'scatter-map' | 'sankey' | 'radar' | 'funnel' | 'gauge' | 'polarBar' | 'sunburst';
interface CreateChartConfig {
    chartType?: ChartType;
    theme?: ThemeOpt;
    isRealRefresh?: boolean;
    moreOpt?: MoreOpt;
}
interface ThemeOpt {
    name: string;
    theme: Recordable;
}
interface MoreOpt {
    notMerge?: boolean;
    replaceMerge?: string | string[];
    lazyUpdate?: boolean;
}
type LabelOption2 = PropValue<BarSeriesOption, 'label'>;
type LabelLineOption2 = PropValue<BarSeriesOption, 'labelLine'>;
type ItemStyleOption2 = PropValue<BarSeriesOption, 'itemStyle'>;
type AxisTickOption2 = PropValue<XAXisComponentOption, 'axisTick'>;
type AxisLabelOption2 = PropValue<XAXisComponentOption, 'axisLabel'>;
type SplitLineOption2 = XAXisComponentOption['splitLine'];
type AxisLineOption2 = PropValue<XAXisComponentOption, 'axisLine'>;
type AxisPointerOption2 = PropValue<XAXisComponentOption, 'axisPointer'>;

declare class IChart {
    private echartInstance;
    constructor(el: HTMLElement, isRealRefresh?: boolean, theme?: ThemeOpt);
    private initChart;
    getChartInstance(): echarts.ECharts;
    setOption(chartOption: EChartsOption, moreOpt?: MoreOpt): void;
    resizeChart(): void;
    refreshChart(chartOption: EChartsOption, option?: MoreOpt): void;
    disposeChart(): void;
    getChartOption(el: HTMLCanvasElement): EChartsCoreOption | boolean;
}

declare function getDefaultChartOpt(option: EChartsOption, type: ChartType): EChartsOption;

declare function createChart(el: HTMLElement, opt?: EChartsOption, config?: CreateChartConfig): IChart;

export { AxisLabelOption2, AxisLineOption2, AxisPointerOption2, AxisTickOption2, ChartType, CreateChartConfig, IChart, ItemStyleOption2, LabelLineOption2, LabelOption2, MoreOpt, SplitLineOption2, ThemeOpt, createChart, getDefaultChartOpt };
