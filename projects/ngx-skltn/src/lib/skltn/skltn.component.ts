import {
  Component, OnInit, Input, ElementRef,
  ChangeDetectorRef, HostListener, AfterViewInit, NgZone, OnDestroy,
} from '@angular/core';
import { SkltnBoneDirective } from '../directives/skltn-bone.directive';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { throttleTime, debounceTime, filter, tap, takeUntil } from 'rxjs/operators';
import { SkltnConfig } from '../interfaces/skltn-config';
import { SkltnService } from '../services/skltn.service';
import { generateId } from '../helpers';
import { BonesList } from '../classes/bones-list.class';

@Component({
  selector: 'skltn-root',
  templateUrl: './skltn.component.html',
  styleUrls: ['./skltn.component.scss'],
  providers: [{
    provide: BonesList,
    useClass: BonesList,
  }]
})
export class SkltnComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() rectRadius: number;

  @Input() bgFill: string;

  @Input() flareFill: string;

  @Input() flareWidth: string;

  @Input() duration: number;

  @Input() delay: number;

  @Input() timing: string;

  @Input() showSkltn = true;

  @Input() checkInterval = 100;

  viewBox: string;

  shapes: any[];

  parentClientRect: any;

  animationCss: SafeHtml;

  href: string;

  sufix: string;

  gradientId: string;

  maskId: string;

  updStream$ = new Subject();

  checkStream$ = new Subject();

  unsubscribe$ = new Subject();

  defaultConfig: SkltnConfig = {
    rectRadius: 4,
    bgFill: '#ddd',
    flareFill: 'rgba(255, 255, 255, 0.6)',
    flareWidth: '150px',
    duration: 1200,
    delay: 0,
    timing: 'ease-in-out',
  };

  private bones: SkltnBoneDirective[];

  constructor(
    private skltnService: SkltnService,
    private element: ElementRef,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private zone: NgZone,
    private bonesList: BonesList,
  ) {
    const conf = this.skltnService.config;
    this.rectRadius = conf.rectRadius;
    this.bgFill = conf.bgFill;
    this.flareFill = conf.flareFill;
    this.flareWidth = conf.flareWidth;
    this.duration = conf.duration;
    this.delay = conf.delay;
    this.timing = conf.timing;
    this.sufix = this.getSufixWithID();
    this.gradientId = 'gradient-' + this.sufix;
    this.maskId = 'mask-' + this.sufix;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updStream$.next();
  }

  ngOnInit() {
    this.animationCss = this.sanitizer.bypassSecurityTrustHtml(`
    <style>
    @keyframes skltnFlareAnimation {
        0% { x: calc(0% - ${this.flareWidth}); }
        100% { x: 100%; }
    }
    .skltn-flare {
      animation-name: skltnFlareAnimation;
      animation-duration: ${this.duration}ms;
      animation-timing-function: ${this.timing};
      animation-iteration-count: infinite;
      animation-delay: ${this.delay}ms;
    }
    </style>`);

    // Bones Updates
    this.bonesList.changes.pipe(
      debounceTime(50),
      tap(list => {
        this.bones = list;
        this.calcShapes();
        this.cd.detectChanges();
      }),
      filter((list, index) => index === 0),
      tap(() => {
        this.checkStream$.next();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe();

    // Update
    this.updStream$.pipe(
      throttleTime(50),
      takeUntil(this.unsubscribe$),
    ).subscribe(() => this.calcShapes());

    // Update href (Safari Bug, SVG Ref Path)
    this.href = window.location.href;

    this.zone.runOutsideAngular(() => {
      this.checkStream$.pipe(
        tap(() => {
          // Check if href changed
          if (this.href !== window.location.href) {
            this.href = window.location.href;
            this.cd.detectChanges();
          }

          // Check if root element resized
          const el = this.element.nativeElement;
          const { width, height } = el.getBoundingClientRect();
          if (this.parentClientRect.width !== width || this.parentClientRect.height !== height) {
            this.updStream$.next();
            this.cd.detectChanges();
          }
          setTimeout(() => {
            this.checkStream$.next();
          }, this.checkInterval);
        }),
        takeUntil(this.unsubscribe$),
      ).subscribe();
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getSufixWithID(): string {
    return generateId() + '-skltn';
  }

  calcShapes(): void {
    // Root SVG Element
    const el = this.element.nativeElement;
    this.parentClientRect = el.getBoundingClientRect();
    this.viewBox = `0 0 ${this.parentClientRect.width} ${this.parentClientRect.height}`;

    // SVG Shapes
    if (!this.bones?.length) {
      this.shapes = null;
      return;
    }
    this.shapes = this.bones.map(bone => {
      const boneEl = bone.element.nativeElement;
      const clientRect = boneEl.getBoundingClientRect();
      const radius = bone.rectRadius || this.rectRadius;
      if (bone.type === 'circle') {
        return {
          type: 'circle',
          cx: clientRect.x - this.parentClientRect.x + clientRect.width / 2,
          cy: clientRect.y - this.parentClientRect.y + clientRect.height / 2,
          rx: clientRect.width / 2,
          ry: clientRect.height / 2,
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
