import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsComponent } from './results/results.component';
import { DetailsComponent } from './details/details.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  { path: 'results', component: ResultsComponent },
  { path: 'details/:id', component: DetailsComponent },
];

@NgModule({
  imports: [TranslateModule, RouterModule.forChild(routes)],
  exports: [RouterModule, TranslateModule],
})
export class ShipmentRoutingModule {}
