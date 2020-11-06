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
  @Input() gradovi: Korona[];
  @Input() date: string;
  IsExpanded1: boolean;
  IsExpanded2: boolean;
  IsExpanded3: boolean;
  new = [];
  names = [];
  color =[];
  chartInitialized: boolean = false;
  chartInitialized2: boolean = false;
  chartInitialized3: boolean = false;
  chartTypes = [['line','Линиски график'],['bar','Столбест график'],['radar','Радар'],['doughnut','Doughnut график'],['pie','Пита'],['polarArea','Polar area график']];
  chartType = 'bar';
  chartType2 = 'bar';
  chartType3 = 'bar';
  private mediaMatcher: MediaQueryList = matchMedia(
    `(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`
  );
  chart;
  @ViewChild('canvas') myCanvas: ElementRef;
  @ViewChild('canvas2') myCanvas2: ElementRef;
  @ViewChild('canvas3') myCanvas3: ElementRef;
  public context: CanvasRenderingContext2D;

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
      if(this.gradovi && this.selectedValue && !this.chartInitialized) {
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
    if(this.mk && !this.chartInitialized2) {
      this.reinitiateChart(2);
    }
    if(this.svet && !this.chartInitialized3) {
      this.reinitiateChart(3);
    }
  }

  reinitiateChart(n) {
    if(n == 1) {
      console.log("inicijalizacija 1");
      this.chartInitialized = false;
      this.chart.destroy();
      this.ngAfterViewInit();
    }
    else if(n == 2) {
      this.chartInitialized2 = false;
      console.log("inicijalizacija 2");
      this.context = (<HTMLCanvasElement>this.myCanvas2.nativeElement).getContext('2d');
      this.chart = new Chart(this.context, {
        type: this.chartType2,
        data: {
          labels: ['Новозаразени во Македонија', 'Новопочинати во Македонија', 'Новооздравени во Македонија', 'Активни случаи во Македонија', 'Вкупно заболени во Македонија', 'Вкупно починати во Македонија', 'Вкупно оздравени во Македонија'],
          datasets: [
            {
              label: 'Коронавирус во Македонија',
              data: [1,2,3,4,5,6,7],
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
    else if(n == 3) {
      this.chartInitialized3 = false;
      console.log("inicijalizacija 3");
      this.context = (<HTMLCanvasElement>this.myCanvas3.nativeElement).getContext('2d');
      this.chart = new Chart(this.context, {
        type: this.chartType3,
        data: {
          labels: ['Новозаразени во Македонија', 'Новопочинати во Македонија', 'Новооздравени во Македонија', 'Активни случаи во Македонија', 'Вкупно заболени во Македонија', 'Вкупно починати во Македонија', 'Вкупно оздравени во Македонија'],
          datasets: [
            {
              label: 'Коронавирус во светот',
              data: [1,2,3,4,5,6,7],
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
    } else if (n == 3) {
      this.IsExpanded3 = !this.IsExpanded3;
    }
  }
}
