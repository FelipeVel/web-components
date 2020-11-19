import { Component, OnInit } from '@angular/core';
import { MenuAplicacionesService } from '../services/menuAplicaciones.service';
import { NotioasService } from '../services/notioas.service';


@Component({
  selector: 'ng-uui-menu-aplicaciones',
  templateUrl: './menu-aplicaciones.component.html',
  styleUrls: ['./menu-aplicaciones.component.css']
})
export class MenuAplicacionesComponent implements OnInit {

  activo: any;
  constructor( public menuService: MenuAplicacionesService, public notioasService: NotioasService) {

  }

  // tslint:disable-next-line: typedef
  redirect(link) {
    window.open(link, '_blank');
    // if (link.indexOf(path_sub) === -1) {
    //   window.open(link, '_blank');
    // } else {
    //   this.router.navigate([link.substring(link.indexOf('#') + 1)]);
    // }
  }



  ngOnInit(): void {
    this.menuService.activo$
    .subscribe((isActive: any) => {
      const { activo } = isActive;
      this.activo = activo;
    });
  }


}
