import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor() { }

  orderList(list: any[], atribute: string){
    return list.sort((element1: any, element2: any) => {
      if (element1[atribute] > element2[atribute]) {
        return 1;
      }
      if (element1[atribute] < element2[atribute]) {
        return -1;
      }
      return 0;
    })
  }
}
