import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  orderNo: string = '';
  shipmentNo: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  date= new Date()

  shipments: any[] = [];
  searchForm!: FormGroup | any;
  newForm: any;

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

    setInterval(()=>{
      this.refreshData()
    },5000)
  }

  onReset(): void {
    this.searchForm.reset();
  }

  get formControl() {
    return this.searchForm.controls;
  }

  refreshData(){
    this.date =new Date()
  }

  loadShipments() {
    return this.http.get('/assets/json/shipment-list.json');
  }

  onSubmit() {

    if (this.searchForm.valid) {
      this.loadShipments().subscribe((data: any) => {
      this.shipments = data.Shipments.Shipment;
      let form_value = this.searchForm.getRawValue()
      const filteredShipments = this.shipments.filter(shipment => {
        return (!form_value.orderNo || form_value.orderNo === "" || shipment.OrderNo.toLowerCase() === form_value.orderNo.toLowerCase()) &&
               (!form_value.shipmentNo || form_value.shipmentNo === "" || shipment.ShipmentNo.toLowerCase() === form_value.shipmentNo.toLowerCase()) &&
               (!form_value.firstName || form_value.firstName === "" || shipment.BillToAddress.FirstName.toLowerCase() === form_value.firstName.toLowerCase()) &&
               (!form_value.lastName || form_value.lastName === "" || shipment.BillToAddress.LastName.toLowerCase() === form_value.lastName.toLowerCase()) &&
               (!form_value.email || form_value.email === "" || shipment.BillToAddress.EMailID.toLowerCase() === form_value.email.toLowerCase()) &&
               (!form_value.phoneNumber || shipment.BillToAddress.DayPhone === form_value.phoneNumber);
      });
  
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
    })
    }
  }

  getForm(){
    this.newForm = this.fb.group({
      name: [""],
      pass: ["", Validators.required],
      address: this.fb.group({
        city: [""],
        state: [""]
      }),
      details: this.fb.array([
        this.fb.control("")
      ])
    })
  }

  get detais (){
    return this.newForm.get('details') as FormArray
  }
  
  get newformControl (){
    return this.newForm.control
  }

  resetForm(){

  }
}
