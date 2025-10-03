import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-create-product',
  imports: [
    Card
  ],
  templateUrl: './create-product.html',
  styleUrl: './create-product.css'
})
export class CreateProduct {
  private router: Router = inject(Router)
  goHome(){
    this.router.navigate(['/principal']);
  }
}
