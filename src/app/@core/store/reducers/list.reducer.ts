import { REDUCER_LIST } from '../reducer.constants';

export class ListReducer {
  constructor() {
  }

  static ListReducerGenero(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.Genero:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerEstadoCivil(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.EstadoCivil:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  static ListReducerTipoIdentificacion(state: Array<any> = new Array, action) {
    switch (action.type) {
      case REDUCER_LIST.TipoIdentificacion:
        return [...state, action.payload];
      default:
        return state;
    }
  }

}
