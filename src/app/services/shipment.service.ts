import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  constructor(private http: HttpClient) {}

  getShipmentDetails(shipmentNo: string) {
    return this.http.get('/assets/json/shipment-list.json').pipe(
      map((data:any) => data.Shipments?.Shipment?.find((val: { ShipmentNo: any; }) => val.ShipmentNo))
    );
  }
}
