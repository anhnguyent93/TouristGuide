import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {IonSlides, LoadingController, ModalController, NavParams} from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  @ViewChild('slides', {static: true}) slides: IonSlides;

  place: any;
  map: any;
  service: any;
  photos = [];

  slideOpts = {
    autoplay: true,
    loop: true,
    delay: 2000,
    initialSlide: 0,
    speed: 400
  };

  constructor(private modalController: ModalController,
              private navParams: NavParams,
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log('view enter');
    this.place = this.navParams.data.paramPlace;
    this.map = new google.maps.Map(document.createElement('div'));
    this.service = new google.maps.places.PlacesService(this.map);
    this.service.getDetails({
      placeId: this.place.place_id
    }, (result, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(result);
        this.place = result;
        for (let image of result.photos) {
          this.photos.push(image.getUrl());
        }
      }
    });
  }

  async closeModalWithoutData() {
    await this.modalController.dismiss();
  }

  round(input): number {
    return Math.round( input * 10 ) / 10;
  }
}
