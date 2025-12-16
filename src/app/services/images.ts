import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ImagePost } from '../models/images';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Images {
  //private readonly imageUrl: string = 'https://api.imgbb.com/1/upload'; Colocar esta URL para producción
  //private readonly imageUrl: string = '/api-imgbb/1/upload'; Colocar esta URL para desarrollo
  private readonly imageUrl: string = '/api-imgbb/1/upload';
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient){   
    this.httpClient = httpClient; 
  }

  async uploadImage(image: ImagePost): Promise<any>{
    const formData = new FormData();
    formData.append('key', environment.imageKey);
    formData.append('image', image.image);
    return await firstValueFrom(this.httpClient.post(this.imageUrl, formData));
  }
}
