import { Component, OnInit } from '@angular/core';
import { UsersService } from '@itns/users';

@Component({
  selector: 'ngshop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ngshop';

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.userService.initAppSession()
  }
}
