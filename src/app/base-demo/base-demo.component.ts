import { Component } from '@angular/core';

@Component({
  selector: 'app-base-demo',
  templateUrl: './base-demo.component.html',
  styleUrls: ['./base-demo.component.scss']
})
export class BaseDemoComponent {
  additionalSections = [];

  addSection() {
    this.additionalSections.push(1);
  }
}
