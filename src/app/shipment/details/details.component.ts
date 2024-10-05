import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ShipmentService } from '../../services/shipment.service';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

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

    forkJoin([
      this.shipmentService.getShipmentDetailsList(this.shipmentNo),
      this.shipmentService.getShipmentDetails(this.shipmentNo)
    ]).subscribe(
      ([shipmentDetailsList, shipmentDetails]) => {
        this.shipment = shipmentDetailsList;
        this.shipment_list_data = shipmentDetails;

        let email = "mahiman@gmail.com"
        let [name, domain]= email.split('@');
        let [domainName, dominaEnd] = domain.split('.');

        const makedName =  this.replacename(name,true);
        const makedDomain = this.replacename(domainName,false)
        console.log(shipmentDetails);

        const maskedEmail = `${makedName}@${makedDomain}.${dominaEnd}`
        console.log(maskedEmail)
      },
      error => {
        console.error('Error fetching shipment details:', error);
      }
    );
  }

  replacename(name:any,first:boolean){
    let maskName:any= "";
    if(first){
      maskName[0] = name[0]
      for(let i=1; i<name.length; i++){
        maskName += "*"
      }
    }{
      for(let i=1; i<name.length; i++){
        maskName += "*"
      }
    }
    return maskName
  }

  toggleInfo(): void {
    this.showInfo = !this.showInfo;
  }

  goBack() {
    this.router.navigate(['/shipment/results']);
  }
}
