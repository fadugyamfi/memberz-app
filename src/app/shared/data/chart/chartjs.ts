// barChart
export let barChartOptions: any = {
  scaleShowVerticalLines: false,
  responsive: true
};

export let monthLabels: string[] = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export let monthObjLabels = {1: 'Jan', 2: 'Feb', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'Aug', 9: 'Sept', 10: 'Oct', 11: 'Nov', 12: 'Dec'}

export let barChartType = 'bar';
export let barChartLegend = false;

export var barChartColors: Array<any> = [
  {
    backgroundColor: '#4466f2',
    borderColor: "rgba(30, 166, 236, 0.8)",
    borderWidth: 1,
  },
  {
    backgroundColor: '#1ea6ec',
    borderColor: "rgba(68, 102, 242, 0.8)",
    borderWidth: 1,
  },
];

// LineGraph Chart
export let lineGraphOptions: any = {
  scaleShowGridLines: true,
  scaleGridLineColor: 'rgba(0,0,0,.05)',
  scaleGridLineWidth: 1,
  scaleShowHorizontalLines: true,
  scaleShowVerticalLines: true,
  bezierCurve: true,
  bezierCurveTension: 0.4,
  pointDot: true,
  pointDotRadius: 4,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: false,
  legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
};

export let lineGraphType = 'line';
export let lineGraphLegend = false;

export var lineGraphColors: Array<any> = [
  {
    backgroundColor: 'rgba(68, 102, 242, 0.3)',
    borderColor: "#4466f2",
    borderWidth: 2,
  },
  {
    backgroundColor: 'rgba(30, 166, 236, 0.3)',
    borderColor: "#1ea6ec",
    borderWidth: 2,
  },
];


export let lineChartOptions: any = {
  responsive: true,
  scaleShowVerticalLines: false,
  maintainAspectRatio: false,

};
export var lineChartColors: Array<any> = [
  {
    backgroundColor: 'rgba(68, 102, 242, 0.3)',
    borderColor: "#4466f2",
    borderWidth: 2,
    lineTension: 0,
  },
  {
    backgroundColor: 'rgba(30, 166, 236, 0.3)',
    borderColor: "#1ea6ec",
    borderWidth: 2,
    lineTension: 0,
  },
  {
    backgroundColor: 'rgba(68, 102, 242, 0.4)',
    borderColor: "#4466f2",
    borderWidth: 2,
    lineTension: 0,
  }
];
export let lineChartLegend = false;
export let lineChartType = 'line';

export let doughnutChartColors: any[] = [{ backgroundColor: ['#4466f2', '#1ea6ec', '#FF5370', '#22af47', '#007bff', '#ff2046', ] }];
export let doughnutChartType = 'doughnut';
export let doughnutChartOptions: any = {
  animation: true,
  responsive: true,
  maintainAspectRatio: true
};

// PolarArea
export let polarAreaChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
export let polarAreaChartData: number[] = [300, 500, 100, 40, 120];
export let polarAreaLegend = false;
export let ploarChartColors: any[] = [{ backgroundColor: ['#4466f2', '#1ea6ec', '#22af47', '#007bff', '#ff2046'] }];
export let polarAreaChartType = 'polarArea';
export let polarChartOptions: any = {
  animation: false,
  responsive: true,
  maintainAspectRatio: false
};
