import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ShipmentService } from '../../services/shipment.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [DatePipe]

})
export class DetailsComponent implements OnInit {
  shipment: any = null;
  shipmentNo: string = '';
  showInfo: any;
  shipment_list_data: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private shipmentService: ShipmentService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.shipmentNo = params['id'];
      this.loadShipmentDetails();
    });
  }

  parseDate(dateString:any) {
    const [day, month, year] = dateString.split('-').map(Number);
    const parseDate = new Date(year, month - 1, day); // Month is 0-based
    return  this.datePipe.transform(parseDate, 'MMM d, y') || '';
  }

  loadShipmentDetails() {
    this.http.get('/assets/json/shipment-details.json').subscribe((data: any) => {
      // Find the shipment matching the ID in the mock data
      this.shipment = data.Shipment;
    });

    this.shipmentService.getShipmentDetails(this.shipmentNo).subscribe(data => {
      this.shipment_list_data = data
      console.log(data)
    })
  }
  toggleInfo(): void {
    this.showInfo = !this.showInfo;
  }

  goBack() {
    this.router.navigate(['/shipment/results']);
  }
}
