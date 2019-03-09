import {
  Component, OnInit, Input, ContentChildren, QueryList, ElementRef,
  ChangeDetectorRef, HostListener, AfterViewInit
} from '@angular/core';
import { SkltnBoneDirective } from '../directives/skltn-bone.directive';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'skltn-root',
  templateUrl: './skltn.component.html',
  styleUrls: ['./skltn.component.scss']
})
export class SkltnComponent implements OnInit, AfterViewInit {

  @Input() rectRadius: number;

  @Input() bgFill = '#ddd';

  @Input() flareFill = '#f5f5f5';

  @Input() flareWidth = '80px';

  @Input() duration = '2';

  @ContentChildren(SkltnBoneDirective) bones: QueryList<SkltnBoneDirective>;

  viewBox: string;

  shapes: any[];

  parentClientRect: any;

  animationCss: SafeHtml;

  updStream$ = new Subject();

  constructor(
    private element: ElementRef,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updStream$.next();
  }

  ngOnInit() {
    this.animationCss = this.sanitizer.bypassSecurityTrustHtml(`
    <style>
    @keyframes flareAnimation {
        0% { x: calc(0% - ${this.flareWidth}); }
        100% { x: calc(100% + ${this.flareWidth}); }
    }
    .flare { animation: flareAnimation ${this.duration}s infinite; }
    </style>`);

    // Update
    this.updStream$.pipe(
      debounceTime(100),
      tap(() => this.calcShapes()),
    ).subscribe();
  }

  ngAfterViewInit() {
    this.calcShapes();
    // console.log(this.shapes);
    this.cd.detectChanges();
  }

  calcShapes(): void {
    // Root SVG Element
    const el = this.element.nativeElement;
    this.parentClientRect = el.getBoundingClientRect();
    this.viewBox = `0 0 ${this.parentClientRect.width} ${this.parentClientRect.height}`;

    // SVG Shapes
    this.shapes = this.bones.toArray().map(bone => {
      const el = bone.element.nativeElement;
      const clientRect = el.getBoundingClientRect();
      const radius = bone.rectRadius || this.rectRadius;
      if (bone.type === 'circle') {
        return {
          type: 'circle',
          cx: clientRect.x - this.parentClientRect.x + clientRect.width / 2,
          cy: clientRect.y - this.parentClientRect.y + clientRect.height / 2,
          r: clientRect.height / 2,
        };
      }
      if (bone.type === 'path') {
        const x = clientRect.x - this.parentClientRect.x;
        const y = clientRect.y - this.parentClientRect.y;
        let transform = `translate(${x}, ${y})`;
        if (bone.pathWidth && bone.pathHeight) {
          const xScale = (clientRect.width / bone.pathWidth).toFixed(2);
          const yScale = (clientRect.height / bone.pathHeight).toFixed(2);
          transform += ` scale(${xScale}, ${yScale})`;
        }
        return {
          type: 'path',
          width: clientRect.width,
          height: clientRect.height,
          transform,
          template: bone.template,
        };
      }
      return {
        type: 'rect',
        x: clientRect.x - this.parentClientRect.x,
        y: clientRect.y - this.parentClientRect.y,
        width: clientRect.width,
        height: clientRect.height,
        rx: radius,
        ry: radius,
      };
    });
  }

}
