import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxSkltnModule, SkltnConfig } from 'ngx-skltn';
import { BaseDemoComponent } from './base-demo/base-demo.component';
import { ApiDemoComponent } from './api-demo/api-demo.component';

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
