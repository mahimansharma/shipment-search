import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Search fields
  orderNo: string = '';
  shipmentNo: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';

  shipments: any[] = [];
  searchForm!: FormGroup | any;

  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder,) {}


  ngOnInit(): void {
    this.searchForm = this.fb.group({
      orderNo: [''],
      shipmentNo: [''],
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.pattern('^[0-9]{10}$')]]
    });
  }

  onReset(): void {
    this.searchForm.reset();
  }

  get formControl() {
    return this.searchForm.controls;
  }

  // Method to fetch mock shipment data
  loadShipments() {
    return this.http.get('/assets/json/shipment-list.json').toPromise();
  }

  async onSubmit() {

    if (this.searchForm.valid) {
      // Load shipment data
      this.shipments = await this.loadShipments().then((data: any) => data.Shipments.Shipment);
      let form_value = this.searchForm.getRawValue()
      // Filter shipments based on search fields, case-insensitive exact match
      const filteredShipments = this.shipments.filter(shipment => {
        return (!form_value.orderNo || shipment.OrderNo.toLowerCase() === form_value.orderNo.toLowerCase()) &&
               (!form_value.shipmentNo || shipment.ShipmentNo.toLowerCase() === form_value.shipmentNo.toLowerCase()) &&
               (!form_value.firstName || shipment.BillToAddress.FirstName.toLowerCase() === form_value.firstName.toLowerCase()) &&
               (!form_value.lastName || shipment.BillToAddress.LastName.toLowerCase() === form_value.lastName.toLowerCase()) &&
               (!form_value.email || shipment.BillToAddress.EMailID.toLowerCase() === form_value.email.toLowerCase()) &&
               (!form_value.phoneNumber || shipment.BillToAddress.DayPhone === form_value.phoneNumber);
      });
  
      // If exactly 1 result, navigate to the details page for that shipment
      if (filteredShipments.length === 1) {
        this.router.navigate(['/shipment/details', filteredShipments[0].ShipmentNo]);
      } else {
        // Otherwise, navigate to the results page
        this.router.navigate(['/shipment/results'], { queryParams: { 
          orderNo: form_value?.orderNo,
          shipmentNo: form_value?.shipmentNo,
          firstName: form_value?.firstName,
          lastName: form_value?.lastName,
          email: form_value?.email,
          phoneNumber: form_value?.phoneNumber
        }});
      }
    }
  }

  resetForm(){

  }
}
