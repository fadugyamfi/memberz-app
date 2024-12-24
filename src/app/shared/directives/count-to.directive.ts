import { Directive, OnChanges, ElementRef, OnInit, input, model } from '@angular/core';

@Directive({
    selector: '[CountTo]',
    standalone: true
})
export class CountToDirective implements OnChanges, OnInit {
  readonly CountTo = input<number>(0);
  readonly from = input(0);
  readonly duration = model(4);

  e: any;
  num: number;
  refreshInterval = 30;
  steps: number;
  step = 0;
  increment: number;

  constructor(private el: ElementRef) {
    this.e = this.el.nativeElement;
    
  }

  ngOnInit() {

  }

  ngOnChanges() {
    if (!isNaN(this.CountTo())) {
      this.start();
    }
  }

  calculate() {
    this.duration.update(value => value * 1000);

    this.steps = Math.ceil(this.duration() / this.refreshInterval);
    this.increment = ((this.CountTo() - this.from()) / this.steps);
    this.num = this.from();
  }

  tick() {
    setTimeout(() => {
      this.num += this.increment;
      this.step++;
      if (this.step >= this.steps) {
        this.num = this.CountTo();
        this.e.textContent = Math.round(this.CountTo())?.toLocaleString();
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
