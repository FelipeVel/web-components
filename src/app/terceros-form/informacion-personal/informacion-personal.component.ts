import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';




@Component({
  selector: 'ng-uui-informacion-personal',
  templateUrl: './informacion-personal.component.html',
  styleUrls: ['./informacion-personal.component.scss']
})
export class InformacionPersonalComponent implements OnInit {
  
  constructor(private formBuilder: FormBuilder) {   }


  maxDate = new Date();
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
  
  ngOnInit(): void {
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
