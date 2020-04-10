import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url: string;
  isAuthenticated = new EventEmitter<Boolean>();

  constructor(private http: HttpClient) {
    this.url = environment.flierApi;
  }

  async getAuthToken(user) {
    const basic = btoa(`Basic ${user.email}:${user.password}`);
    return this.http.post(`${this.url}/login`, {}, {
      headers: new HttpHeaders({
        Authorization: basic
      })
    }).toPromise()
      .then((res) => {
        this.isAuthenticated.emit(true)
        return res
      })
      .catch((err: HttpErrorResponse) => Promise.reject(err));
  }

  async sign(user) {
    const body = {
      name: user.name,
      document: user.document,
      email: user.email,
      password: user.password
    };

    return this.http.post(`${this.url}/sign-up`, body)
      .toPromise()
      .catch((err: HttpErrorResponse) => Promise.reject(err));
  }
}
