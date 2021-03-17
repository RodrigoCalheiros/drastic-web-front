import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ScaleLine, defaults as defaultControls } from 'ol/control';

import { DrasticDService } from '../drastic-d.service';
import TileWMS from 'ol/source/TileWMS';
import LayerGroup from 'ol/layer/Group';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-drastic',
  templateUrl: './drastic.component.html',
  styleUrls: ['./drastic.component.css']
})
export class DrasticComponent implements OnInit {

  layers = ['d', 'r', 'a', 's', 't', 'i', 'c', 'result']
  wmsTyleLayerGroup = new LayerGroup();

  visibleDLayer = true;
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

  visibleRLayer = false;
  rForm_rattings = new FormControl(50);
  rForm: FormGroup = this.formBuilder.group({
    rattings: this.rForm_rattings,
  });

  visibleALayer = false;
  aHeaders: String[] = [];
  aValues: String[] = [];
  aRatings: MatTableDataSource<any> = new MatTableDataSource();  
  aForm_header = new FormControl(null);
  aForm_class = new FormControl(null);
  aForm_weight = new FormControl(0);
  aForm: FormGroup = this.formBuilder.group({
    header: this.aForm_header,
    class: this.aForm_class,
    weight: this.aForm_weight
  });
  displayedColumns: string[] = ['class', 'value'];

  
  visibleSLayer = false;
  visibleTLayer = false;
  visibleILayer = false;
  visibleCLayer = false;
  visibleResultLayer = false;

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
    let wmsTyleLayers: any[] = [];
    let visible: boolean;
    this.layers.forEach(layer =>{
      
      if (layer =='d'){
        visible = this.visibleDLayer
      }else{
        visible = false;
      }
      let tileLayer = new TileLayer({
        visible: visible,
        zIndex: 10,
        source: new TileWMS({
          url: 'http://localhost/cgi-bin/mapserv',
          params: {
            'srs': 'EPSG:3857',
            'LAYERS': layer, 
            'TILED': true, 
            'MAP':'/var/www/mapserv/drastic2.map'
          },
          serverType: 'mapserver',
          crossOrigin: "anonymous"
        }),
      }) 
      tileLayer.set("name", layer);
      wmsTyleLayers.push(tileLayer)
    })

    this.wmsTyleLayerGroup = new LayerGroup({
      layers: wmsTyleLayers
    })
    

    this.map = new Map({
      target: 'map',
      controls: defaultControls().extend([new ScaleLine({units: "metric"})]),
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.wmsTyleLayerGroup
      ],
      view: new View({
        center: olProj.fromLonLat([-7.5,40.3]),
        zoom: 10,
        rotation:0
      })
    });
  }

  changeShowDLayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleDLayer = event.checked;
    this.changeVisibleLayersWMS("d", event.checked)
  }

  changeShowRLayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleRLayer = event.checked;
    this.changeVisibleLayersWMS("r", event.checked)
  }

  changeShowALayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleALayer = event.checked;
    this.changeVisibleLayersWMS("a", event.checked)
  }

  changeShowSLayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleSLayer = event.checked;
    this.changeVisibleLayersWMS("s", event.checked)
  }

  changeShowTLayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleTLayer = event.checked;
    this.changeVisibleLayersWMS("t", event.checked)
  }

  changeShowILayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleILayer = event.checked;
    this.changeVisibleLayersWMS("i", event.checked)
  }
  
  changeShowCLayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleCLayer = event.checked;
    this.changeVisibleLayersWMS("c", event.checked)
  }

  changeShowResultLayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleResultLayer = event.checked;
    this.changeVisibleLayersWMS("result", event.checked)
  }

  changeVisibleLayersWMS(layer: any, visible:boolean){
    this.wmsTyleLayerGroup.getLayersArray().forEach(tileLayer => {
      if (tileLayer.get("name") == layer){
        tileLayer.setVisible(visible);
      }else{
        tileLayer.setVisible(false);
      }
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
      (res) =>{
        console.log(res)
        this.visibleDLayer = true;
        this.changeVisibleLayersWMS("d", true);
      },
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


  calculateA(){
    // const formData = new FormData();
    // formData.append('data', JSON.stringify(this.rForm.value));
    // this.httpClient.post<any>("http://127.0.0.1:5000/drastic/r/calculate",  formData).subscribe(
    //   (res) => console.log(res),
    //   (err) => console.log(err)
    // );
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

  changeHeaderShpA(value: any){
    console.log(value);
    this.getValueShpA(value)
  }

  getValueShpA(header: any){
    const opts = { params: new HttpParams({fromString: "field=" + header}) };
    this.httpClient.get<any>("http://127.0.0.1:5000/drastic/shp/value/a", opts).subscribe(
      (res) => {
        console.log(res)
        this.aValues = res.data
      },
      (err) => console.log(err)
    );
  }

  clearARattings(){
    //this.aRatings = [];
  }

  addARattings(){
    let ratting = {
      class: this.aForm.get('class')?.value,
      value: this.aForm.get('weight')?.value
    };
    console.log(ratting);
    this.aRatings.data.push(ratting);
    console.log(this.aRatings.data)
  }

 

}
