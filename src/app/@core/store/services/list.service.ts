import { Injectable } from '@angular/core';
import { IAppState } from '../app.state';
import { Store } from '@ngrx/store';
import { REDUCER_LIST } from '../reducer.constants';
import { TercerosService } from '../../data/services/terceros.service';

@Injectable()
export class ListService {

  constructor(
    private tercerosService: TercerosService,
    private store: Store<IAppState>) {
  }

  public findGenero() {
    this.store.select(REDUCER_LIST.Genero).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria/?query=GrupoInfoComplementariaId.Id:6')
            .subscribe(
              (result: any[]) => {
                result.forEach(subResult => {
                  this.addList(REDUCER_LIST.Genero, subResult);
                });   
              },
              error => {
                this.addList(REDUCER_LIST.Genero, []);
              },
            );
        }
      },
    );
  }

  public findEstadoCivil() {
    this.store.select(REDUCER_LIST.EstadoCivil).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria/?query=GrupoInfoComplementariaId.Id:2')
            .subscribe(
              (result: any[]) => {
                result.forEach(subResult => {
                  this.addList(REDUCER_LIST.EstadoCivil, subResult);
                });
              },
              error => {
                this.addList(REDUCER_LIST.EstadoCivil, []);
              },
            );
        }
      },
    );
  }

  public findTipoIdentificacion() {
    this.store.select(REDUCER_LIST.TipoIdentificacion).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('tipo_documento/?query=Activo:true&limit=0')
            .subscribe(
              (result: any[]) => {
                result.forEach(subResult => {
                  this.addList(REDUCER_LIST.TipoIdentificacion, subResult);
                });
              },
              error => {
                this.addList(REDUCER_LIST.TipoIdentificacion, []);
              },
            );
        }
      },
    );
  }

  private addList(type: string, object: Array<any>) {
    this.store.dispatch({
      type: type,
      payload: object,
    });
  }
}
