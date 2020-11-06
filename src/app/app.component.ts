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
  last7DaysDate = Date.now();
  stats: string[];
  statscounter = 0;
  counter = 0;
  arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '%', '.', ','];
  month: string;
  date: string;
  year: string;
  apidate: string;
  apidatel7d: string;
  flag1 = 0;
  flag2 = 0;
  model: Korona = {};
  gradovi: Korona[] = [];
  mk: Korona = {};
  svet: Korona = {};
  selectedValue: Korona;
  mk7days: any[] = [];
  svet7days: any[] = [];
  checker: string;

  constructor(private dataService: DataService) { 

   }
 
  ngOnInit() {
    this.checker = formatDate(this.now - 259200000, "dd.MM", "en-US");
    if(this.checker[0] === '0') {
      this.checker = this.checker.substring(1);
    }
    if(localStorage.getItem("date") === this.checker) {
      localStorage.clear();
      console.log("Clearing cache..")
    }
    if (localStorage.getItem("selectedValue") != null && localStorage.getItem("mk") != null && localStorage.getItem("svet") != null && localStorage.getItem("gradovi") != null && localStorage.getItem("date") != null && localStorage.getItem("mk7days") != null && localStorage.getItem("svet7days") != null) {
      this.selectedValue = JSON.parse(localStorage.getItem("selectedValue"));
      this.mk = JSON.parse(localStorage.getItem("mk"));
      this.svet = JSON.parse(localStorage.getItem("svet"));
      this.gradovi = JSON.parse(localStorage.getItem("gradovi"));
      this.date = localStorage.getItem("date");
      this.mk7days = JSON.parse(localStorage.getItem("mk7days"));
      this.svet7days = JSON.parse(localStorage.getItem("svet7days"));
    } else {
      this.now = this.now - 86400000;
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
  }

  retrievedata() {
    this.dataService.readPdf('https://cors-anywhere.herokuapp.com/http://iph.mk/wp-content/uploads/'+this.year+'/'+this.month+'/'+this.date+'.pdf')
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
    
    if(this.gradovi[0]) {
      this.selectedValue = this.gradovi[0];
    }
    localStorage.setItem("date", this.date);
    localStorage.setItem("gradovi", JSON.stringify(this.gradovi));
    localStorage.setItem("selectedValue", JSON.stringify(this.selectedValue));
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

          this.mk7days.push(this.mk);
          this.svet7days.push(this.svet);
          localStorage.setItem("mk", JSON.stringify(this.mk));
          localStorage.setItem("svet", JSON.stringify(this.svet));
          this.retrieveCovidDataLast7Days(this.nowCD);
        }
      },
      (err: any) => {
        console.log(err);
        this.nowCD = this.nowCD - 86400000;
        this.apidate = formatDate(this.nowCD, "yyyy-MM-dd", "en-US");
        this.retrieveCovidData(this.apidate);
      });
  }

  retrieveCovidDataLast7Days(nowCD?: number) {
    if(this.mk7days.length > 6) {
      localStorage.setItem("mk7days", JSON.stringify(this.mk7days));
      localStorage.setItem("svet7days", JSON.stringify(this.svet7days));
      return;
    }
    this.nowCD = this.nowCD - 86400000;
    this.apidatel7d = formatDate(this.nowCD, "yyyy-MM-dd", "en-US");
    this.dataService.getCovidData(this.apidatel7d)
      .subscribe((data: any) => {
        let dayMKData = {
          novozaboleni: data.dates[this.apidatel7d].countries['North Macedonia'].today_new_confirmed,
          novopochinati: data.dates[this.apidatel7d].countries['North Macedonia'].today_new_deaths,
          novoozdraveni: data.dates[this.apidatel7d].countries['North Macedonia'].today_new_recovered,
          vkupnozaboleni: data.dates[this.apidatel7d].countries['North Macedonia'].today_confirmed,
          vkupnopochinati: data.dates[this.apidatel7d].countries['North Macedonia'].today_deaths,
          vkupnoozdraveni: data.dates[this.apidatel7d].countries['North Macedonia'].today_recovered,
          aktivni: data.dates[this.apidatel7d].countries['North Macedonia'].today_open_cases,
          date: data.dates[this.apidatel7d].countries['North Macedonia'].date
        };
        let dayWData = {
          novozaboleni:data.total.today_new_confirmed,
          novopochinati: data.total.today_new_deaths,
          novoozdraveni: data.total.today_new_recovered,
          vkupnozaboleni: data.total.today_confirmed,
          vkupnopochinati: data.total.today_deaths,
          vkupnoozdraveni: data.total.today_recovered,
          aktivni: data.total.today_open_cases,
          date: data.total.date
        };
        this.mk7days.push(dayMKData);
        this.svet7days.push(dayWData);
        this.retrieveCovidDataLast7Days(nowCD);
        },
        (err: any) => {
          console.log(err); 
      });
  }
}