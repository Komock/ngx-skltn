import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkltnComponent } from './skltn/skltn.component';
import { SkltnBoneDirective } from './directives/skltn-bone.directive';
import { SkltnConfigService } from './services/skltn-config.service';
import { SkltnConfig } from './interfaces/skltn-config';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SkltnComponent,
    SkltnBoneDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
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
        provide: SkltnConfigService,
        useValue: config
      }]
    };
  }
}
