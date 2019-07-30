import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkltnComponent } from './skltn/skltn.component';
import { SkltnBoneDirective } from './directives/skltn-bone.directive';
import { SkltnService } from './services/skltn.service';
import { SkltnConfig } from './interfaces/skltn-config';
import { SKLTN_CONFIG_TOKEN } from './services/skltn-config.service';

@NgModule({
  declarations: [
    SkltnComponent,
    SkltnBoneDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    SkltnComponent,
    SkltnBoneDirective,
  ]
})
export class NgxSkltnModule {
  static forRoot(config: Partial<SkltnConfig> = {}): ModuleWithProviders {
    return {
      ngModule: NgxSkltnModule,
      providers: [{
        provide: SKLTN_CONFIG_TOKEN,
        useValue: config,
      },
      {
        provide: SkltnService,
        useClass: SkltnService,
        deps: [ SKLTN_CONFIG_TOKEN ],
      }]
    };
  }
}
