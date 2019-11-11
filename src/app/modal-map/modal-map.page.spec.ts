import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMapPage } from './modal-map.page';

describe('ModalMapPage', () => {
  let component: ModalMapPage;
  let fixture: ComponentFixture<ModalMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
