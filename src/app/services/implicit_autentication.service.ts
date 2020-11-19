
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class ImplicitAutenticationService {

    environment: any;
    logoutUrl: any;
    params: any;
    payload: any;
    private user: any;

    private userSubject = new BehaviorSubject({});
    public user$ = this.userSubject.asObservable();

    httpOptions: { headers: HttpHeaders; };

    init(entorno): any {
        this.environment = entorno;
        const id_token = window.localStorage.getItem('id_token');
        if (window.localStorage.getItem('id_token') === null) {
            var params = {},
                queryString = location.hash.substring(1),
                regex = /([^&=]+)=([^&]*)/g;
            let m;
            while (m = regex.exec(queryString)) {

                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }
            // And send the token over to the server
            const req = new XMLHttpRequest();
            // consider using POST so query isn't logged
            const query = 'https://' + window.location.host + '?' + queryString;
            req.open('GET', query, true);
            if (params['id_token'] !== null && params['id_token'] !== undefined) {
                //if token setear
                const id_token_array = (params['id_token']).split('.')
                const payload = JSON.parse(atob(id_token_array[1]));
                window.localStorage.setItem('access_token', params['access_token']);
                window.localStorage.setItem('expires_in', params['expires_in']);
                window.localStorage.setItem('state', params['state']);
                window.localStorage.setItem('id_token', params['id_token']);

                if (typeof payload.role === 'undefined') {

                    this.httpOptions = {
                        headers: new HttpHeaders({
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${params['access_token']}`,
                        }),
                    }
                    console.log(this.httpOptions);
                    this.user = { user: (payload.email.split('@'))[0] };
                    this.httpClient.post<any>(this.environment.AUTENTICACION_MID, {
                        user: (payload.email.split('@'))[0]
                    }, this.httpOptions)
                        .subscribe((res: any) => {
                            this.user = { ...this.user, ...res };
                            console.log(this.user);
                            this.userSubject.next(this.user);
                        });
                }
            } else {
                this.clearStorage();
            }
            req.onreadystatechange = function (e) {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        // window.location = params.state;
                    } else if (req.status === 400) {
                        window.alert('There was an error processing the token.');
                    } else {

                    }
                }
            };
        } else {
            const id_token = window.localStorage.getItem('id_token').split('.');
            const payload = JSON.parse(atob(id_token[1]));
            this.httpOptions = {
                headers: new HttpHeaders({
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                }),
            }
            this.user = { user: (payload.email.split('@'))[0] };
            this.httpClient.post<any>(this.environment.AUTENTICACION_MID, {
                user: (payload.email.split('@'))[0]
            }, this.httpOptions)
                .subscribe((res: any) => {
                    this.user = { ...this.user, ...res }
                    console.info(this.user);

                    this.userSubject.next(this.user);
                })
        }
        this.setExpiresAt();
        this.timer();
        this.clearUrl();
    }


    constructor(private httpClient: HttpClient) {

    }

    public logout() {
        this.logoutUrl = this.environment.SIGN_OUT_URL;
        this.logoutUrl += '?id_token_hint=' + window.localStorage.getItem('id_token');
        this.logoutUrl += '&post_logout_redirect_uri=' + this.environment.SIGN_OUT_REDIRECT_URL;
        this.logoutUrl += '&state=' + window.localStorage.getItem('state');
        this.clearStorage();
        window.location.replace(this.logoutUrl);
    }

    public getPayload() {
        const id_token = window.localStorage.getItem('id_token').split('.');
        const payload = JSON.parse(atob(id_token[1]))
        return payload;
    }


    public logoutValid() {
        var state;
        var valid = true;
        var queryString = location.search.substring(1);
        var regex = /([^&=]+)=([^&]*)/g;
        var m;
        while (!!(m = regex.exec(queryString))) {
            state = decodeURIComponent(m[2]);
        }
        if (window.localStorage.getItem('state') === state) {
            this.clearStorage();
            valid = true;
        } else {
            valid = false;
        }
        return valid;
    }

    // el flag es un booleano que define si abra boton de login
    public login(flag) {
        if (window.localStorage.getItem('id_token') === 'undefined' || window.localStorage.getItem('id_token') === null || this.logoutValid()) {
            if (!flag) {
                this.getAuthorizationUrl()
            }
            return false
        } else {
            return true
        }
    }
    public live() {
        if (this.login(true)) {
            return true;
        } else {
            return false;
        }

    }


    public clearUrl() {
        const clean_uri = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, clean_uri);
    }




    public getAuthorizationUrl() {
        this.params = this.environment;
        if (!this.params.nonce) {
            this.params.nonce = this.generateState();
        }
        if (!this.params.state) {
            this.params.state = this.generateState();
        }
        let url = this.params.AUTORIZATION_URL + '?' +
            'client_id=' + encodeURIComponent(this.params.CLIENTE_ID) + '&' +
            'redirect_uri=' + encodeURIComponent(this.params.REDIRECT_URL) + '&' + // + window.location.href + '&' para redirect con regex
            'response_type=' + encodeURIComponent(this.params.RESPONSE_TYPE) + '&' +
            'scope=' + encodeURIComponent(this.params.SCOPE) + '&' +
            'state_url=' + encodeURIComponent(window.location.hash);
        if (this.params.nonce) {
            url += '&nonce=' + encodeURIComponent(this.params.nonce);
        }
        url += '&state=' + encodeURIComponent(this.params.state);
        window.location.replace(url);
        return url;
    }

    public generateState() {
        const text = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
        return Md5.hashStr(text);
    }

    public setExpiresAt() {
        if (window.localStorage.getItem('expires_at') === null || window.localStorage.getItem('expires_at') === undefined || window.localStorage.getItem('expires_at') === 'Invalid Date') {
            const expires_at = new Date();
            expires_at.setSeconds(expires_at.getSeconds() + parseInt(window.localStorage.getItem('expires_in'), 10) - 60);
            window.localStorage.setItem('expires_at', expires_at.toUTCString());
        }
    }

    public expired() {
        return (new Date(window.localStorage.getItem('expires_at')) < new Date());
    }

    public timer() {

        setInterval(() => {
            if (window.localStorage.getItem('expires_at') !== null) {
                if (this.expired()) {
                    this.logout();
                    this.clearStorage();
                }
            } else {
                window.location.reload();
            }
        }, 5000)
    }

    public clearStorage() {
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('id_token');
        window.localStorage.removeItem('expires_in');
        window.localStorage.removeItem('state');
        window.localStorage.removeItem('expires_at');

    }
}
