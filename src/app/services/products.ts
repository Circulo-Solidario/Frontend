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
    return this.httpClient.post(`${environment.apiUrl}${this.apiPath}`, product);
  }

  getProducts(filters: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}`, { params: filters });
  }

  getProductDetail(id: any): Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}/${id}`);
  }

  getDonorsProducts(id: any): Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}${this.apiPath}/usuario-donador/${id}`)
  }

  deleteProduct(id: any): Observable<void>{
    return this.httpClient.delete<void>(`${environment.apiUrl}${this.apiPath}/${id}`)
  }

  editProduct(id: any, product: any): Observable<any>{
    return this.httpClient.put(`${environment.apiUrl}${this.apiPath}/${id}`, product);
  }

  setIdProducto(id: any){
    this.idProduct = id;
  }

  getIdProduct(): any{
    return this.idProduct;
  }
}
