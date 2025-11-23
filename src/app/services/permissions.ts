import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  
  // Constantes de roles
  private readonly DONANTE = 2;
  private readonly DONATARIO = 3;
  private readonly VOLUNTARIO_OBSERVADOR = 4;

  // Mapeo de rutas y permisos requeridos
  private routePermissions: { [key: string]: any } = {
    // Productos
    '/principal/publicar-producto': { userTypes: ['USUARIO'], roles: [this.DONANTE] },
    '/principal/busqueda': { userTypes: ['USUARIO'], roles: [this.DONANTE, this.DONATARIO] },
    '/principal/detalles': { userTypes: ['USUARIO'], roles: [this.DONANTE, this.DONATARIO] },
    '/principal/mis-publicaciones': { userTypes: ['USUARIO'], roles: [this.DONANTE] },
    '/principal/editar-publicacion': { userTypes: ['USUARIO'], roles: [this.DONANTE] },
    '/principal/solicitudes': { userTypes: ['USUARIO'], roles: [this.DONANTE, this.DONATARIO] },
    
    // Chats  
    '/principal/chats': { userTypes: ['USUARIO'], roles: [this.DONANTE, this.DONATARIO] },
    '/principal/chats/mensajes': { userTypes: ['USUARIO'], roles: [this.DONANTE, this.DONATARIO] },
    
    // Personas en situación de calle
    '/principal/mapa': { userTypes: ['USUARIO', 'ORGANIZACION', 'ADMINISTRADOR'], roles: [this.VOLUNTARIO_OBSERVADOR], orgAccess: true, adminAccess: true },
    
    // Proyectos solidarios - Usuarios
    '/principal/proyectos': { userTypes: ['USUARIO', 'ORGANIZACION'], roles: [this.DONANTE, this.DONATARIO, this.VOLUNTARIO_OBSERVADOR], orgAccess: true },
    '/principal/detalles-proyecto': { userTypes: ['USUARIO', 'ORGANIZACION'], roles: [this.DONANTE, this.DONATARIO, this.VOLUNTARIO_OBSERVADOR], orgAccess: true },
    
    // Proyectos solidarios - Solo organizaciones
    '/principal/crear-proyecto': { userTypes: ['ORGANIZACION'], roles: [], orgAccess: true },
    '/principal/mis-proyectos': { userTypes: ['ORGANIZACION'], roles: [], orgAccess: true },
    '/principal/editar-proyecto': { userTypes: ['ORGANIZACION'], roles: [], orgAccess: true },
    
    // Rutas públicas (accesibles para todos los usuarios logueados)
    '/principal': { userTypes: ['USUARIO', 'ORGANIZACION', 'ADMINISTRADOR'], roles: [], public: true },
    '/principal/editar-perfil': { userTypes: ['USUARIO', 'ORGANIZACION'], roles: []},

    '/principal/validar-organizaciones': { userTypes: ['ADMINISTRADOR'], roles: [], public: true }
  };

  /**
   * Valida si el usuario tiene permisos para acceder a una ruta específica
   * @param user Usuario logueado
   * @param route Ruta a validar  
   * @returns true si tiene permisos, false si no
   */
  canAccessRoute(user: any, route: string): boolean {
    if (!user) return false;

    // Limpiar ruta para comparación
    const cleanRoute = this.cleanRoute(route);
    const permission = this.routePermissions[cleanRoute];
    
    // Si no hay permisos definidos para la ruta, denegar acceso
    if (!permission) return false;
    
    // Si es una ruta pública, permitir acceso
    if (permission.public) return true;

    // Verificar tipo de usuario
    if (!permission.userTypes.includes(user.tipoUsuario)) return false;

    // Si es organización y la ruta permite organizaciones, permitir acceso
    if (user.tipoUsuario === 'ORGANIZACION' && permission.orgAccess) return true;

    if (user.tipoUsuario === 'ADMINISTRADOR' && permission.adminAccess) return true;

    // Si no requiere roles específicos (ej: rutas de organización), permitir acceso
    if (permission.roles.length === 0) return true;

    // Verificar roles del usuario
    const userRoles = user.roles?.map((role: any) => role.id) || [];
    return permission.roles.some((requiredRole: number) => userRoles.includes(requiredRole));
  }

  /**
   * Limpia la ruta para comparación (remueve parámetros de query)
   */
  private cleanRoute(route: string): string {
    return route.split('?')[0];
  }
}