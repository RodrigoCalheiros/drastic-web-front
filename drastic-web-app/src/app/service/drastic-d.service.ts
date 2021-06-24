import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DrasticDService {

  constructor(private httpClient: HttpClient) { }

  calculate(formData: FormData){
    return new Promise((resolve, reject) => {
      this.httpClient.post<any>("http://127.0.0.1:5000/drastic/d/calculate", formData).subscribe(
        (res) =>{
          alert("Fator D calculado com sucesso.");
          resolve(res);
        },
        (erro) =>{
          console.log("Erro: ", erro);
          reject(erro);
        }
      );
    });
  }
}
