import { EstadoCivil } from '../data/models/informacion/estado_civil';
import { Genero } from '../data/models/informacion/genero';
import { TipoIdentificacion } from '../data/models/informacion/tipo_identificacion';
// import { TipoPublicacionLibro } from '../data/models/tipo_publicacion_libro';

export interface IAppState {
  listGenero: Genero[],
  listEstadoCivil: EstadoCivil[],
  listTipoIdentificacion: TipoIdentificacion[]
}
