import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
            <div class="skltn-card__body">
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
    constructor() {
        this.lines = (new Array(linesCount)).fill(1);
    }
}

describe('SkltnComponent', () => {
    let component: TestHostComponent;
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
        maskId = fixture.componentInstance.skltnComponent.maskId;
    });

    it(`should have ${linesCount} lines`, fakeAsync(() => {
        fixture.detectChanges();
        tick(1400);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.skltn-card .skltn-card__line').length).toEqual(linesCount);
        expect(fixture.nativeElement.querySelectorAll('.svg-root #' + maskId + ' rect').length - titleCount).toEqual(linesCount);
    }));

    it(`should have ${titleCount} title`, () => {
        expect(fixture.nativeElement.querySelectorAll('.skltn-card .skltn-card__title').length).toEqual(titleCount);
        expect(fixture.nativeElement.querySelectorAll('.svg-root #' + maskId + ' rect').length - linesCount).toEqual(titleCount);
    });

    it(`should have ${avatarCount} title`, () => {
        expect(fixture.nativeElement.querySelectorAll('.skltn-card .skltn-card__avatar').length).toEqual(avatarCount);
        expect(fixture.nativeElement.querySelectorAll('.svg-root #' + maskId + ' ellipse').length).toEqual(avatarCount);
    });
});
