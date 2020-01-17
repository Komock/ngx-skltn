import { Directive, ElementRef, Input, ContentChild, TemplateRef } from '@angular/core';

@Directive({
  selector: '[skltn-bone]',
})
export class SkltnBoneDirective {

  @Input() type: 'rect' | 'circle' | 'path';
  @Input() rectRadius: number;
  @Input() pathWidth: number;
  @Input() pathHeight: number;
  @ContentChild('boneTemp', { static: true }) template: TemplateRef<any>;

  constructor(
    public element: ElementRef
  ) { }

}
