import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Supply } from '../models/supply';

@Injectable({
  providedIn: 'root'
})
export class SupplyService {
  private apiUrl = 'https://localhost:7012/supplies';

  constructor(private http: HttpClient) {}

  getSupplies(): Observable<Supply[]> {
    return this.http.get<Supply[]>(this.apiUrl);
  }
}