import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ModalMapPage} from '../modal-map/modal-map.page';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Storage } from '@ionic/storage';
import {ModalListPage} from '../modal-list/modal-list.page';

declare var google;

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements AfterViewInit, OnInit {

  @ViewChild('autoCompleteInput', {static: false}) inputNativeElement: any;

  directionForm: FormGroup;
  places = [];
  types: Array<{type: string, src: string, marker: string}> = [];
  map: any;
  service: any;
  place: any = null;

  constructor(private fb: FormBuilder,
              private modalController: ModalController,
              private storage: Storage
  ) {
    this.createDirectionForm();
  }

  createDirectionForm() {
    this.directionForm = this.fb.group({
      placeName: [''],
    });
  }

  ngOnInit() {
    this.types = ([
      {type: 'tourist_attraction', src: 'assets/icon/tourist.svg', marker: 'assets/markers/tourist.png'},
      {type: 'restaurant', src: 'assets/icon/restaurant.svg', marker: 'assets/markers/restaurant.png'},
      {type: 'hotel', src: 'assets/icon/hotel.svg', marker: 'assets/markers/hotel.png'},
      {type: 'hospital', src: 'assets/icon/hospital.svg', marker: 'assets/markers/hospital.png'},
      {type: 'bank', src: 'assets/icon/bank.svg', marker: 'assets/markers/bank.png'},
      {type: 'police', src: 'assets/icon/police.svg', marker: 'assets/markers/police.png'},
      {type: 'fire_station', src: 'assets/icon/fire-station.svg', marker: 'assets/markers/fire-station.png'},
      {type: 'parking', src: 'assets/icon/parking.svg', marker: 'assets/markers/parking.png'},
      {type: 'shopping_mall', src: 'assets/icon/shopping.svg', marker: 'assets/markers/shopping.png'},
      {type: 'gas_station', src: 'assets/icon/gas-station.svg', marker: 'assets/markers/gas-station.png'},
      {type: 'bar', src: 'assets/icon/bar.svg', marker: 'assets/markers/bar.png'},
      {type: 'bus_station', src: 'assets/icon/bus.svg', marker: 'assets/markers/bus.png'},
      {type: 'train_station', src: 'assets/icon/train.svg', marker: 'assets/markers/train.png'},
    ]);
  }

  ngAfterViewInit() {
    this.loadInput();
  }

  ionViewWillEnter() {
    this.map = new google.maps.Map(document.createElement('div'));
    this.service = new google.maps.places.PlacesService(this.map);

    // if (this.place) {
    //   this.inputNativeElement.nativeElement.value = this.place.formatted_address;
    //   for (let item of this.types) {
    //     this.service.nearbySearch({
    //       location: this.place.geometry.location,
    //       radius: 20000,
    //       type: item.type,
    //     }, (results, status) => {
    //       if (status === google.maps.places.PlacesServiceStatus.OK) {
    //         this.storage.set(item.type, JSON.stringify(results));
    //       }
    //     });
    //   }
    // }
  }

  loadInput() {
    const autocomplete = new google.maps.places.Autocomplete(this.inputNativeElement.nativeElement, {types: ['(cities)']});
    autocomplete.addListener('place_changed', () => {
      this.place = autocomplete.getPlace();
      // this.storage.set('place', JSON.stringify(this.place));
      console.log(this.place);
      if (!this.place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert('No details available for input: ' + this.place.name );
        return;
      }

      // for (let searchType of this.types) {
      //   this.service.nearbySearch({
      //     location: this.place.geometry.location,
      //     radius: 20000,
      //     type: searchType.type,
      //   }, (results, status) => {
      //     if (status === google.maps.places.PlacesServiceStatus.OK) {
      //       this.storage.set(searchType.type, JSON.stringify(results));
      //     }
      //   });
      // }
    });
  }

  async openModal(type: string) {
    const modal = await this.modalController.create({
      component: ModalListPage,
      componentProps: {
        paramType: this.types.find(x => x.type === type),
        paramPlace: this.place,
        paramString: this.inputNativeElement.nativeElement.value,
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        console.log(dataReturned.data);
        this.inputNativeElement.nativeElement.value = dataReturned.data.string;
        this.place = dataReturned.data.place;
      }
    });

    return await modal.present();
  }
}
