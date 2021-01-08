import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';




@Component({
  selector: 'ng-uui-informacion-personal',
  templateUrl: './informacion-personal.component.html',
  styleUrls: ['./informacion-personal.component.scss']
})
export class InformacionPersonalComponent implements OnInit {

  tipoDocumento = new FormControl('');
  numDocumento = new FormControl('', [Validators.required]);
  fechaExpedicionDoc = new FormControl('date', [Validators.required]);
  maxDate = new Date();


  

  constructor() { 
  }

  ngOnInit(): void {
  }

  getErrorMessage() {
    if (this.fechaExpedicionDoc.hasError('required', )) {
      return 'Campo requerido';
    } else {
      return 'Introduzca un valor valido';
    }

    
      
  }

}
