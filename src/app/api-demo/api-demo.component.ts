import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, delay } from 'rxjs/operators';


@Component({
  selector: 'app-api-demo',
  templateUrl: './api-demo.component.html',
  styleUrls: ['./api-demo.component.scss']
})
export class ApiDemoComponent implements OnInit {

  items: any[];

  skltnArr = (new Array(4)).fill(1);

  showSkltn = false;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
  }

  loadRepos() {
    this.showSkltn = true;
    this.http.get<{items: any[]}>('//api.github.com/search/repositories?q=angular&sort=stars&order=desc')
      .pipe(
        delay(2000),
        tap(res => {
          this.showSkltn = false;
          this.items = res.items;
        })
      )
      .subscribe();
  }

}
