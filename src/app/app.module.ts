import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxSkltnModule } from './ngx-skltn/ngx-skltn.module';
import { BaseDemoComponent } from './base-demo/base-demo.component';
import { ApiDemoComponent } from './api-demo/api-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseDemoComponent,
    ApiDemoComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([{
      path: '',
      component: BaseDemoComponent
    }, {
      path: 'api',
      component: ApiDemoComponent
    }]),
    NgxSkltnModule.forRoot({
      rectRadius: 10,
      flareWidth: '150px',
      bgFill: '#d8d5d1',
      flareFill: 'rgba(255,255,255, 0.5)',
    }),
  ],
  providers: [],
  bootstrap: [ AppComponent ],
  exports: []
})
export class AppModule {}
