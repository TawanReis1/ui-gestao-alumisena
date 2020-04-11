import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login.service';
import { EventEmitterService } from '../helpers/event-emitter';
import * as jwt_decode from "jwt-decode";
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isAuth: any;
  authInformations: any;
  userInformations: any;
  url: String;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private loginService: LoginService, private userService: UserService) {
    if (localStorage.getItem('auth')) {
      this.isAuth = true;
      this.authInformations = localStorage.getItem('auth')
      this.authInformations = JSON.parse(this.authInformations);
    }

    EventEmitterService.get('login').subscribe(() => {
      this.isAuth = true;
    });

    if (localStorage.getItem('logout')) {
      this.isAuth = false;
    }
  }

  async ngOnInit() {
    await this.getUserInformations();
    this.getCurrentUrl();
  }

  async getUserInformations() {
    if (this.authInformations) {
      let user = jwt_decode(this.authInformations.accessToken);
      this.userInformations = await this.userService.getById(user.id);
      localStorage.setItem('userInformations', JSON.stringify(this.userInformations, null, 4));
    }  
  }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  currentRoute(route) {
    this.url = route;
  }

  getCurrentUrl() {
    this.url = this.router.url;
    
    if (this.url.includes('catalogs')) {
      this.url = 'catalogs';
    } else if (this.url.includes('sales')) {
      this.url = 'sales';
    } else if (this.url.includes('reports')) {
      this.url = 'reports';
    }    
    else {
      this.url = 'clients';
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    EventEmitterService.get('logout').emit(true);
  }

}
