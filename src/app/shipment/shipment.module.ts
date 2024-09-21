import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results/results.component';
import { DetailsComponent } from './details/details.component';
import { ShipmentRoutingModule } from './shipment-routing.module';
//import { InfiniteScrollModule } from 'ngx-infinite-scroll'; // For infinite scrolling

@NgModule({
  declarations: [ResultsComponent, DetailsComponent],
  imports: [CommonModule, ShipmentRoutingModule],
})
export class ShipmentModule {}
