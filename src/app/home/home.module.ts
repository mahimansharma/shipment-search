import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule, HomeRoutingModule, FormsModule, TranslateModule, ReactiveFormsModule
  ]
})
export class HomeModule { }
