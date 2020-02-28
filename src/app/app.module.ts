import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { BaseDemoComponent } from './base-demo/base-demo.component';
import { ApiDemoComponent } from './api-demo/api-demo.component';
import { NestedDemoComponent } from './nested-demo/nested-demo.component';
import { CardComponent } from './nested-demo/card/card.component';
import { SkltnConfig, NgxSkltnModule } from 'projects/ngx-skltn/src/public_api';

const skltnConfig: SkltnConfig = {
  rectRadius: 4,
  flareWidth: '150px',
  bgFill: '#d8d5d1',
  flareFill: 'rgba(255,255,255, 0.5)',
};

@NgModule({
  declarations: [
    AppComponent,
    BaseDemoComponent,
    ApiDemoComponent,
    NestedDemoComponent,
    CardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([{
      path: '',
      redirectTo: 'base',
      pathMatch: 'full',
    }, {
      path: 'base',
      component: BaseDemoComponent,
    }, {
      path: 'api',
      component: ApiDemoComponent,
    }, {
      path: 'nested',
      component: NestedDemoComponent,
    }, {
      path: '**',
      redirectTo: 'base',
      pathMatch: 'full',
    }]),
    NgxSkltnModule.forRoot(skltnConfig),
  ],
  providers: [],
  bootstrap: [ AppComponent ],
  exports: []
})
export class AppModule {}
