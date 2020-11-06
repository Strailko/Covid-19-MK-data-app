import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Korona } from '../shared/interfaces';
import { Chart } from '../../../node_modules/chart.js';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  @Input() selectedValue: Korona;
  @Input() mk: Korona;
  @Input() svet: Korona;
  @Input() mk7days: any[];
  @Input() svet7days: any[];
  @Input() gradovi: Korona[];
  @Input() date: string;
  selectedValueDummy: Korona;
  IsExpanded1: boolean;
  IsExpanded2: boolean;
  IsExpanded3: boolean;
  new = [];
  names = [];
  color = [];
  dataTypes = [['novozaboleni','Новозаболени'],['novopochinati','Новопочинати'],['novoozdraveni','Новооздравени'],['vkupnozaboleni','Вкупно заболени'],['vkupnopochinati','Вкупно починати'],['vkupnoozdraveni','Вкупно оздравени'],['vkupnoozdraveni','Вкупно активни случаи']];
  dataType2 = 'novozaboleni';
  dataType3 = 'novozaboleni';
  chartInitialized: boolean = false;
  chartInitialized2: boolean = false;
  chartInitialized3: boolean = false;
  chartTypes = [['line','Линиски график'],['bar','Столбест график'],['radar','Радар'],['doughnut','Doughnut график'],['pie','Пита'],['polarArea','Polar area график']];
  chartType = 'bar';
  chartType2 = 'line';
  chartType3 = 'line';
  private mediaMatcher: MediaQueryList = matchMedia(
    `(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`
  );
  chart;
  chart2;
  chart3;
  @ViewChild('canvas') myCanvas: ElementRef;
  @ViewChild('canvas2') myCanvas2: ElementRef;
  @ViewChild('canvas3') myCanvas3: ElementRef;
  public context: CanvasRenderingContext2D;
  public context2: CanvasRenderingContext2D;
  public context3: CanvasRenderingContext2D;

  constructor() {}

  ngOnInit(): void {
    if (this.isScreenSmall()) {
      this.IsExpanded1 = false;
      this.IsExpanded2 = false;
      this.IsExpanded3 = false;
    } else {
      this.IsExpanded1 = true;
      this.IsExpanded2 = true;
      this.IsExpanded3 = true;
    }
  }

  ngAfterViewInit(): void {
    setInterval(() => {
      if(this.mk && !this.chartInitialized2) {
        this.reinitiateChart(2);
      }
      if(this.svet && !this.chartInitialized3) {
        this.reinitiateChart(3);
      }
      if(this.gradovi && this.selectedValue && !this.chartInitialized && this.myCanvas) {
        this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
        this.chart = new Chart(this.context, {
          type: this.chartType,
          data: {
            labels: ['Новозаразени во '+this.selectedValue.grad, 'Новопочинати во '+this.selectedValue.grad, 'Новооздравени во '+this.selectedValue.grad, 'Активни случаи во '+this.selectedValue.grad, 'Вкупно заболени во '+this.selectedValue.grad, 'Вкупно починати во '+this.selectedValue.grad, 'Вкупно оздравени во '+this.selectedValue.grad],
            datasets: [
              {
                label: 'Коронавирус во '+this.selectedValue.grad,
                data: [this.selectedValue.novozaboleni,this.selectedValue.novopochinati,this.selectedValue.novoozdraveni,this.selectedValue.aktivni,this.selectedValue.vkupnozaboleni,this.selectedValue.vkupnopochinati, this.selectedValue.vkupnoozdraveni],
                backgroundColor: [
                  this.randomColorGenerator(),
                  this.randomColorGenerator(),
                  this.randomColorGenerator(),
                  this.randomColorGenerator(),
                  this.randomColorGenerator(),
                  this.randomColorGenerator(),
                  this.randomColorGenerator(),
                  this.randomColorGenerator(),
                ],
                borderColor: '#3F51B5',
                borderWidth: 1,
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          },
        });
        
        this.chartInitialized = true;
        return;
      }
    },2500);
  }

  reinitiateChart(n) {
    if(n == 1) {
      this.chartInitialized = false;
      this.chart.destroy();
      this.ngAfterViewInit();
    }
    else if(n == 2 && this.mk7days.length == 7 && this.myCanvas2) {
      this.chartInitialized2 = false;
      if(this.chart2) {
        this.chart2.destroy();
      }
      this.context2 = (<HTMLCanvasElement>this.myCanvas2.nativeElement).getContext('2d');
      this.chart2 = new Chart(this.context2, {
        type: this.chartType2,
        data: {
          labels: [this.mk7days[0].date, this.mk7days[1].date, this.mk7days[2].date, this.mk7days[3].date, this.mk7days[4].date, this.mk7days[5].date, this.mk7days[6].date],
          datasets: [
            {
              label: 'Коронавирус во Македонија во последните 7 дена',
              data: [this.mk7days[0][this.dataType2], this.mk7days[1][this.dataType2], this.mk7days[2][this.dataType2], this.mk7days[3][this.dataType2], this.mk7days[4][this.dataType2], this.mk7days[5][this.dataType2], this.mk7days[6][this.dataType2]],
              backgroundColor: [
                this.randomColorGenerator(),
                this.randomColorGenerator(),
                this.randomColorGenerator(),
                this.randomColorGenerator(),
                this.randomColorGenerator(),
                this.randomColorGenerator(),
                this.randomColorGenerator()
              ],
              borderColor: '#3F51B5',
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
      
      this.chartInitialized2 = true;
      return;
    }
    else if(n == 3 && this.svet7days.length == 7 && this.myCanvas3) {
      this.chartInitialized3 = false;
      if(this.chart3) {
        this.chart3.destroy();
      }
      this.context3 = (<HTMLCanvasElement>this.myCanvas3.nativeElement).getContext('2d');
      this.chart3 = new Chart(this.context3, {
        type: this.chartType3,
        data: {
          labels: [this.svet7days[0].date, this.svet7days[1].date, this.svet7days[2].date, this.svet7days[3].date, this.svet7days[4].date, this.svet7days[5].date, this.svet7days[6].date],
          datasets: [
            {
              label: 'Коронавирус во светот во последните 7 дена',
              data: [this.svet7days[0][this.dataType3], this.svet7days[1][this.dataType3], this.svet7days[2][this.dataType3], this.svet7days[3][this.dataType3], this.svet7days[4][this.dataType3], this.svet7days[5][this.dataType3], this.svet7days[6][this.dataType3]],
              backgroundColor: [
                this.randomColorGenerator(),
                this.randomColorGenerator(),
                this.randomColorGenerator(),
                this.randomColorGenerator(),
                this.randomColorGenerator(),
                this.randomColorGenerator(),
                this.randomColorGenerator()
              ],
              borderColor: '#3F51B5',
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
      
      this.chartInitialized3 = true;
      return;
    }
  }

  randomColorGenerator() { 
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
  };

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }

  expand(n) {
    if (n == 1) {
      this.IsExpanded1 = !this.IsExpanded1;
      this.chartInitialized = false;
    } else if (n == 2) {
      this.IsExpanded2 = !this.IsExpanded2;
      this.chartInitialized2 = false;
    } else if (n == 3) {
      this.IsExpanded3 = !this.IsExpanded3;
      this.chartInitialized3 = false;
    }
  }
}
