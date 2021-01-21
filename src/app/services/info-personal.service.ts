import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfiguracionService } from './configuracion.service';
import { INFO_PERSONAL_ENDPOINTS } from './info-personal-endpoints.constants';

@Injectable({
    providedIn: 'root',
})
export class InfoPersonalService {

    private infoPersonalSubject = new BehaviorSubject({});
    public infoPersonal$ = this.infoPersonalSubject.asObservable();

    constructor(
        private configuracionService: ConfiguracionService,
    ){}

    getGenero() /*: any[]*/ {
        const generosInfo = localStorage.getItem('generos');
        if (generosInfo) {
            //return JSON.parse(atob(generosInfo));
            this.infoPersonalSubject.next(JSON.parse(atob(generosInfo)));
            this.infoPersonalSubject.getValue();
        }else{
            this.configuracionService.setPath(environment.TERCEROS_SERVICE);
            this.configuracionService.get('info_complementaria/?query=GrupoInfoComplementariaId.Id:6&fields=Id,Nombre')
            .subscribe(
                (result: any[]) => {
                    localStorage.setItem('generos', btoa(JSON.stringify(result)));
                    //return result; 
                    this.infoPersonalSubject.next(result);
                }
            ); 
        }
    }

    getInfoPersonal(){
        let infoPersonalArray = {};
        const infoPersonalCoded = localStorage.getItem('infoPersonal');
        if (infoPersonalCoded) {
            this.infoPersonalSubject.next(JSON.parse(atob(infoPersonalCoded)));
        }else{
            this.configuracionService.setPath(environment.TERCEROS_SERVICE);
            for (let campo in INFO_PERSONAL_ENDPOINTS){

                this.configuracionService.get(INFO_PERSONAL_ENDPOINTS[campo])
                .subscribe(
                    (result: any[]) => {
                        infoPersonalArray[campo] =  result;
                        localStorage.setItem('infoPersonal', btoa(JSON.stringify(infoPersonalArray)));
                        this.infoPersonalSubject.next(infoPersonalArray);
                    }
                ); 
            }
        }
    }

    getEstadoCivil() /*: any[]*/ {
        const estadosCivilesInfo = localStorage.getItem('estadosCiviles');
        if (estadosCivilesInfo) {
            //return JSON.parse(atob(estadosCivilesInfo));
            this.infoPersonalSubject.next(JSON.parse(atob(estadosCivilesInfo)));
        }else{
            this.configuracionService.setPath(environment.TERCEROS_SERVICE);
            this.configuracionService.get('info_complementaria/?query=GrupoInfoComplementariaId.Id:2&fields=Id,Nombre')
            .subscribe(
                (result: any[]) => {
                    localStorage.setItem('estadosCiviles', btoa(JSON.stringify(result)));
                    //return result; 
                    this.infoPersonalSubject.next(result);
                }
            ); 
        }
    }

}