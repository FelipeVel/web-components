import { IAppState } from './app.state';
import { ActionReducerMap } from '@ngrx/store';
import { ListReducer } from './reducers/list.reducer';

export const rootReducer: ActionReducerMap<IAppState> = {
  listGenero: ListReducer.ListReducerGenero,
  listEstadoCivil: ListReducer.ListReducerEstadoCivil,
  listTipoIdentificacion: ListReducer.ListReducerTipoIdentificacion,
}
