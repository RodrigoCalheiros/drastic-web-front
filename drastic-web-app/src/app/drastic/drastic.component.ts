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
import { Layer } from '../model/layer.model';
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

  layers: Layer[] = [];

  layer_drastic_d = {
    name: 'd',
    visible: false
  } as Layer;

  layer_drastic_r = {
    name: 'r',
    visible: false
  } as Layer;

  layer_drastic_a = {
    name: 'a',
    visible: false
  } as Layer;

  layer_drastic_s = {
    name: 's',
    visible: false
  } as Layer;

  layer_drastic_t = {
    name: 't',
    visible: false
  } as Layer;

  layer_drastic_i = {
    name: 'i',
    visible: false
  } as Layer;

  layer_drastic_c = {
    name: 'c',
    visible: false
  } as Layer;

  layer_drastic_result = {
    name: 'result',
    visible: false
  } as Layer;

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

  // parser:SLDParser = new SLDParser();

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ){
  }

  ngOnInit(): void {
    this.layers.push(this.layer_drastic_d);
    this.layers.push(this.layer_drastic_r);
    this.layers.push(this.layer_drastic_a);
    this.layers.push(this.layer_drastic_s);
    this.layers.push(this.layer_drastic_t);
    this.layers.push(this.layer_drastic_i);
    this.layers.push(this.layer_drastic_c);
    this.layers.push(this.layer_drastic_result);
    this.loadMap();
  }



  loadMap(){
    let wmsTyleLayers: any[] = [];
    let visible: boolean;
    this.layers.forEach(layer =>{

      const sld = '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor version="1.1.0"xmlns="http://www.opengis.net/sld"xmlns:se="http://www.opengis.net/se"xmlns:ogc="http://www.opengis.net/ogc"xmlns:xlink="http://www.w3.org/1999/xlink"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://www.opengis.net/sldhttp://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd"><NamedLayer><se:Name>d</se:Name><UserStyle><se:Name>xxx</se:Name><se:FeatureTypeStyle><se:Rule><se:RasterSymbolizer><se:ChannelSelection><se:GrayChannel><se:SourceChannelName>1</se:SourceChannelName></se:GrayChannel></se:ChannelSelection><se:ColorMap type="ramp"><se:ColorMapEntry color="#d7191c" quantity="0" label="0"/><se:ColorMapEntry color="#fdae61" quantity="0.75" label="0.75"/><se:ColorMapEntry color="#ffffbf" quantity="1.5" label="1.5"/><se:ColorMapEntry color="#abdda4" quantity="2.25" label="2.25"/><se:ColorMapEntry color="#2b83ba" quantity="3" label="3"/></se:ColorMap></se:RasterSymbolizer></se:Rule></se:FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>'
      if (layer.name == 'd'){
        layer.visible = true;
      }
      
      let tileLayer = new TileLayer({
        visible: layer.visible,
        zIndex: 10,
        source: new TileWMS({
          url: 'http://localhost/cgi-bin/mapserv',
          params: this.getParamsTileWMS(layer.name, layer.sld? layer.sld: ''),
          serverType: 'mapserver',
          crossOrigin: "anonymous"
        }),
      }) 
      tileLayer.set("name", layer.name);
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

  getParamsTileWMS(layerName: string, sld: string){
    return {
      'srs': 'EPSG:3857',
      'LAYERS': layerName, 
      'TILED': true, 
      'MAP':'/var/www/mapserv/drastic2.map',
      'SLD_BODY': sld
    }
  }
  changeShowDLayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleDLayer = event.checked;
   // this.changeVisibleLayersWMS("d", event.checked)
  }

  changeShowRLayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleRLayer = event.checked;
   // this.changeVisibleLayersWMS("r", event.checked)
  }

  changeShowALayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleALayer = event.checked;
   // this.changeVisibleLayersWMS("a", event.checked)
  }

  changeShowSLayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleSLayer = event.checked;
   // this.changeVisibleLayersWMS("s", event.checked)
  }

  changeShowTLayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleTLayer = event.checked;
   // this.changeVisibleLayersWMS("t", event.checked)
  }

  changeShowILayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleILayer = event.checked;
   // this.changeVisibleLayersWMS("i", event.checked)
  }
  
  changeShowCLayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleCLayer = event.checked;
    //this.changeVisibleLayersWMS("c", event.checked)
  }

  changeShowResultLayer(event: MatSlideToggleChange){
    console.log(event);
    this.visibleResultLayer = event.checked;
    //this.changeVisibleLayersWMS("result", event.checked)
  }

  changeVisibleLayersWMS(layer: Layer){
    this.wmsTyleLayerGroup.getLayersArray().forEach(tileLayer => {
      if (tileLayer.get("name") == layer.name){
        tileLayer.setSource(new TileWMS({
          url: 'http://localhost/cgi-bin/mapserv',
          params: this.getParamsTileWMS(layer.name, layer.sld? layer.sld: ''),
          serverType: 'mapserver',
          crossOrigin: "anonymous"
        }));
        tileLayer.setVisible(layer.visible? true: false);
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
       // this.changeVisibleLayersWMS("d", true);
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
       // this.changeVisibleLayersWMS("a", true);
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

  renderLayer(layer: Layer){
    let layerFilter = this.layers.filter(layerFilter => layerFilter.name == layer.name)[0];
    layerFilter.statistics = layer.statistics;
  }

  applySymbology(layer: Layer){
    this.changeVisibleLayersWMS(layer);
    // let layerFilter = this.layers.filter(layerFilter => layerFilter.name == layer.name)[0];
    // layerFilter.sld = layer.sld;
    // layerFilter.visible = layer.visible;
    // console.log("symbology", layer)
  }

}
