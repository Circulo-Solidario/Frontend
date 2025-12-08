import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { Card } from 'primeng/card';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { SelectButton } from 'primeng/selectbutton';
import { MessageModule } from 'primeng/message';
import { DatePicker } from 'primeng/datepicker';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { timer } from 'rxjs';
import { Toasts } from '../../services/toasts';
import { Users } from '../../services/users';
import { ImagePost } from '../../models/images';
import { Images } from '../../services/images';
import { LoginService } from '../../services/login';

@Component({
  selector: 'app-create-profile',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ThemeSwitcher,
    Card,
    Button,
    InputText,
    SelectButton,
    MessageModule,
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    DatePicker,
    FileUpload,
    ThemeSwitcher
  ],
  templateUrl: './create-profile.html',
  styleUrl: './create-profile.css'
})
export class CreateProfile implements OnInit {
  private router: Router = inject(Router);
  private userService: Users = inject(Users);
  private imageService: Images = inject(Images);
  private loginService: LoginService = inject(LoginService);
  toastService: Toasts = inject(Toasts);
  userRolesOptions = [
    { label: 'Donante', value: 2 },
    { label: 'Donatario', value: 3 },
    { label: 'Observador', value: 4 },
  ];
  today: Date = new Date();
  charityForm: FormGroup;
  userForm: FormGroup;
  typeSelected: number = 1;
  uploadedFiles: any = [];
  uploadedPdfFiles: any = [];  // Para archivos PDF de organizaciones
  postUser: boolean = false;
  image: any;
  imageUrl: string = '';
  user: any;

  constructor() {
    const nav = this.router.currentNavigation();
    this.user = nav?.extras.state;
    this.userForm = new FormGroup({
      nombreApellido: new FormControl(this.user?.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25),
      ]),
      alias: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(25),
        Validators.required
      ]),
      fechaNacimiento: new FormControl(''),
      roles: new FormControl([], [Validators.required]),
    });
    this.charityForm = new FormGroup({
      nombreApellido: new FormControl(this.user?.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25),
      ]),
      alias: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(25),
        Validators.required
      ]),
      fechaNacimiento: new FormControl('')
    });
  }

  async ngOnInit(): Promise<void> {
    this.loginService.getLoggedUser().subscribe(
      (user: any) => {
        if (user != null) {
          this.router.navigate(['/principal']);
        }
      }
    );
    if (!this.user?.email || !this.user) {
      this.router.navigate(['/login']);
    }
    if (this.user?.imageUrl) {
      this.imageUrl = this.user.imageUrl;
    }
  }

  setImage(fileSelected: FileSelectEvent) {
    if (this.uploadedFiles.length == 0) {
      this.uploadedFiles.push(fileSelected.files[0]);
    } else {
      this.uploadedFiles[0] = fileSelected.files[0];
    }
    
    // Crear un FileReader para procesar la imagen correctamente en dispositivos móviles
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(fileSelected.files[0]);
  }

  clearImage() {
    if (this.uploadedFiles.length > 0) {
      this.uploadedFiles.pop();
    }
    this.imageUrl = '';
  }

  setPdfFile(fileSelected: FileSelectEvent) {
    if (this.uploadedPdfFiles.length == 0) {
      this.uploadedPdfFiles.push(fileSelected.files[0]);
    } else {
      this.uploadedPdfFiles[0] = fileSelected.files[0];
    }
  }

  clearPdfFile() {
    if (this.uploadedPdfFiles.length > 0) {
      this.uploadedPdfFiles.pop();
    }
  }

  changeType(type: number) {
    switch (type) {
      case 0: {
        this.typeSelected = 1;
        break;
      }
      case 1: {
        this.typeSelected = 2;
        break;
      }
    }
  }

  async onSubmit() {
    this.postUser = true;
    let account;
    
    account = {
      correo: this.user.email
    }

    switch (this.typeSelected) {
      case 1: {
        account = {
          ...account,
          tipoUsuario: 'USUARIO'
        };
        if (this.userForm.valid) {
          account = {
            ...account,
            ...this.userForm.value
          }
        }
        break;
      }
      case 2: {
        account = {
          ...account,
          tipoUsuario: 'ORGANIZACION'
        };
        if (this.charityForm.valid) {
          account = {
            ...account,
            ...this.charityForm.value
          }
        }
        break;
      }
    }

    let errorSavingImage = false;

    if (this.uploadedFiles[0] != this.image && this.uploadedFiles[0]) {
      const image: ImagePost = {
        image: this.uploadedFiles[0]
      }
      try {
        const response = await this.imageService.uploadImage(image);
        this.imageUrl = response.data.url;
        this.image = this.uploadedFiles[0];
      } catch (error) {
        errorSavingImage = true;
      }
    };

    if (this.imageUrl != '') {
      account = {
        ...account,
        urlImagen: this.imageUrl
      }
    }

    if (account.fechaNacimiento == '') {
      delete account.fechaNacimiento;
    }

    try {
      const response = await this.userService.registerUser(account);
      this.toastService.showToast({ severity: 'success', summary: 'Perfil creado!', detail: 'Perfil creado correctamente' });
      if (errorSavingImage) {
        this.toastService.showToast({ severity: 'warn', summary: 'Error al guardar imagen', detail: 'Puedes cargar nuevamente la imagen desde la edición del perfil' });
      }
      if (this.typeSelected == 2 && this.uploadedPdfFiles.length > 0) {
        this.userService.postDocumentes(response.id, this.uploadedPdfFiles[0]).subscribe({
          next: () => {
            this.toastService.showToast({ severity: 'success', summary: 'Documentos subidos!', detail: 'Documentos subidos correctamente' });
          },
          error: () => {
            this.toastService.showToast({ severity: 'warn', summary: 'Error al subir documentos', detail: 'No pudimos subir los documentos, puedes intentar nuevamente desde la edición del perfil' });
          }
        });
      }
      this.postUser = false;
      const userInfo = await this.userService.getUserInfo(this.user.email)
      this.loginService.setLoggedUser(userInfo);
      timer(500).subscribe(
        () => {
          this.router.navigateByUrl("/principal");
        }
      )
    } catch (error) {
      this.toastService.showToast({ severity: 'error', summary: 'Error al crear perfil', detail: 'Por favor intente nuevamente...' });
      this.postUser = false;
    }
  }
}
