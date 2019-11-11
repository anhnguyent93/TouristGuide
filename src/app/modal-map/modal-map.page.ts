import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IonSlides, LoadingController, ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import {ModalListPage} from '../modal-list/modal-list.page';
import {PlaceDetailPage} from '../place-detail/place-detail.page';

declare var google;

@Component({
  selector: 'app-modal-map',
  templateUrl: './modal-map.page.html',
  styleUrls: ['./modal-map.page.scss'],
})
export class ModalMapPage implements AfterViewInit, OnInit {

  @ViewChild('mapElement', {static: false}) mapNativeElement: ElementRef;
  @ViewChild('autoCompleteInput', {static: false}) inputNativeElement: any;
  @ViewChild('slides', {static: false}) slides: IonSlides;

  directionForm: FormGroup;
  marker: any;
  map: any;
  markers = [];
  places = [];
  place: any;
  type: any;
  icon: any;

  constructor(private fb: FormBuilder,
              private loadingCtrl: LoadingController,
              private geolocation: Geolocation,
              private modalController: ModalController,
              private navParams: NavParams,
              private storage: Storage,
  ) {
    this.createDirectionForm();
  }

  createDirectionForm() {
    this.directionForm = this.fb.group({
      placeName: [],
    });
  }

  ngOnInit() {
    this.type = this.navParams.data.paramType;
    this.places = this.navParams.data.paramPlaces;
    this.place = this.navParams.data.paramPlace;
    this.inputNativeElement.nativeElement.value = this.navParams.data.paramString;

    this.icon = {
      url: this.type.marker,
    };
  }

  ngAfterViewInit(): void {
    this.loadMap();
  }

  async closeModalWithData() {
    const data = {
      place: this.place,
      string: this.inputNativeElement.nativeElement.value,
      places: this.places,
    };
    await this.modalController.dismiss(data);
  }

  goToSlide(index) {
    this.slides.slideTo(index, 1000);
  }

  async loadMap() {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 11,
      disableDefaultUI: true,
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      loading.dismiss();
    });

    this.map.setCenter(this.place.geometry.location);

    if (this.markers.length !== 0) {
      this.setMapOnAll(this.markers, null);
      this.markers.splice(0, this.markers.length);
    }
    this.callback(this.places, google.maps.places.PlacesServiceStatus.OK);

    this.slides.getActiveIndex().then(index => {
      this.markers[index].setIcon();
    });

    this.inputNativeElement.nativeElement.value = this.place.formatted_address;
    const autocomplete = new google.maps.places.Autocomplete(this.inputNativeElement.nativeElement, {types: ['(cities)']});
    autocomplete.addListener('place_changed', () => {
      this.places = [];
      this.place = autocomplete.getPlace();
      console.log(this.place);
      if (!this.place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert('No details available for input: ' + this.place.name );
        return;
      }
      if (this.place.geometry.viewport) {
        this.map.fitBounds(this.place.geometry.viewport);
      } else {
        this.map.setCenter(this.place.geometry.location);
        this.map.setZoom(11);
      }

      const service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch({
        location: this.place.geometry.location,
        radius: 20000,
        type: this.type.type,
      }, (results, status) => {
        console.log(results);
        this.places = results;

        if (this.markers.length !== 0) {
          this.setMapOnAll(this.markers, null);
          this.markers.splice(0, this.markers.length);
        }
        this.callback(results, status);

        this.markers[0].setIcon();
      });
    });
  }

  callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let item of results) {
        this.createMarker(item);
      }
    }
  }

  setMapOnAll(markers, map) {
    for (let marker of markers) {
      marker.setMap(map);
    }
  }

  createMarker(place) {
    const marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location,
      icon: this.type.marker,
    });

    let infowindow = new google.maps.InfoWindow();

    const contentString =
      '<div class="row" style="display: flex; flex-wrap: wrap; padding: 0 4px;">' +
      '<div class="column" style="flex: 50%; padding: 0 4px;">' +
      // '<img src="' + place.photos[0].getUrl({maxWidth: 90, maxHeight: 90}) + '"/>' +
      '</div>' +
      '<div class="column" style="flex: 50%; padding: 0 4px;">' +
      '<p>' + place.name +
      '</p>' +
      '</div>' +
      '</div>';

    this.markers.push(marker);

    google.maps.event.addListener(marker, 'click', () => {
      this.resetIcon(this.markers);
      marker.setIcon();
      this.goToSlide(this.markers.indexOf(marker));
    });
  }

  resetIcon(markers) {
    for (let item of markers) {
      item.setIcon(this.type.marker);
    }
  }

  slideChanged() {
    this.resetIcon(this.markers);
    this.slides.getActiveIndex().then(index => {
      this.markers[index].setIcon();
    });
  }

  async openDetailModal(place) {
    const modal = await this.modalController.create({
      component: PlaceDetailPage,
      componentProps: {
        paramPlace: place,
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        console.log(dataReturned.data);
      }
    });

    return await modal.present();
  }
}
