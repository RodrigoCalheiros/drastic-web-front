import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private httpClient: HttpClient) { }

    post(algoritm: String, variable: String, formData: FormData){
        return new Promise((resolve, reject) => {
            this.httpClient.post<any>("http://127.0.0.1:5000/file/upload/" + algoritm + "/" + variable, formData).subscribe(
                (res) =>{
                  console.log(res);
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
