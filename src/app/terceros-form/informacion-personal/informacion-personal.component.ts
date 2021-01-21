import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { InfoPersonalService } from 'src/app/services/info-personal.service';


@Component({
  selector: 'ng-uui-informacion-personal',
  templateUrl: './informacion-personal.component.html',
  styleUrls: ['./informacion-personal.component.scss']
})
export class InformacionPersonalComponent implements OnInit {
  
  listaGenero: any[];
  listaTipoIdentificacion: any[]; 
  listaEstadoCivil: any[]; 
  maxDate : Date; 
  submitStatus: boolean = false;
  formInformacionPersonal: FormGroup = this.formBuilder.group({
    tipoDocumento: ['', Validators.required],
    numDocumento: ['', [Validators.required, Validators.pattern("^[0-9]*$")]], //ajustar validación para campos como pasaporte
    fechaExpedicionDoc: ['', Validators.required],
    pNombre: ['', Validators.required],
    sNombre: [''],
    pApellido: ['', Validators.required],
    sApellido: [''],
    estadoCivil: ['', Validators.required],
    genero: ['', Validators.required],
    fechaNacimiento: ['', Validators.required]
  });
  
  constructor(private infoPersonalService: InfoPersonalService, private formBuilder: FormBuilder) {
    this.listaGenero = [];
    this.listaTipoIdentificacion = [];
    this.listaEstadoCivil = [];
    this.maxDate = new Date();
    this.loadLists();
  }

  ngOnInit(): void {
    
  }

  public loadLists() {
    this.infoPersonalService.getInfoPersonal();
    
    this.infoPersonalService.infoPersonal$.subscribe((data: any) => {
      console.log("Lista de objetos infoPersonal");
      console.log(data);
      this.listaTipoIdentificacion = data.listTipoDocumento;
      this.listaGenero = data.listGenero;
      this.listaEstadoCivil = data.listEstadoCivil;
    })
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
//Se usó rxjs para la carga de los campos select