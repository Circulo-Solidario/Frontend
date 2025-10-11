import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Products {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly apiPath = '/productos';
  private idProduct: any;

  publishProduct(product: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}${this.apiPath}/donador`, product);
  }

  getProducts(filters: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}`, { params: filters });
  }

  getProductDetail(id: any): Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}/${id}`);
  }

  setIdProducto(id: any){
    this.idProduct = id;
  }

  getIdProduct(): any{
    return this.idProduct;
  }
}
