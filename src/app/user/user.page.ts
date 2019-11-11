import { Component, OnInit } from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {Facebook} from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  user: any;
  userReady = false;
  type: any;

  constructor(
    private googlePlus: GooglePlus,
    private nativeStorage: NativeStorage,
    public loadingController: LoadingController,
    private router: Router,
    private fb: Facebook,
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();
    this.nativeStorage.getItem('user')
    .then(data => {
      this.user = {
        name: data.name,
        email: data.email,
        picture: data.picture,
      };
      this.userReady = true;
      this.type = data.type;
      loading.dismiss();
    }, error => {
      console.log(error);
      loading.dismiss();
    });
  }

  doLogout() {
    if (this.type === 'facebook') {
      this.fb.logout()
      .then(res => {
        this.nativeStorage.remove('user');
        this.router.navigate(['/login']);
      }, error => {
        console.log(error);
      });
    } else {
      this.googlePlus.logout()
      .then(res => {
        this.nativeStorage.remove('user');
        this.router.navigate(['/login']);
      }, err => {
        console.log(err);
      });
    }
  }

}
