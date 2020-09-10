import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { debounceTime, takeUntil, delay, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { SkltnComponent } from './skltn.component';
import { NgxSkltnModule } from '../ngx-skltn.module';

const avatarCount = 1;
const titleCount = 1;
const linesCount = 5;

@Component({
    selector: 'app-host',
    template: `
    <skltn-root>
        <div class="skltn-card">
            <div skltn-bone class="skltn-card__avatar" type="circle"></div>
            <div class="skltn-card__body" *ngIf="showBones">
                <div skltn-bone class="skltn-card__title"></div>
                <div skltn-bone *ngFor="let line of lines" class="skltn-card__line"></div>
            </div>
        </div>
    </skltn-root>
    `
})
class TestHostComponent {
    @ViewChild(SkltnComponent, { static: true }) skltnComponent: SkltnComponent;
    lines: number[];
    showBones = true;
    constructor() {
        this.lines = (new Array(linesCount)).fill(1);
    }
}

describe('SkltnComponent', () => {
    let checkStream$: Observable<any>;
    let component: TestHostComponent;
    let skltnComponent: SkltnComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let maskId: string;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgxSkltnModule.forRoot()],
            declarations: [TestHostComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        skltnComponent = fixture.componentInstance.skltnComponent;
        maskId = fixture.componentInstance.skltnComponent.maskId;
        // tslint:disable-next-line: no-string-literal
        checkStream$ = skltnComponent['checkStream$'].pipe(
            take(1),
        );
    });

    it(`should have ${linesCount} lines`, (done) => {
        expect(fixture.nativeElement.querySelectorAll('.skltn-card .skltn-card__line').length).toEqual(linesCount);
        checkStream$.subscribe(() => {
            const rects = fixture.nativeElement.querySelectorAll(`.svg-root #${maskId} rect`);
            expect(rects.length - titleCount).toEqual(linesCount);
            done();
        });
    });

    it(`should have ${titleCount} title`, (done) => {
        expect(fixture.nativeElement.querySelectorAll('.skltn-card .skltn-card__title').length).toEqual(titleCount);
        checkStream$.subscribe(() => {
            const rects = fixture.nativeElement.querySelectorAll(`.svg-root #${maskId} rect`);
            expect(rects.length - linesCount).toEqual(titleCount);
            done();
        });
    });

    it(`should have ${avatarCount} title`, (done) => {
        expect(fixture.nativeElement.querySelectorAll('.skltn-card .skltn-card__avatar').length).toEqual(avatarCount);
        checkStream$.subscribe(() => {
            expect(fixture.nativeElement.querySelectorAll('.svg-root #' + maskId + ' ellipse').length).toEqual(avatarCount);
            done();
        });
    });

    it(`should be unsubscribed from all streams after destroy component`, () => {
        const skltnCmp = fixture.componentInstance.skltnComponent;
        skltnCmp.ngOnDestroy();
        fixture.detectChanges();
        expect(skltnCmp.updStream$.observers.length).toEqual(0);
        expect(skltnCmp.checkStream$.observers.length).toEqual(0);
        expect(skltnCmp.unsubscribe$.isStopped).toEqual(true);
    });

    it(`shouldn't have shapes if all bones hidden`, (done) => {
      fixture.componentInstance.showBones = false;
      fixture.detectChanges();
      checkStream$.subscribe(() => {
        const rects = fixture.nativeElement.querySelectorAll(`.svg-root #${maskId} rect`);
        console.log(rects);
        expect(rects.length).toEqual(0);
        done();
      });
  });
});
