import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';

import { DrasticDService } from 'src/app/service/drastic-d.service';
import { RasterService } from 'src/app/service/raster.service';
import { ListService } from 'src/app/service/list.service';

import { Rating } from 'src/app/model/rating.model';
import { Statistics } from 'src/app/model/statistics.model';
import { Layer } from 'src/app/model/layer.model';
import { Response } from 'src/app/model/response.model';

const RATINGS: Rating[] = [
  {depthMin: 0.0, depthMax: 1.5, value: 10},
  {depthMin: 1.5, depthMax: 4.6, value: 9},
  {depthMin: 4.6, depthMax: 9.1, value: 7},
  {depthMin: 9.1, depthMax: 15.2, value: 5.0},
  {depthMin: 15.2, depthMax: 22.9, value: 3.0},
  {depthMin: 22.9, depthMax: 30.5, value: 2.0},
  {depthMin: 30.5, depthMax: 200, value: 1.0}  
];

@Component({
  selector: 'app-drastic-d',
  templateUrl: './drastic-d.component.html',
  styleUrls: ['./drastic-d.component.css']
})
export class DrasticDComponent implements OnInit {

  @ViewChild('tableRatings') table!: MatTable<any>;
  @Output() renderLayer = new EventEmitter<Layer>();
  
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
    ratings: null,
    ratingDepthMin: this.formControlRatingDepthMin,
    ratingDepthMax: this.formControlRatingDepthMax,
    rating: this.formControlRating
  });

  displayedColumns: string[] = ['depthMin', 'depthMax', 'rating', 'options'];
  dataSource = RATINGS;
  dataSourceSort: Rating[] = [] as Rating[];

  constructor(
    private formBuilder: FormBuilder,
    private drasticDService: DrasticDService,
    private rasterService: RasterService,
    private listService: ListService
  ){
  }

  ngOnInit(): void {
    this.dataSourceSort = this.listService.orderList(this.dataSource, "depthMin");
  }

  addRating(){
    let rating: Rating = {
      depthMin: this.form.get('ratingDepthMin')?.value,
      depthMax: this.form.get('ratingDepthMax')?.value,
      value: this.form.get('rating')?.value
    };
    this.dataSource.push(rating);
    this.dataSourceSort = this.listService.orderList(this.dataSource, "depthMin");;
    this.table.renderRows();
  }

  deleteRating(element: any){
    this.dataSource = this.dataSource.filter((value, key) => {
      return (value != element);
    })
    this.dataSourceSort = this.listService.orderList(this.dataSource, "depthMin");
  }

  ratingsToList(){
    let ratingList:number[] = [];
    this.dataSource.forEach(rating => {
      ratingList.push(rating.depthMin);
      ratingList.push(rating.depthMax);
      ratingList.push(rating.value);
    })
    return ratingList;
  }


  calculateD(){
    this.form.patchValue({ratings: this.ratingsToList()});
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.form.value));
    this.drasticDService.calculate(formData).then(res => {
      this.rasterService.getStatistics("drastic", "d").then(res => {
        this.renderLayer.emit({name:'d', statistics: res} as Layer);
      });
    });
    
  }

  uploadFile(){

  }

  onFileSelect(event: any){

  }

}
