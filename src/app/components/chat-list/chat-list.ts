import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../services/login';
import { Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-chat-list',
  imports: [
    TabsModule
  ],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.css'
})
export class ChatList implements OnInit{
  private loginService: LoginService = inject(LoginService);
  private router: Router = inject(Router); 
  myProductsChats: any[] = [];
  myRequetsChats: any[] = [];
  logedUser: any;
  defaultTab = "1";

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
