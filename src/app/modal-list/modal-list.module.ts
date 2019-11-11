import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalListPage } from './modal-list.page';
import {Geolocation} from '@ionic-native/geolocation/ngx';

const routes: Routes = [
  {
    path: '',
    component: ModalListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalListPage],
  providers: [Geolocation]
})
export class ModalListPageModule {}
