import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ListService } from 'src/app/service/list.service';

import { Symbology } from 'src/app/model/symbology.model';
import { Statistics } from 'src/app/model/statistics.model';
import { Layer } from 'src/app/model/layer.model';
import { RasterService } from 'src/app/service/raster.service';

@Component({
  selector: 'app-symbology',
  templateUrl: './symbology.component.html',
  styleUrls: ['./symbology.component.css']
})
export class SymbologyComponent implements OnInit {

  @ViewChild('tableRatings') table!: MatTable<any>;
  @Input() layer: Layer = {} as Layer;
  @Output() symbologyLayer = new EventEmitter<Layer>();

  displayedColumns: string[] = ['min', 'max', 'color', 'options'];
  dataSource: Symbology[] = [];
  dataSourceSort: Symbology[] = [];

  formControlMin = new FormControl(0);
  formControlMax = new FormControl(0);
  formControlColor = new FormControl("");

  form: FormGroup = this.formBuilder.group({
    min: this.formControlMin,
    max: this.formControlMax,
    color: this.formControlColor
  });

  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService,
    private rasterService: RasterService
  ){
  }

  ngOnInit(): void {
    console.log(this.layer);
    const symbologyList = this.statistcsToSymbology();
    console.log(symbologyList)
    this.dataSource = symbologyList;
    this.dataSourceSort = this.listService.orderList(this.dataSource, "min");
    
  }

  addElement(){
    let symbology: Symbology = {
      min: this.form.get('min')?.value,
      max: this.form.get('max')?.value,
      color: this.form.get('color')?.value
    };
    this.dataSource.push(symbology);
    this.dataSourceSort = this.listService.orderList(this.dataSource, "min");
    this.table.renderRows();
  }

  deleteElement(element: any){
    this.dataSource = this.dataSource.filter((value, key) => {
      return (value != element);
    })
    this.dataSourceSort = this.listService.orderList(this.dataSource, "min");
  }

  statistcsToSymbology(){
    let symbologyList:Symbology[] = [];
    console.log(this.layer.statistics)

    if (this.layer.statistics){
      const interval1 = this.layer.statistics.minimum;
      const interval2 = this.layer.statistics.minimum + ((this.layer.statistics.mean - this.layer.statistics.minimum) / 2);
      const interval3 = this.layer.statistics.mean + ((this.layer.statistics.maximum - this.layer.statistics.mean) / 2);
      console.log(interval1);
      console.log(interval2);
      console.log(interval3);

      const symbology1 = {} as Symbology;
      symbology1.min = interval1;
      symbology1.max = interval2;
      symbology1.color = this.getRandomColor();
      symbologyList.push(symbology1);

      const symbology2 = {} as Symbology;
      symbology2.min = interval2;
      symbology2.max = interval3;
      symbology2.color = this.getRandomColor();
      symbologyList.push(symbology2);

      const symbology3 = {} as Symbology;
      symbology3.min = interval3
      symbology3.max = this.layer.statistics.maximum
      symbology3.color = this.getRandomColor();
      symbologyList.push(symbology3);
    }

    return symbologyList;
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  applySymbology(){
    this.layer.sld = this.rasterService.getSld(this.layer.name, this.dataSourceSort) 
    this.layer.visible = true;
    this.symbologyLayer.emit(this.layer);
  }

}
