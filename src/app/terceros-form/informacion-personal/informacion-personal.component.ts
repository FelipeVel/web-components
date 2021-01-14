import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { IAppState } from '../../@core/store/app.state';
import { Store } from '@ngrx/store';
import { ListService } from '../../@core/store/services/list.service';


@Component({
  selector: 'ng-uui-informacion-personal',
  templateUrl: './informacion-personal.component.html',
  styleUrls: ['./informacion-personal.component.scss']
})
export class InformacionPersonalComponent implements OnInit {
  
  listaGenero: string[];
  listaTipoIdentificacion: string[]; 
  listaEstadoCivil: string[]; 
  maxDate : Date; 
  submitStatus: boolean = false;
  formInformacionPersonal: FormGroup = this.formBuilder.group({
    tipoDocumento: ['', Validators.required],
    numDocumento: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    fechaExpedicionDoc: ['', Validators.required],
    pNombre: ['', Validators.required],
    sNombre: [''],
    pApellido: ['', Validators.required],
    sApellido: [''],
    estadoCivil: ['', Validators.required],
    genero: ['', Validators.required],
    fechaNacimiento: ['', Validators.required]
  });
  
  constructor(private formBuilder: FormBuilder, private listService: ListService, private store: Store<IAppState>) {
    this.listService.findGenero();
    this.listService.findEstadoCivil();
    this.listService.findTipoIdentificacion()
    this.listaGenero = [];
    this.listaTipoIdentificacion = [];
    this.listaEstadoCivil = [];
    this.maxDate = new Date();
    this.loadLists();
  }

  ngOnInit(): void {
  }

  generarListado(listaObjetos: any[]) : string[]{
    let listaStrings: string[] = [];
    listaObjetos.forEach(objeto => {
      listaStrings.push(objeto.Nombre);
    });
    return listaStrings;
  }

  public loadLists() {
    this.store.select((state) => state).subscribe(
      (list) => {
        this.listaGenero = this.generarListado(list.listGenero);
        console.log(list.listGenero);
        console.log(this.listaGenero);
        this.listaEstadoCivil = this.generarListado(list.listEstadoCivil);
        console.log(list.listEstadoCivil);
        console.log(this.listaEstadoCivil);
        this.listaTipoIdentificacion = this.generarListado(list.listTipoIdentificacion);
        console.log(list.listTipoIdentificacion);
        console.log(this.listaTipoIdentificacion);
      },
    );
  }

  getErrorMessage(campo: FormControl) {
    if (campo.hasError('required', )) {
      return 'Campo requerido';
    } else {
      return 'Introduzca un valor valido';
    }
  }

  onSubmit() {
    this.submitStatus = true;    
  }

}
