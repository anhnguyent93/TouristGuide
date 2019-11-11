import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Router} from '@angular/router';
import {Facebook} from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  FB_APP_ID = 952874475111399;

  constructor(private loadingController: LoadingController,
              private googlePlus: GooglePlus,
              private nativeStorage: NativeStorage,
              private router: Router,
              private alertController: AlertController,
              private fb: Facebook,

  ) { }

  ngOnInit() {
  }

  async doGoogleLogin() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.googlePlus.login({
      scopes: '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      webClientId: '144944872357-ggrfmgm5t4jsna0kuhtdek62a0o8s9an.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      offline: true // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    })
    .then(user => {
      loading.dismiss();

      this.nativeStorage.setItem('user', {
        name: user.displayName,
        email: user.email,
        picture: user.imageUrl,
        type: 'google',
      })
      .then(() => {
        this.router.navigate(['/tabs/home']);
      }, error => {
        console.log(error);
      })
      loading.dismiss();
    }, err => {
      console.log(err)
      loading.dismiss();
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Cordova is not available on desktop. Please try this in a real device or in an emulator.',
      buttons: ['OK']
    });

    await alert.present();
  }


  async presentLoading(loading) {
    return await loading.present();
  }

  async doFacebookbLogin() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    const permissions = ['public_profile', 'email'];

    this.fb.login(permissions)
    .then(response => {
      const userId = response.authResponse.userID;

      this.fb.api('/me?fields=name,email', permissions)
      .then(user => {
        user.picture = 'https://graph.facebook.com/' + userId + '/picture?type=large';
        this.nativeStorage.setItem('user',
          {
            name: user.name,
            email: user.email,
            picture: user.picture,
            type: 'facebook',
          })
        .then(() => {
          this.router.navigate(['/tabs/home']);
          loading.dismiss();
        }, error => {
          console.log(error);
          loading.dismiss();
        });
      });
    }, error => {
      console.log(error);
      loading.dismiss();
    });
  }

}
