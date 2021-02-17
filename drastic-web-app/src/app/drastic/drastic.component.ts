import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Icon from 'ol/style/Icon';
import { OSM, Vector as VectorSource } from 'ol/source';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

import { DrasticDService } from '../drastic-d.service';
import TileWMS from 'ol/source/TileWMS';

@Component({
  selector: 'app-drastic',
  templateUrl: './drastic.component.html',
  styleUrls: ['./drastic.component.css']
})
export class DrasticComponent implements OnInit {

  dForm_upload = new FormControl('');
  uploadForm: FormGroup = this.formBuilder.group({
    mdtFile: this.dForm_upload
  });

  dForm_maxDepth = new FormControl(20);
  dForm_distance = new FormControl(200);
  dForm_minSize = new FormControl(50);
  dForm: FormGroup = this.formBuilder.group({
    maxDepth: this.dForm_maxDepth,
    distance: this.dForm_distance,
    minSize: this.dForm_minSize
  });

  rForm_rattings = new FormControl(50);
  rForm: FormGroup = this.formBuilder.group({
    rattings: this.rForm_rattings,
  });

  aHeaders: String[] = [];
  aValues: String[] = [];
  aRatings: any[] = [];
  aForm_header = new FormControl(null);
  aForm_class = new FormControl(null);
  aForm_weight = new FormControl(0);
  aForm: FormGroup = this.formBuilder.group({
    header: this.aForm_header,
    class: this.aForm_class,
    weight: this.aForm_weight
  });

  drasticDService!: DrasticDService;
  map!: Map;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ){
  }

  ngOnInit(): void {
    this.loadMap();
    this.getHeaderShpA();
  }

  loadMap(){
    var wms = new TileLayer({
      visible: true,
      zIndex: 10,
      source: new TileWMS({
        url: 'http://localhost/cgi-bin/mapserv',
        params: {
          'srs': 'EPSG:3857',
          'LAYERS': 'd', 
          'TILED': true, 
          'MAP':'/var/www/mapserv/drastic2.map'
        },
        serverType: 'mapserver',
        crossOrigin: "anonymous"
      }),
    }) 

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        wms
      ],
      view: new View({
        center: olProj.fromLonLat([-7.5,40.3]),
        zoom: 10
      })
    });
  }

  onFileSelect(event:any){
    if (event.target.files.length > 0){
      const file = event.target.files[0];
      this.dForm_upload.setValue(file);
      //this.uploadForm.get('mdtFile')?.setValue(file);
    }
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('mdtFile')?.value);
    let options = {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', 'http://127.0.0.1:5000'),
      file: this.uploadForm.get('mdtFile')?.value

    }
    this.httpClient.post<any>("http://127.0.0.1:5000/drastic/upload", formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  calculateD(){
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.dForm.value));
    console.log(formData.get("data"));
    this.httpClient.post<any>("http://127.0.0.1:5000/drastic/d/calculate", formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  calculateR(){
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.rForm.value));
    this.httpClient.post<any>("http://127.0.0.1:5000/drastic/r/calculate",  formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  getHeaderShpA(){
    const formData = new FormData();
    this.httpClient.get<any>("http://127.0.0.1:5000/drastic/shp/header/a").subscribe(
      (res) => {
        console.log(res)
        this.aHeaders = res.data
      },
      (err) => console.log(err)
    );
  }

  getValueShpA(){
    const opts = { params: new HttpParams({fromString: "field=" + this.aForm_header.value}) };
    this.httpClient.get<any>("http://127.0.0.1:5000/drastic/shp/value/a", opts).subscribe(
      (res) => {
        console.log(res)
        this.aValues = res.data
      },
      (err) => console.log(err)
    );
  }

  clearARattings(){
    this.aRatings = [];
  }

  addARattings(){
    let ratting = {
      class: this.aForm.get('header'),
      value: this.aForm.get('value')
    };
    this.aRatings.push(ratting);
  }

 

}
