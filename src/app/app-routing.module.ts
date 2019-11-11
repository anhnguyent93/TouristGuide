import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'welcome', loadChildren: './welcome/welcome.module#WelcomePageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'modal-map', loadChildren: './modal-map/modal-map.module#ModalMapPageModule' },
  { path: 'modal-list', loadChildren: './modal-list/modal-list.module#ModalListPageModule' },
  { path: 'place-detail', loadChildren: './place-detail/place-detail.module#PlaceDetailPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'user', loadChildren: './user/user.module#UserPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
