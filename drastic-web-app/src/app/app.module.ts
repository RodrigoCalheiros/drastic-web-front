import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrasticComponent } from './drastic/drastic.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { DrasticDComponent } from './drastic/d/drastic-d.component';
import {MatDividerModule} from '@angular/material/divider';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { SymbologyComponent } from './drastic/symbology/symbology.component';

@NgModule({
  declarations: [
    AppComponent,
    DrasticComponent,
    DrasticDComponent,
    FileUploadComponent,
    SymbologyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    HttpClientModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTabsModule
    
  ],
  providers: [{provide:MatFormFieldControl, useExisting: AppModule}],
  bootstrap: [AppComponent]
})
export class AppModule { }
