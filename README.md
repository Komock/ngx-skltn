# ☠️ Ngx-Skltn
Easily add skeleton loader to your Angular7+ app
Example: [komock.github.io/ngx-skltn](https://komock.github.io/ngx-skltn)

## Features
1. Flexible SVG skeleton based on size & position of HTML elements
2. Single animation for all shapes
3. Allow use custom shapes as nested SVG element (example below)

## Install
Npm

```sh
npm i --save-dev ngx-skltn
```

## Usage
```ts
// app.module.ts
import { NgxSkltnModule } from 'ngx-skltn';
@NgModule({
	declarations: [ AppComponent ],
	imports: [
		BrowserModule,
		NgxSkltnModule,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
```

```html
<!-- app.component.html -->
<skltn-root duration="1" [rectRadius]="10" flareWidth="50%" bgFill="#d8d5d1" flareFill="rgba(255,255,255, 0.5)">
  <!-- Card with Avatar -->
  <div class="skltn-card">
    <div skltn-bone class="skltn-card__avatar" type="circle"></div>
    <div class="skltn-card__body">
      <div skltn-bone class="skltn-card__title"></div>
      <div skltn-bone class="skltn-card__line"></div>
      <div skltn-bone class="skltn-card__line"></div>
    </div>
  </div>
</skltn-root>
```

## Custom Shape
Important! `[pathWidth]="24" [pathHeight]="22"` should be same as on `<svg>` tag, this allow stratch shape with aspect ratio
```html
<!-- app.component.html -->
<h3>Custom Path Template</h3>
<div class="skltn-chart" skltn-bone type="path" [pathWidth]="24" [pathHeight]="22">
    <ng-template #boneTemp>
        <svg width="24" height="22">
            <path d="M0 5.783v-2.783l4 4 5-6 9 7.878 6-3.922v2.437l-6.176 3.989-8.6-7.528-5.09 6.108-4.134-4.179zm18.909 7.279l-1.267.818-1.135-.994-7.058-6.177-3.778 4.534-1.41 1.692-1.548-1.566-2.713-2.743v14.374h24v-13.226l-5.091 3.288z"></path>
        </svg>
    </ng-template>
</div>
```
