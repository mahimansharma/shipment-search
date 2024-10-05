import { Component, OnInit, OnDestroy, viewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ShipmentService } from '../../services/shipment.service';
import { DatePipe } from '@angular/common';
import { debounce } from 'lodash';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  providers: [DatePipe],
})
export class ResultsComponent implements OnInit, OnDestroy {
  shipments: any[] = [];
  filteredShipments: any[] = [];
  queryParams: any = {};
  page = 1;
  perPage = 10;
  isLoading = false;
  
  showFilterPopover = false; 
  selectedStatuses: string[] = [];
  availableStatuses: string[] = [];
  temporaryStatuses: string[] = [];
  totalResults = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private shipmentService: ShipmentService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
      this.loadShipments();
    });

    const handleScroll = debounce(this.onScroll.bind(this), 200);
    window.addEventListener('scroll', handleScroll);
  }
  parseDate(dateString:any) {
    const [day, month, year] = dateString.split('-').map(Number);
    const parseDate = new Date(year, month - 1, day);
    return  this.datePipe.transform(parseDate, 'MMM d, y') || '';
  }

  loadShipments() {
    this.isLoading = true;
    this.http.get('/assets/json/shipment-list.json').subscribe((data: any) => {
      this.shipments = data.Shipments.Shipment;
      this.availableStatuses = [...new Set(this.shipments.map(val => val.Status))];
      this.applyFilters();
      this.isLoading = false;
    });
  }

  applyFilters() {
    this.filteredShipments = this.shipments.filter(shipment => {
      const matchesStatuses = this.selectedStatuses.length === 0 || this.selectedStatuses.includes(shipment.Status);

      return (!this.queryParams.orderNo || shipment.OrderNo.toLowerCase() === this.queryParams.orderNo.toLowerCase()) &&
             (!this.queryParams.shipmentNo || shipment.ShipmentNo.toLowerCase() === this.queryParams.shipmentNo.toLowerCase()) &&
             (!this.queryParams.firstName || shipment.BillToAddress.FirstName.toLowerCase() === this.queryParams.firstName.toLowerCase()) &&
             (!this.queryParams.lastName || shipment.BillToAddress.LastName.toLowerCase() === this.queryParams.lastName.toLowerCase()) &&
             (!this.queryParams.email || shipment.BillToAddress.EMailID.toLowerCase() === this.queryParams.email.toLowerCase()) &&
             (!this.queryParams.phoneNumber || shipment.BillToAddress.DayPhone === this.queryParams.phoneNumber) &&
             matchesStatuses;
    });

    this.totalResults = this.filteredShipments.length;
    this.filteredShipments = this.filteredShipments.slice(0, this.page * this.perPage);
  }

  loadMoreShipments() {
    if (!this.isLoading) {
      this.page++;
      this.applyFilters();
    }
  }

  viewDetails(shipmentNo: string) {
    this.router.navigate(['/shipment/details', shipmentNo]);
  }

  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 2;

    if (scrollPosition >= threshold && !this.isLoading) {
      this.loadMoreShipments();
    }
  }

  toggleFilterPopover() {
    this.showFilterPopover = !this.showFilterPopover;
    this.temporaryStatuses = [...this.selectedStatuses]; 
  }

  toggleStatus(status: string) {
    if (this.temporaryStatuses.includes(status)) {
      this.temporaryStatuses = this.temporaryStatuses.filter(s => s !== status);
    } else {
      this.temporaryStatuses.push(status);
    }
  }

  applyStatusFilter() {
    this.selectedStatuses = [...this.temporaryStatuses]; 
    this.showFilterPopover = false;
    this.applyFilters();
  }

  resetStatusFilter() {
    this.temporaryStatuses = []; 
  }

  closeFilterPopover() {
    this.showFilterPopover = false;
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }
}
