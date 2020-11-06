import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

 
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//unpkg.com/pdfjs-dist@2.0.489/build/pdf.worker.min.js';
  }
 
  public async readPdf(pdfUrl: string) {
    const pdf = await pdfjsLib.getDocument(pdfUrl);
    const countPromises = [];
 
    for (let i = 1; i <= pdf.pdfInfo.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      countPromises.push(textContent.items.map((s) => s.str).join(''));
    }
 
    const pageContents = await Promise.all(countPromises);
    return pageContents.join('');
  }

  getCovidData(date: string) : Observable<any> {
    return this.http.get<any>("https://api.covid19tracking.narrativa.com/api/"+date+"/country/north_macedonia")
               .pipe(
                    map((data: any) => {
                        return data;
                    }),
                    catchError(this.handleError)
               );
  }
  
  private handleError(error: HttpErrorResponse) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
      let errMessage = error.error.message;
      return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'ASP.NET Core server error');
}

}