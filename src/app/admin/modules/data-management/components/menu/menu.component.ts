import { Component, OnInit, Inject } from '@angular/core';
import { AUTH_SERVICE, AuthService } from 'src/app/shared/interfaces/auth-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(
    @Inject(AUTH_SERVICE) readonly authService: AuthService,
  ) { }

  ngOnInit() {
  }

}
