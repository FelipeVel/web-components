import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InformacionPersonalComponent } from './informacion-personal/informacion-personal.component';
@Component({
  selector: 'ng-uui-terceros-form',
  templateUrl: './terceros-form.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./terceros-form.component.scss']
})
export class TercerosFormComponent implements OnInit {

  isLinear = false;
  constructor() { }

  @ViewChild('InformacionPersonalComponent') informacionPersonalComponent: InformacionPersonalComponent;

  ngOnInit(): void {
  }


  
 formGroup2 = new FormGroup({
  hola: new FormControl('')
});



}
