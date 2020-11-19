import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {
  httpOptions: { headers: HttpHeaders; };
  path: any;

  constructor(private http: HttpClient) {
  }

  setPath(path) {
    this.path = path;
  }

  get(endpoint) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      }),
    }
    return this.http.get<any>(`${this.path}${endpoint}`, this.httpOptions).pipe(
      map(
        (res) => {
          if (res.hasOwnProperty('Body')) {
            return res['Body'];
          } else {
            return res;
          }
        },
      ));
  }

  /**
   * Perform a POST http request
   * @param endpoint service's end-point
   * @param element data to send as JSON
   * @returns Observable<any>
   */
  post(endpoint, element) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      }),
    }
    return this.http.post<any>(`${this.path}${endpoint}`, element, this.httpOptions);
  }

  /**
   * Perform a PUT http request
   * @param endpoint service's end-point
   * @param element data to send as JSON, With the id to UPDATE
   * @returns Observable<any>
   */
  put(endpoint, element) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      }),
    }
    return this.http.put<any>(`${this.path}${endpoint}/${element.Id}`, element, this.httpOptions);
  }

  /**
   * Perform a DELETE http request
   * @param endpoint service's end-point
   * @param id element's id for remove
   * @returns Observable<any>
   */
  delete(endpoint, id) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      }),
    }
    return this.http.delete<any>(`${this.path}${endpoint}/${id}`, this.httpOptions);
  }
}
