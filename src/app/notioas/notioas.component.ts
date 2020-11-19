import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NotioasService } from './../services/notioas.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ng-uui-notioas',
  templateUrl: './notioas.component.html',
  styleUrls: ['./notioas.component.css']
})
export class NotioasComponent implements OnInit {
  searchTerm$ = new Subject<string>();
  notificaciones: any;
  // tslint:disable-next-line: ban-types
  activo: Boolean = false;

  ngOnInit(): void {
    this.notificacionService.activo$
      .subscribe((isActive: any) => {
        const { activo } = isActive;
        this.activo = activo;
      });
  }
  constructor(public notificacionService: NotioasService) {
    this.notificaciones = [];
    this.notificacionService.arrayMessages$
      .subscribe((notification: any) => {
        this.notificaciones = notification;
      });
    this.searchTerm$
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        switchMap(query => this.searchEntries(query)),
      ).subscribe(response => {
        this.notificaciones = response;
      });
    this.notificacionService.getNotificaciones();
  }


  // tslint:disable-next-line: typedef
  searchEntries(term) {
    const array = [];
    array.push(this.notificacionService.listMessage.filter(
      (notify: any) => notify.Content.Message.Message.indexOf(term) !== -1 || notify.User.indexOf(term) !== -1));
    return array;
  }

  // tslint:disable-next-line: typedef
  redirect(noti) {
    this.notificacionService.changeStateToView(noti.Id, noti.Estado);
    window.open(noti.Content.Message.Link, '_blank');

    // if (noti.Content.Message.Link.indexOf(path_sub) === -1) {
    //   window.open(noti.Content.Message.Link, '_blank');
    // } else {
    //   this.router.navigate([noti.Content.Message.Link.substring(noti.Content.Message.Link.indexOf('#') + 1)]);
    // }
  }
}
