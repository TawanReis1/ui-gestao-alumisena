import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/classes/user';
import { LoginService } from '../../shared/services/login.service';
import { Router } from '@angular/router';
import { EventEmitterService } from '../../shared/helpers/event-emitter';
import { ToastrHelper } from '../../shared/helpers/toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User = new User();
  userSign: User = new User();
  loginSubmitted: Boolean = false;
  signSubmitted: Boolean = false;
  screen: string = 'login';
  auxPassword: string;
  loading: Boolean = false;

  constructor(private loginService: LoginService, private router: Router, private toastr: ToastrHelper) { }

  ngOnInit() {
  }

  async login() {
    try {
      this.loading = true;
      this.loginSubmitted = true;

      let validated = this.validateLoginFields();
      if (!validated) {
        this.toastr.showError('Preencha os campos para realizar o login', 'Erro');
        return;
      }

      const auth: any = await this.loginService.getAuthToken(this.user);

      localStorage.setItem('auth', JSON.stringify(auth.data));
      EventEmitterService.get('login').emit(true);

      this.router.navigate(['/clients']);
      this.toastr.showSuccess('Login realizado', 'Sucesso');
      this.loading = false;

    } catch (err) {
      this.loading = false;
      this.toastr.showError('Erro ao realizar o login', 'Erro');
    }
  }

  async sign() {
    try {
      this.signSubmitted = true;

      let validated = this.validateSignFields();
      if (!validated) {
        this.toastr.showError('Preencha os campos corretamente para realizar o cadastro', 'Erro');
        return;
      }

      await this.loginService.sign(this.userSign);

      this.screen = 'login';
      this.toastr.showSuccess('Cadastro realizado', 'Sucesso');

    } catch (err) {
      this.toastr.showError('Erro ao realizar o cadastro', 'Erro');
    }
  }

  validateLoginFields() {
    let success = true;

    if (!this.user.email) {
      success = false;
    }

    if (!this.user.password) {
      success = false;
    }

    return success;
  }

  validateSignFields() {
    let success = true;

    if (this.userSign.password !== this.auxPassword) {
      success = false;
    }

    if (!this.userSign.name) {
      success = false;
    }

    if (!this.userSign.document) {
      success = false;
    }

    if (!this.userSign.email) {
      success = false;
    }

    if (!this.userSign.password) {
      success = false;
    }

    return success;
  }

  changeScreen(screen) {
    this.user = new User();
    this.userSign = new User();
    this.auxPassword = ""
    // for (let uKey in this.user) {
    //   if (this.user[uKey]) {
    //     this.user = null
    //   }
    // }

    // for (let usKey in this.userSign) {
    //   if (this.user[usKey]) {
    //     this.userSign = null

    //   }
    // }

    this.screen = screen;
  }
}
