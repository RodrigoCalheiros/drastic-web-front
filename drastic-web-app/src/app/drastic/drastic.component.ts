import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

@Component({
  selector: 'app-drastic',
  templateUrl: './drastic.component.html',
  styleUrls: ['./drastic.component.css']
})
export class DrasticComponent implements OnInit {

  SERVER_URL = "http://127.0.0.1:5000/drastic/d/mdt";
  uploadForm!: FormGroup;
  dForm!: FormGroup;
  maxDepthControl = new FormControl(20);
  distanceControl = new FormControl(200);
  minSizeControl = new FormControl(50);

  drasticDService!: DrasticDService;
  map!: Map;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ){
    this.uploadForm = this.formBuilder.group({
      mdtFile: ['']
    });
    this.dForm = this.formBuilder.group({
      maxDepth: this.maxDepthControl,
      distance: this.distanceControl,
      minSize: this.minSizeControl
    });
  }

  ngOnInit(): void {
    this.loadMap();
  }

  loadMap(){
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: olProj.fromLonLat([-46,-2]),
        zoom: 5
      })
    });
  }

  onFileSelect(event:any){
    if (event.target.files.length > 0){
      const file = event.target.files[0];
      this.uploadForm.get('mdtFile')?.setValue(file);
    }
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('mdtFile')?.value);
    let options = {
      headers: new HttpHeaders()
          .set('Access-Control-Allow-Origin', 'http://127.0.0.1:5000'),
      file: this.uploadForm.get('mdtFile')?.value

    }
    this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  calculateD(){
    console.log("log");
    const formData = new FormData();
    formData.append('data', this.dForm.value);
    this.httpClient.post<any>("http://127.0.0.1:5000/drastic/d", formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

}
