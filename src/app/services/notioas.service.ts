import { Injectable } from '@angular/core';
import { ConfiguracionService } from './configuracion.service';
import { from, interval, BehaviorSubject, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { ImplicitAutenticationService } from './implicit_autentication.service';

@Injectable({
    providedIn: 'root',
})
export class NotioasService {
    NOTIFICACION_SERVICE = '';
    TIME_PING = 30000;
    public messagesSubject: Subject<any>;

    public listMessage: any;
    private notificacion_estado_usuario: any

    private noNotifySubject = new Subject();
    public noNotify$ = this.noNotifySubject.asObservable();

    private arrayMessagesSubject = new Subject();
    public arrayMessages$ = this.arrayMessagesSubject.asObservable();

    private activo = new BehaviorSubject({});
    public activo$ = this.activo.asObservable();

    timerPing$ = interval(this.TIME_PING);
    roles: any;
    user: any;
    public menuActivo: Boolean = false;


    constructor(
        private confService: ConfiguracionService,
        private autenticacionService: ImplicitAutenticationService
    ) {
        this.listMessage = [];
        this.notificacion_estado_usuario = []
        const up$ = fromEvent(document, 'mouseup');
        up$.subscribe((data: any) => {
            if (this.activo) {
                if (((data.path
                    .map((info: any) => { return (info.localName) }))
                    .filter((data: any) => (data === 'lib-notioas'))).length === 0) {
                    this.closePanel();
                }
            }
        });

    }

    toogleMenuNotify() {
        this.menuActivo = !this.menuActivo;
        const data = { activo: this.menuActivo }
        this.activo.next(data);
        if (this.menuActivo) {
            this.changeStateNoView();
        }
    }

    closePanel() {
        this.menuActivo = false;
        this.activo.next({ activo: this.menuActivo });
    }

    init(pathNotificacion: string) {
        console.info('...Init lib notificaciones');
        this.NOTIFICACION_SERVICE = pathNotificacion;
        this.autenticacionService.user$.subscribe((res: any) => {
            if (typeof res.user !== 'undefined') {
                this.user = res.user;
                this.roles = res.role;
                this.connect();
                this.queryNotification();
            }
        })
    }

    getNotificaciones() {
        this.noNotifySubject.next((this.listMessage.filter(data => (data.Estado).toLowerCase() === 'enviada')).length)
        this.arrayMessagesSubject.next(this.listMessage);
    }

    getNotificacionEstadoUsuario(id) {
        return (this.notificacion_estado_usuario.filter(data => data.Id === id))[0];
    }

    send_ping() {
        // sending ping every 30 seconds
        this.timerPing$.subscribe(() => (this.messagesSubject.next('ping')));
    }

    connect() {

        const id_token = localStorage.getItem('id_token');
        const access_token = localStorage.getItem('access_token');
        if (id_token !== null && access_token !== null) {
            if (this.roles.length > 0) {
                // const connWs = `${this.NOTIFICACION_SERVICE}/join?id=${this.user}&profiles=${this.roles}`;
                const connWs = `${this.NOTIFICACION_SERVICE}/join?id=${access_token}`;
                this.messagesSubject = webSocket({
                    url: connWs,
                    openObserver: {
                        next: () => {
                            this.send_ping();
                        },
                    },
                });
                this.messagesSubject
                    .pipe(
                        map((msn) => {
                            this.listMessage = [...[msn], ...this.listMessage];
                            this.noNotifySubject.next((this.listMessage.filter(data => (data.Estado).toLowerCase() === 'enviada')).length);
                            this.arrayMessagesSubject.next(this.listMessage);
                            return msn
                        }),
                    )
                    .subscribe(
                        (msg: any) => { },
                        err => {
                            console.info('websocketError:', err);
                        },
                        () => console.info('complete'),
                    );
            }

        }

    }

    close() {
        this.messagesSubject.unsubscribe();
    }

    addMessage(message: any) {
        this.listMessage = [...[message], ...this.listMessage];
        this.noNotifySubject.next((this.listMessage.filter(data => (data.Estado).toLowerCase() === 'enviada')).length);
        this.arrayMessagesSubject.next(this.listMessage);
    }

    changeStateNoView() {
        if (this.listMessage.filter(data => (data.Estado).toLowerCase() === 'enviada').length >= 1) {
            this.confService.post('notificacion_estado_usuario/changeStateNoView/' + this.user, {})
                .subscribe(res => {
                    this.listMessage = [];
                    this.queryNotification();
                });
        }
    }

    changeStateToView(id, estado) {
        if (estado === 'noleida') {
            const notificacion = this.getNotificacionEstadoUsuario(id);
            this.confService.get('notificacion_estado_usuario/changeStateToView/' + notificacion.Id)
                .subscribe(res => {
                    this.listMessage = [];
                    this.queryNotification();
                });
        }
    }

    queryNotification() {
        const id_token = localStorage.getItem('id_token');
        const access_token = localStorage.getItem('access_token');
        if (id_token !== null && access_token !== null) {
            this.confService.get('notificacion_estado_usuario?query=Usuario:' + this.user + ',Activo:true&sortby=notificacion&order=asc&limit=-1')
                .subscribe((resp: any) => {
                    if (resp !== null) {
                        this.notificacion_estado_usuario = resp
                        from(resp)
                            .subscribe((notify: any) => {
                                if (typeof notify.Notificacion !== 'undefined') {
                                    const message = {
                                        Id: notify.Id,
                                        Type: notify.Notificacion.NotificacionConfiguracion.Tipo.Id,
                                        Content: JSON.parse(notify.Notificacion.CuerpoNotificacion),
                                        User: notify.Notificacion.NotificacionConfiguracion.Aplicacion.Nombre,
                                        Alias: notify.Notificacion.NotificacionConfiguracion.Aplicacion.Alias,
                                        EstiloIcono: notify.Notificacion.NotificacionConfiguracion.Aplicacion.EstiloIcono,
                                        FechaCreacion: new Date(notify.Notificacion.FechaCreacion),
                                        FechaEdicion: new Date(notify.Fecha),
                                        Estado: notify.NotificacionEstado.CodigoAbreviacion,
                                    };
                                    this.addMessage(message);
                                }
                            });
                    }

                });
        }

    }

}
