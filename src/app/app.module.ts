import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxSkltnModule } from './ngx-skltn/ngx-skltn.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
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
