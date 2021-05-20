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
import { DrasticDService } from '../../drastic-d.service';

export interface Rating {
  depthMin: number,
  depthMax: number,
  value: number
}

const RATINGS: Rating[] = [
  {depthMin: 0.0, depthMax: 1.5, value: 10},
  {depthMin: 1.5, depthMax: 4.6, value: 9},
  {depthMin: 4.6, depthMax: 9.1, value: 7},
  {depthMin: 9.1, depthMax: 15.2, value: 5.0},
  {depthMin: 15.2, depthMax: 22.9, value: 3.0},
  {depthMin: 22.9, depthMax: 30.5, value: 2.0},
  {depthMin: 30.5, depthMax: 200, value: 1.0},
];

@Component({
  selector: 'app-drastic-d',
  templateUrl: './drastic-d.component.html',
  styleUrls: ['./drastic-d.component.css']
})
export class DrasticDComponent implements OnInit {

  @ViewChild('tableRatings') table!: MatTable<any>;
  
  fileFormControl= new FormControl('');
  uploadForm: FormGroup = this.formBuilder.group({
    file: this.fileFormControl
  });

  formControlMaxDepth = new FormControl(20);
  formControlDistance = new FormControl(200);
  formControlMinSize = new FormControl(50);
  formControlRatingDepthMin = new FormControl(0);
  formControlRatingDepthMax = new FormControl(0);
  formControlRating = new FormControl(0);
  form: FormGroup = this.formBuilder.group({
    maxDepth: this.formControlMaxDepth,
    distance: this.formControlDistance,
    minSize: this.formControlMinSize,
    ratingDepthMin: this.formControlRatingDepthMin,
    ratingDepthMax: this.formControlRatingDepthMax,
    rating: this.formControlRating
  });

  displayedColumns: string[] = ['depthMin', 'depthMax', 'rating', 'options'];
  dataSource = RATINGS;

  constructor(
    private formBuilder: FormBuilder
  ){
  }

  ngOnInit(): void {
    
  }

  addRating(){
    let rating: Rating = {
      depthMin: this.form.get('ratingDepthMin')?.value,
      depthMax: this.form.get('ratingDepthMax')?.value,
      value: this.form.get('rating')?.value
    };
    this.dataSource.push(rating);
    this.table.renderRows();
  }

  deleteRating(element: any){
    this.dataSource = this.dataSource.filter((value, key) => {
      return (value != element);
    })
  }


  calculateD(){
    console.log("calculate D")
  }

  uploadFile(){

  }

  onFileSelect(event: any){

  }

}
