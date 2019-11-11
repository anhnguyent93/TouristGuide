import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Geolocation} from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('mapElement', {static: false}) mapNativeElement: ElementRef;
  @ViewChild('autoCompleteInput', {static: false}) inputNativeElement: any;

  address: string;
  directionForm: FormGroup;
  marker: any;
  map: any;
  latitude: any;
  longitude: any;
  markers = [];
  places = [];
  openList = false;

  constructor(private fb: FormBuilder,
              private loadingCtrl: LoadingController,
              private geolocation: Geolocation,
  ) {
    this.createDirectionForm();
  }

  createDirectionForm() {
    this.directionForm = this.fb.group({
      placeName: [''],
    });
  }

  async loadMap() {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 13,
      disableDefaultUI: true,
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      loading.dismiss();
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    await this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      const pos = new google.maps.LatLng({
        lat: this.latitude,
        lng: this.longitude
      });

      this.map.setCenter(pos);
      this.marker.setPosition(pos);

      this.map.addListener('drag', () => {
        this.openList = false;
      });

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {location: pos},
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results.length > 0) {
              this.address = results[0].formatted_address;
              console.log(results[0].formatted_address);
            } else {
              alert('Not found');
            }
          }
        });
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    const autocomplete = new google.maps.places.Autocomplete(this.inputNativeElement.nativeElement, {types: ['(cities)']});
    autocomplete.addListener('place_changed', () => {
      this.places = [];
      const place = autocomplete.getPlace();
      console.log(place);
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert('No details available for input: ' + place.name );
        return;
      }

      const service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch({
        location: place.geometry.location,
        radius: 20000,
        type: 'tourist_attraction',
      }, (results, status) => {
        console.log(results);
        this.places = results;

        if (this.markers.length !== 0) {
          this.markers.splice(0, this.markers.length);
        }
      });
    });
  }
}
