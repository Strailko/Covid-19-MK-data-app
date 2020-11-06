import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { DataService } from './shared/data.service';
import { Korona } from './shared/interfaces';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  now = Date.now();
  nowCD = Date.now();
  stats: string[];
  statscounter = 0;
  counter = 0;
  arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '%', '.', ','];
  month: string;
  date: string;
  year: string;
  apidate: string;
  flag1 = 0;
  flag2 = 0;
  model: Korona = {};
  gradovi: Korona[] = [];
  mk: Korona = {};
  svet: Korona = {};
  selectedValue: Korona;

  constructor(private dataService: DataService) { 

   }
 
  ngOnInit() {
      this.now = this.now;
      this.year = formatDate(this.now, "yyyy", "en-US");
      this.month = formatDate(this.now, "MM", "en-US");
      this.date = formatDate(this.now, "dd.MM", "en-US");
      if(this.date[0] === '0') {
        this.date = this.date.substring(1);
      }
      this.retrievedata();
      this.apidate = formatDate(this.nowCD, "yyyy-MM-dd", "en-US");
      this.retrieveCovidData(this.apidate);
  }

  retrievedata() {
    //this.dataService.readPdf('https://cors-anywhere.herokuapp.com/http://iph.mk/wp-content/uploads/'+this.year+'/'+this.month+'/'+this.date+'.pdf')
    this.dataService.readPdf('assets/4.11.pdf')
      .then(text => {
        text = text.slice(text.indexOf("Активни случаи (вкупно) ")+24, text.indexOf("   Вкупно "));
        this.stats = text.replace("Крива Паланка", "Крива-Паланка").replace("Демир Хисар", "Демир-Хисар").replace("Македонски Брод", "Македонски-Брод").replace("Свети Николе","Свети-Николе")
        .split('     ').join(' 0 0 ').split('   ').join(' 0 ').split(' ');
        this.processData(this.stats);
      }, reason => {
        console.log(reason);
            this.now = this.now - 86400000;
            this.month = formatDate(this.now, "MM", "en-US");
            this.date = formatDate(this.now, "dd.MM", "en-US");
            if(this.date[0] === '0') {
              this.date = this.date.substring(1);
            }
            this.flag1 = 0;
            this.flag2 = 0;
            this.retrievedata();
      });
  }

  processData(stats: string[]) {
    for(let i of stats) {
      this.statscounter = this.statscounter + 1;
      if(this.statscounter == 1) {
        this.model.id = i;
      }
      else if(this.statscounter == 2){
        i = i.replace('-', ' ');
        i = i.replace("***", '');
        i = i.replace("**", '');
        this.model.grad = i.replace("*", '');
      }
      else if(this.statscounter == 3){
        this.model.novozaboleni = i;
      }
      else if(this.statscounter == 4){
        this.model.novopochinati = i;
      }
      else if(this.statscounter == 5){
        this.model.novoozdraveni = i;
      }
      else if(this.statscounter == 6){
        this.model.vkupnozaboleni = i;
      }
      else if(this.statscounter == 8){
        this.model.vkupnopochinati = i;
      }
      else if(this.statscounter == 11){
        this.model.vkupnoozdraveni = i;
      }
      else if(this.statscounter == 12){
        this.model.aktivni = i;
      }

      if(this.statscounter > 11) {
        this.gradovi.push(this.model);
        this.model = {};
        this.statscounter = 0;
      }
    }
    
    if(this.gradovi[28]) {
      this.selectedValue = this.gradovi[28];
    }
  }

  retrieveCovidData(apidate: string) {
    this.dataService.getCovidData(apidate)
    .subscribe((data: any) => {
      if(data.dates[apidate].countries['North Macedonia'].today_new_confirmed == 0) {
        this.nowCD = this.nowCD - 86400000;
        this.apidate = formatDate(this.nowCD, "yyyy-MM-dd", "en-US");
        this.retrieveCovidData(this.apidate);
      }
      else {
        this.mk.novozaboleni = data.dates[apidate].countries['North Macedonia'].today_new_confirmed;
        this.mk.novopochinati = data.dates[apidate].countries['North Macedonia'].today_new_deaths;
        this.mk.novoozdraveni = data.dates[apidate].countries['North Macedonia'].today_new_recovered;
        this.mk.vkupnozaboleni = data.dates[apidate].countries['North Macedonia'].today_confirmed;
        this.mk.vkupnopochinati = data.dates[apidate].countries['North Macedonia'].today_deaths;
        this.mk.vkupnoozdraveni = data.dates[apidate].countries['North Macedonia'].today_recovered;
        this.mk.aktivni = data.dates[apidate].countries['North Macedonia'].today_open_cases;
        this.mk.date = data.dates[apidate].countries['North Macedonia'].date;

        this.svet.novozaboleni = data.total.today_new_confirmed;
        this.svet.novopochinati = data.total.today_new_deaths;
        this.svet.novoozdraveni = data.total.today_new_recovered;
        this.svet.vkupnozaboleni = data.total.today_confirmed;
        this.svet.vkupnopochinati = data.total.today_deaths;
        this.svet.vkupnoozdraveni = data.total.today_recovered;
        this.svet.aktivni = data.total.today_open_cases;
        this.svet.date = data.total.date;
      }
    },
    (err: any) => {
      console.log(err);
      this.nowCD = this.nowCD - 86400000;
      this.apidate = formatDate(this.nowCD, "yyyy-MM-dd", "en-US");
      this.retrieveCovidData(this.apidate);           
  });
  }
}