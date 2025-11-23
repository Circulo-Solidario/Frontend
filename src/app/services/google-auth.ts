import { inject, Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuth {
  private auth = inject(Auth);

  async loginWithGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (err: any) {
      // Si el usuario cancela, retornar null sin mostrar error
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        return null;
      }
      console.error('Error en login:', err);
      return null;
    }
  }
}
