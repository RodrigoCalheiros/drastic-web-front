import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileUploadService } from 'src/app/service/file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  @Input() algoritm = '';
  @Input() variable = '';
  
  fileFormControl= new FormControl('');
  uploadForm: FormGroup = this.formBuilder.group({
    file: this.fileFormControl
  });

  constructor(
    private formBuilder: FormBuilder,
    private fileUploadService: FileUploadService
  ){
  }

  ngOnInit(): void {
    
  }

  onFileSelect(event:any){
    if (event.target.files.length > 0){
        const file = event.target.files[0];
        this.fileFormControl.setValue(file);
    }
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('file')?.value);
    this.fileUploadService.post(this.algoritm, this.variable, formData).then((res) => {
        this.fileFormControl.setValue(null);
        this.uploadForm.get('file')?.setValue(null);
        alert("Upload realizado com sucesso!");
    }).catch((erro) => {
        console.log("Erro: ", erro);
    })
  }

}
