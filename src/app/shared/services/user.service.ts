import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class UserService {
  url: string;
  authInformations: any;

  constructor(private http: HttpClient) {
    this.url = environment.gestaoAlumisenaApi;
    this.authInformations = localStorage.getItem('auth');
    this.authInformations = JSON.parse(this.authInformations);
  }

  async get(query) {
    let params = new HttpParams();
    Object.keys(query).forEach(param => {
      params = params.append(param, query[param]);
    });

    return this.http.get(`${this.url}/user`, {
      headers: new HttpHeaders({
        "x-access-token": this.authInformations.accessToken
      }),
      params
    }).toPromise()
      .catch((err: HttpErrorResponse) => Promise.reject(err));
  }


  async getById(id) {
    return this.http.get(`${this.url}/user/${id}`, {
      headers: new HttpHeaders({
        "x-access-token": this.authInformations.accessToken
      })
    }).toPromise()
      .catch((err: HttpErrorResponse) => Promise.reject(err));
  }
}
