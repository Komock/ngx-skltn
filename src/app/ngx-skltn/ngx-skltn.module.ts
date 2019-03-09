import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkltnComponent } from './skltn/skltn.component';
import { SkltnBoneDirective } from './directives/skltn-bone.directive';

@NgModule({
  declarations: [
    SkltnComponent,
    SkltnBoneDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkltnComponent,
    SkltnBoneDirective,
  ]
})
export class NgxSkltnModule { }
