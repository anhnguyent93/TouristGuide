import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingController, ModalController, NavParams} from '@ionic/angular';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Storage} from '@ionic/storage';
import {ModalMapPage} from '../modal-map/modal-map.page';
import {PlaceDetailPage} from '../place-detail/place-detail.page';

declare var google;

@Component({
  selector: 'app-modal-list',
  templateUrl: './modal-list.page.html',
  styleUrls: ['./modal-list.page.scss'],
})
export class ModalListPage implements AfterViewInit, OnInit {

  @ViewChild('autoCompleteInput', {static: false}) inputNativeElement: any;

  directionForm: FormGroup;
  map: any;
  service: any;
  places = [];
  details = [];
  type: any;
  place: any;

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
      placeName: [''],
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.loadInput();
  }

  ionViewWillEnter() {
    this.type = this.navParams.data.paramType;
    this.place = this.navParams.data.paramPlace;
    this.inputNativeElement.nativeElement.value = this.navParams.data.paramString;
    console.log(this.place);
    this.map = new google.maps.Map(document.createElement('div'));
    this.service = new google.maps.places.PlacesService(this.map);
    this.service.nearbySearch({
      location: this.place.geometry.location,
      radius: 20000,
      type: this.type.type,
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.places = results;
      }
    });
  }

  async closeModalData() {
    const data = {
      place: this.place,
      string: this.inputNativeElement.nativeElement.value,
    };
    await this.modalController.dismiss(data);
  }

  loadInput() {
    const autocomplete = new google.maps.places.Autocomplete(this.inputNativeElement.nativeElement, {types: ['(cities)']});

    autocomplete.addListener('place_changed', () => {
      this.place = autocomplete.getPlace();
      console.log(this.place);
      if (!this.place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert('No details available for input: ' + this.place.name );
        return;
      }

      this.service.nearbySearch({
        location: this.place.geometry.location,
        radius: 20000,
        type: this.type.type,
      }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.places = results;
        }
      });
    });
  }

  trackByFn(index: number, item: any): number {
    return item.serialNumber;
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalMapPage,
      componentProps: {
        paramType: this.type,
        paramPlaces: this.places,
        paramPlace: this.place,
        paramString: this.inputNativeElement.nativeElement.value,
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        console.log(dataReturned.data);
        this.inputNativeElement.nativeElement.value = dataReturned.data.string;
        this.place = dataReturned.data.place;
        this.places = dataReturned.data.places;
      }
    });

    return await modal.present();
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
