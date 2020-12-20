import { Injectable } from '@angular/core';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class DrasticDService {

  mdt!: FileService;
  max_depth: any;
  distance: any;
  min_size_watershed_basin: any;

  constructor() { }

  post(){

  }
}
