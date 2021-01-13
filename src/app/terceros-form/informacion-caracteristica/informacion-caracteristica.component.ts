import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';


@Component({
  selector: 'ng-uui-informacion-caracteristica',
  templateUrl: './informacion-caracteristica.component.html',
  styleUrls: ['./informacion-caracteristica.component.scss']
})
export class InformacionCaracteristicaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  maxDate = new Date();
  submitStatus: boolean = false;

  formInformacionCaracteristica: FormGroup = this.formBuilder.group({
    grupoSanguineo: ['', Validators.required],
    RH: ['', Validators.required],
    grupoEtnico: ['', Validators.required],
    paisNacimiento:['', Validators.required],
    dptoNacimiento: ['', Validators.required],
    ciudadNacimiento: ['', Validators.required],
    tipoDiscapacidad: ['', Validators.required],
    EPS: ['', Validators.required],
    fechaEps: ['', Validators.required],
    numHermanos: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    puntajeSisben: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
  })

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
