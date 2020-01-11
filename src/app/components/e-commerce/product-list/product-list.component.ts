import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { productDB } from '../../../shared/data/tables/product-list';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {

  public products = []

  constructor() {
    this.products = productDB.product;
  }

  public settings = {
    columns: {
      img: {
        title: 'Image',
        type: 'html',
      },
      product_name: {
        title: 'Product_name'
      },
      product_desc: {
        title: 'Product_desc'
      },
      amount: {
        title: 'Amount'
      },
      stock: {
        title: 'Stock',
        type: 'html',
      },
      start_date: {
        title: 'Start_date'
      }
    },
  };

  ngOnInit() { }

}
