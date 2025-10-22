import { Component, inject, OnInit } from '@angular/core';
import { ScrollTop } from 'primeng/scrolltop';
import { LoginService } from '../../services/login';
import { Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-requests-list',
  imports: [
    ScrollTop,
    TabsModule 
  ],
  templateUrl: './requests-list.html',
  styleUrl: './requests-list.css'
})
export class RequestsList implements OnInit{
  private loginService: LoginService = inject(LoginService);
  private router: Router = inject(Router);
  logedUser: any;
  defaultTab: string = "0";

  ngOnInit(): void {
    this.loginService.getLoggedUser().subscribe((user: any) => {
      this.logedUser = user;
      if (user == null) {
        this.router.navigate(['/login']);
      }
    });
  }

  goHome() {
    this.router.navigate(['/principal']);
  }

}
