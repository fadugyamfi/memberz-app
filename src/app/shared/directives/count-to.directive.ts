import { Directive, OnChanges, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[CountTo]',
    standalone: true
})
export class CountToDirective implements OnChanges, OnInit {
  @Input()
  CountTo: number;
  @Input()
  from = 0;
  @Input()
  duration = 4;

  e = this.el.nativeElement;
  num: number;
  refreshInterval = 30;
  steps: number;
  step = 0;
  increment: number;

  constructor(private el: ElementRef) {

  }

  ngOnInit() {

  }

  ngOnChanges() {
    if (!isNaN(this.CountTo)) {
      this.start();
    }
  }

  calculate() {
    this.duration = this.duration * 1000;

    this.steps = Math.ceil(this.duration / this.refreshInterval);
    this.increment = ((this.CountTo - this.from) / this.steps);
    this.num = this.from;
  }

  tick() {
    setTimeout(() => {
      this.num += this.increment;
      this.step++;
      if (this.step >= this.steps) {
        this.num = this.CountTo;
        this.e.textContent = Math.round(this.CountTo)?.toLocaleString();
      } else {
        this.e.textContent = Math.round(this.num)?.toLocaleString();
        this.tick();
      }
    }, this.refreshInterval);
  }

  start() {
    this.calculate();
    this.tick();
  }
}
