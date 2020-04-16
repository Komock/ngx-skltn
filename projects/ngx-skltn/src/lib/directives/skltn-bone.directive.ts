import { Directive, ElementRef, Input, ContentChild, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { BonesList } from '../classes/bones-list.class';

@Directive({
  selector: '[skltn-bone]',
})
export class SkltnBoneDirective implements OnInit, OnDestroy {

  @Input() type: 'rect' | 'circle' | 'path';
  @Input() rectRadius: number;
  @Input() pathWidth: number;
  @Input() pathHeight: number;
  @ContentChild('boneTemp', { static: true }) template: TemplateRef<any>;

  private id: string;

  constructor(
    public element: ElementRef,
    private bonesList: BonesList,
  ) {}

  ngOnInit() {
    this.id = this.bonesList.add(this);
  }

  ngOnDestroy() {
    this.bonesList.remove(this.id);
  }

}
