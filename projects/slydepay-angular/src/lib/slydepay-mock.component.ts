import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lib-slydepay',
  templateUrl: './slydepay-mock.component.html',
  styles: []
})
export class SlydepayMockComponent implements OnInit {

  public callbackURL = '';
  public payToken = '';
  public custRef = '';

  constructor(
    public router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.callbackURL = params.callback;
      this.payToken = params.payToken;
      this.custRef = params.custRef;
    });
  }

  completeTransaction() {
    const urlParams = new URLSearchParams({
      status: '0',
      pay_token: this.payToken,
      cust_ref: this.custRef,
      transac_id: '123-123-123-' + (Math.random() * 10000)
    });

    window.location.href = `${this.callbackURL}?${urlParams}`;
  }

  cancelTransaction() {
    const urlParams = new URLSearchParams({
      status: '-2',
      pay_token: this.payToken,
      cust_ref: this.custRef,
      transac_id: '123-123-123-' + (Math.random() * 10000)
    });

    window.location.href = `${this.callbackURL}?${urlParams}`;
  }

  errorTransaction() {
    const urlParams = new URLSearchParams({
      status: '-1',
      pay_token: this.payToken,
      cust_ref: this.custRef,
      transac_id: '123-123-123-' + (Math.random() * 10000)
    });

    window.location.href = `${this.callbackURL}?${urlParams}`;
  }
}
