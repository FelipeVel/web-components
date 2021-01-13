import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionCaracteristicaComponent } from './informacion-caracteristica.component';

describe('InformacionCaracteristicaComponent', () => {
  let component: InformacionCaracteristicaComponent;
  let fixture: ComponentFixture<InformacionCaracteristicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformacionCaracteristicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionCaracteristicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
