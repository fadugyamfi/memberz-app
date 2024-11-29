import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-unlock-user',
    templateUrl: './unlock-user.component.html',
    styleUrls: ['./unlock-user.component.scss'],
    standalone: true,
    imports: [FormsModule]
})
export class UnlockUserComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
