import { Injectable } from '@angular/core';
import { ConfiguracionService } from './configuracion.service';
import { ImplicitAutenticationService } from './implicit_autentication.service'
import { BehaviorSubject, fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class MenuAplicacionesService {
    private dataFilterSubject = new BehaviorSubject([]);
    public eventFilter$ = this.dataFilterSubject.asObservable();

    private activo = new BehaviorSubject({});
    public activo$ = this.activo.asObservable();

    categorias: any;
    isLogin = false;
    roles: any;
    userInfo: any;
    public menuActivo: Boolean = false;

    constructor(
        private configuracionService: ConfiguracionService,
        private implicitAutenticationService: ImplicitAutenticationService
    ) {
        this.implicitAutenticationService.user$.subscribe((res: any) => {
            if (JSON.stringify(res) !== '{}') {
                this.userInfo = res;
                if (typeof this.userInfo.user.role !== 'undefined') {
                    const roles = [...res.user.role];
                    this.isLogin = true;
                    this.roles = roles.map((element) => ({ Nombre: element }));
                    this.getAplication();
                }
            }
        });
        fromEvent(document, 'mouseup').subscribe((data: any) => {
            if (this.activo) {
                console.log(data)
                if(data.path){
                    if ((
                        data.path
                        .map((info: any) => (info.localName))
                        .filter((dataFilter: any) => (dataFilter === 'ng-uui-menu-aplicaciones'))).length === 0 ) {
                            this.closePanel();
                    }
                }
            }
        });
    }

    closePanel(): void {
        this.menuActivo = false;
        this.activo.next({ activo: this.menuActivo });
    }

    toogleMenuNotify(): void {
        this.menuActivo = !this.menuActivo;
        const data = { activo: this.menuActivo };
        this.activo.next(data);
    }

    init(categorias: any): void {
        console.log('...Init lib menu', categorias);
        this.categorias = categorias;
        this.dataFilterSubject.next(this.categorias);
    }

    public getAplication(): any {
        const idToken = localStorage.getItem('id_token');
        const accessToken = localStorage.getItem('access_token');
        if (idToken !== null && accessToken !== null) {
            this.configuracionService.post('aplicacion_rol/aplicacion_rol', this.roles)
                .subscribe((data: any) => {
                    let nuevasAplicaciones = this.categorias.map((categoria: any) => {
                        categoria.aplicaciones = categoria.aplicaciones.filter((aplicacion: any) => (this.existe(aplicacion.nombre, data)));
                        categoria.aplicaciones = categoria.aplicaciones.map((app: any) => {
                            return { ...app, ...{ estilo_logo: app.estilo.split('-')[0] } };
                        });
                        return categoria;
                    });
                    nuevasAplicaciones = nuevasAplicaciones.filter((categoria) => (categoria.aplicaciones.length > 0));
                    this.dataFilterSubject.next(nuevasAplicaciones);
                });
            return this.eventFilter$;
        }
    }

    existe(nombre: string, array: any): boolean {
        const filtro = array.filter((data: any) => (nombre.toLowerCase() === data.Nombre.toLowerCase()));
        return filtro.length > 0;
    }

}
