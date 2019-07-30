[![Build Status](https://travis-ci.com/Komock/ngx-skltn.svg?branch=master)](https://travis-ci.com/Komock/ngx-skltn)
[![npm version](https://badge.fury.io/js/ngx-skltn.svg)](https://badge.fury.io/js/ngx-skltn)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/ngx-skltn.svg)](https://bundlephobia.com/result?p=ngx-skltn@latest)

# ☠️ Ngx-Skltn
Easily add skeleton loader to your Angular7+ app

![](https://komock.github.io/ngx-skltn/assets/skltn-preview.gif)

Demo: [komock.github.io/ngx-skltn](https://komock.github.io/ngx-skltn)

## TLDR
[Stackblitz example](https://stackblitz.com/edit/ngx-skltn)

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
import { NgxSkltnModule, SkltnConfig } from 'ngx-skltn';
const skltnConfig: SkltnConfig = {
  rectRadius: 10,
  flareWidth: '150px',
  bgFill: '#d8d5d1',
  flareFill: 'rgba(255,255,255, 0.5)',
};

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    NgxSkltnModule.forRoot(skltnConfig),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// Defaults
// const defaultConfig = {
// rectRadius: 4,
// bgFill: '#ddd',
// flareFill: 'rgba(255, 255, 255, 0.6)',
// flareWidth: '150px',
// duration: 1200,
// delay: 0,
// timing: 'ease-in-out',
// };
```

```css
/* styles.css */
.skltn-card {
  margin: 20px 0 48px;
}
.skltn-card__avatar {
  width: 60px;
  height: 60px; /* <-- Don't forget height */
  margin-bottom: 20px;
}
.skltn-card__title {
  height: 32px;
  margin-bottom: 20px;
}
.skltn-card__line {
  height: 20px;
  margin-bottom: 20px;
}
.skltn-card__line:last-child {
  width: 60%;
}
```


```html
<!-- app.component.html -->
<skltn-root duration="1000" [rectRadius]="10" flareWidth="50%" bgFill="#d8d5d1" flareFill="rgba(255,255,255, 0.5)">
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

## Road Map
[x] Tests
[x] Travis CI
[] Check global animation
[] Add Logo
[] Check Ivy support
[] New animations
