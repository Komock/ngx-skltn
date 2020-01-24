import {
  Component, OnInit, Input, ContentChildren, QueryList, ElementRef,
  ChangeDetectorRef, HostListener, AfterViewInit, NgZone, OnDestroy,
} from '@angular/core';
import { SkltnBoneDirective } from '../directives/skltn-bone.directive';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, interval, Subscription } from 'rxjs';
import { throttleTime, tap, takeUntil } from 'rxjs/operators';
import { SkltnConfig } from '../interfaces/skltn-config';
import { SkltnService } from '../services/skltn.service';

@Component({
  selector: 'skltn-root',
  templateUrl: './skltn.component.html',
  styleUrls: ['./skltn.component.scss']
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

  @ContentChildren(SkltnBoneDirective) bones: QueryList<SkltnBoneDirective>;

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

  constructor(
    private skltnService: SkltnService,
    private element: ElementRef,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private zone: NgZone,
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
    this.calcShapes();
    this.cd.detectChanges();

    // Bones Updates
    this.bones.changes.pipe(
      tap((bones) => {
        this.calcShapes();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe();

    // Run Check
    this.checkStream$.next();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getSufixWithID(): string {
    return Math.random().toString(36).substr(2, 4) + '-skltn';
  }

  calcShapes(): void {
    // Root SVG Element
    const el = this.element.nativeElement;
    this.parentClientRect = el.getBoundingClientRect();
    this.viewBox = `0 0 ${this.parentClientRect.width} ${this.parentClientRect.height}`;

    // SVG Shapes
    this.shapes = this.bones.toArray().map(bone => {
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
