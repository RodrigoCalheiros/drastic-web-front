import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import * as olProj from 'ol/proj';
import { OSM } from 'ol/source';
import TileWMS from 'ol/source/TileWMS';
import View from 'ol/View';
import { DrasticDService } from '../service/drastic-d.service';

@Component({
  selector: 'app-drastic',
  templateUrl: './drastic.component.html',
  styleUrls: ['./drastic.component.css']
})
export class DrasticComponent implements OnInit {
  
  @ViewChild('tableARatings') table!: MatTable<any>;

  drasticDService!: DrasticDService;
  map!: Map;
  wmsTyleLayerGroup = new LayerGroup();
  layers = ['d', 'r', 'a', 's', 't', 'i', 'c', 'result']

  //D
  visibleDLayer = true;

  dForm_upload = new FormControl('');
  dUploadForm: FormGroup = this.formBuilder.group({
    mdtFile: this.dForm_upload
  });

   //Implementar 
   dForm_rattings = new FormControl(50);

  dForm_maxDepth = new FormControl(20);
  dForm_distance = new FormControl(200);
  dForm_minSize = new FormControl(50);
  dForm: FormGroup = this.formBuilder.group({
    maxDepth: this.dForm_maxDepth,
    distance: this.dForm_distance,
    minSize: this.dForm_minSize
  });
  dSpinnerVisible = false;

  //R
  visibleRLayer = false;

  rForm_upload = new FormControl('');
  rUploadForm: FormGroup = this.formBuilder.group({
    mdtFile: this.dForm_upload
  });

  //Implementar 
  rForm_rattings = new FormControl(50);

  rForm: FormGroup = this.formBuilder.group({
    rattings: this.rForm_rattings,
  });

  //A
  visibleALayer = false;
  aSpinnerVisible = false;
  aForm_upload = new FormControl('');
  aUploadForm: FormGroup = this.formBuilder.group({
    mdtFile: this.aForm_upload
  });

  aHeaders: String[] = [];
  aValues: String[] = [];
  aRatings: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['class', 'value', 'options'];

  aForm_header = new FormControl(null);
  aForm_class = new FormControl(null);
  aForm_weight = new FormControl(0);
  aForm: FormGroup = this.formBuilder.group({
    header: this.aForm_header,
    class: this.aForm_class,
    weight: this.aForm_weight
  });
  

  //S
  visibleSLayer = false;

  sForm_upload = new FormControl('');
  sUploadForm: FormGroup = this.formBuilder.group({
    mdtFile: this.dForm_upload
  });

  sHeaders: String[] = [];
  sValues: String[] = [];
  sRatings: MatTableDataSource<any> = new MatTableDataSource();  
  displayedColumnsS: string[] = ['class', 'value', 'options'];

  sForm_header = new FormControl(null);
  sForm_class = new FormControl(null);
  sForm_weight = new FormControl(0);
  sForm: FormGroup = this.formBuilder.group({
    header: this.aForm_header,
    class: this.aForm_class,
    weight: this.aForm_weight
  });
  
  
  //T
  visibleTLayer = false;

  tForm_upload = new FormControl('');
  tUploadForm: FormGroup = this.formBuilder.group({
    mdtFile: this.dForm_upload
  });

  tForm: FormGroup = this.formBuilder.group({
    header: this.aForm_header,
    class: this.aForm_class,
    weight: this.aForm_weight
  });

  //I
  visibleILayer = false;

  iForm_upload = new FormControl('');
  iUploadForm: FormGroup = this.formBuilder.group({
    mdtFile: this.dForm_upload
  });

  iForm: FormGroup = this.formBuilder.group({
    header: this.aForm_header,
    class: this.aForm_class,
    weight: this.aForm_weight
  });

  //C
  visibleCLayer = false;

  cForm_upload = new FormControl('');
  cUploadForm: FormGroup = this.formBuilder.group({
    mdtFile: this.dForm_upload
  });

  cForm: FormGroup = this.formBuilder.group({
    header: this.aForm_header,
    class: this.aForm_class,
    weight: this.aForm_weight
  });

  //DRASTIC
  visibleResultLayer = false;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ){
  }

  ngOnInit(): void {
    this.loadMap();
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

  onFileSelect(event:any, variable: any){
    if (event.target.files.length > 0){
      const file = event.target.files[0];
      if (variable == 'd'){
        this.dForm_upload.setValue(file);
      } else if (variable == 'r'){
        this.rForm_upload.setValue(file);
      } else if (variable == 'a'){
        this.aForm_upload.setValue(file);
      } else if (variable == 's'){
        this.sForm_upload.setValue(file);
      } else if (variable == 't'){
        this.tForm_upload.setValue(file);
      } else if (variable == 'i'){
        this.iForm_upload.setValue(file);
      } else if (variable == 'c'){
        this.cForm_upload.setValue(file);
      }
      
      //this.uploadForm.get('mdtFile')?.setValue(file);
    }
  }

  getAtributesA(){
    this.getHeaderShpA();
  }

  uploadFile(variable: any) {
    const formData = new FormData();
    if (variable == 'd'){
      formData.append('file', this.dUploadForm.get('mdtFile')?.value);
    } else if (variable == 'r'){
      formData.append('file', this.rUploadForm.get('mdtFile')?.value);
    } else if (variable == 'a'){
      formData.append('file', this.aUploadForm.get('mdtFile')?.value);
    } else if (variable == 's'){
      formData.append('file', this.sUploadForm.get('mdtFile')?.value);
    } else if (variable == 't'){
      formData.append('file', this.tUploadForm.get('mdtFile')?.value);
    } else if (variable == 'i'){
      formData.append('file', this.iUploadForm.get('mdtFile')?.value);
    } else if (variable == 'c'){
      formData.append('file', this.cUploadForm.get('mdtFile')?.value);
    }
    
    //let options = {
    //  headers: new HttpHeaders().set('Access-Control-Allow-Origin', 'http://127.0.0.1:5000'),
    //  file: this.uploadForm.get('mdtFile')?.value
    //}
    this.httpClient.post<any>("http://127.0.0.1:5000/drastic/upload/" + variable, formData).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
        alert("Upload realizado com sucesso!");
        if (variable == 'd'){
          this.dUploadForm.get('mdtFile')?.setValue(null);
        } else if (variable == 'r'){
          this.rUploadForm.get('mdtFile')?.setValue(null);
        } else if (variable == 'a'){
          this.aUploadForm.get('mdtFile')?.setValue(null);
        } else if (variable == 's'){
          this.sUploadForm.get('mdtFile')?.setValue(null);
        } else if (variable == 't'){
          this.tUploadForm.get('mdtFile')?.setValue(null);
        } else if (variable == 'i'){
          this.iUploadForm.get('mdtFile')?.setValue(null);
        } else if (variable == 'c'){
          this.cUploadForm.get('mdtFile')?.setValue(null);
        }
      }
    );
  }

  calculateD(){
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.dForm.value));
    console.log(formData.get("data"));
    console.log(formData);
    this.dSpinnerVisible= true;
    this.httpClient.post<any>("http://127.0.0.1:5000/drastic/d/calculate", formData).subscribe(
      (res) =>{
        console.log(res);
        this.dSpinnerVisible= false;
      },
      (err) =>{
        this.dSpinnerVisible= false;
        alert("Fator D calculado com sucesso.");
        this.visibleDLayer = true;
        this.changeVisibleLayersWMS("d", true);
      }
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
    const formData = new FormData();
    formData.append('data', JSON.stringify({rattings: this.aRatings.data}));
    this.aSpinnerVisible= true;
    this.httpClient.post<any>("http://127.0.0.1:5000/drastic/a/calculate",  formData).subscribe(

      (res) =>{
        console.log(res);
        this.aSpinnerVisible= false;
      },
      (err) =>{
        this.aSpinnerVisible= false;
        alert("Fator A calculado com sucesso.");
        this.visibleALayer = true;
        this.changeVisibleLayersWMS("a", true);
      }
    );
  }

  calculateS(){
    const formData = new FormData();
    formData.append('data', JSON.stringify({rattings: this.sRatings.data}));
    this.httpClient.post<any>("http://127.0.0.1:5000/drastic/s/calculate",  formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  calculateT(){
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.tForm.value));
    this.httpClient.post<any>("http://127.0.0.1:5000/drastic/t/calculate",  formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  calculateI(){
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.iForm.value));
    this.httpClient.post<any>("http://127.0.0.1:5000/drastic/i/calculate",  formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  calculateC(){
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.cForm.value));
    this.httpClient.post<any>("http://127.0.0.1:5000/drastic/c/calculate",  formData).subscribe(
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

  changeHeaderShpA(value: any){
    this.getValueShpA(value);
    this.clearARattings();
  }

  changeHeaderShpS(value: any){
    //not implemented
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
    console.log("clear")
    this.aRatings.data = [];
  }

  addARattings(){
    let ratting = {
      class: this.aForm.get('class')?.value,
      value: this.aForm.get('weight')?.value
    };
    this.aRatings.data.push(ratting);
    this.table.renderRows();
  }

  addSRattings(){
    //not implemented
  }

  deleteARatings(rowObj: any){
    console.log("rowObj", rowObj)
    this.aRatings.data = this.aRatings.data.filter((value, key) => {
      console.log("value",value);
      console.log("key", key)
      return (value.class != rowObj.class && value.value != rowObj.value);
    })
  }

  deleteSRatings(rowObj: any){
    //not implemented
  }

}
