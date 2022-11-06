import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseRequestsComponent } from './expense-requests/expense-requests.component';

const routes: Routes = [
  {
    path: '/',
    component: ExpenseRequestsComponent,
    data: {
      title: 'Expense Requests',
      breadcrumb: 'Expenses'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule { }
