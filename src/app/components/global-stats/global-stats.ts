import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { Statistics } from '../../services/statistics';
import { Toasts } from '../../services/toasts';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

interface StatsData {
  usuarios: {
    cantidadRegistrados: number;
    cantidadPorTipo: Record<string, number>;
    usuariosUserPorRol: Record<string, number>;
  };
  productos: {
    cantidadPublicados: number;
    cantidadPorEstado: Record<string, number>;
    cantidadPorCategoria: Record<string, number>;
    topUsuariosConMasEntregados: Array<{ usuarioId: number; nombreUsuario: string; cantidadProductosEntregados: number }>;
  };
  proyectosSolidarios: {
    cantidadPublicados: number;
    totalRecaudado: number;
    cantidadPorEstado: Record<string, number>;
    topUsuariosConMasDonaciones: Array<{ usuarioId: number; nombreUsuario: string; totalDonaciones: number }>;
    recaudoPorDia: Record<string, number>;
  };
  puntos: {
    cantidadTotal: number;
    cantidadPorEstado: Record<string, number>;
  };
}

@Component({
  selector: 'app-global-stats',
  imports: [CommonModule, ChartModule, TableModule],
  templateUrl: './global-stats.html',
  styleUrl: './global-stats.css',
})
export class GlobalStats implements OnInit {
  private statisticsService: Statistics = inject(Statistics);
  private toastService: Toasts = inject(Toasts);
  private router = inject(Router);

  statsData: StatsData | null = null;
  loading: boolean = true;

  // Gráficos
  usuariosTipoChart: any;
  usuariosRolChart: any;
  productosEstadoChart: any;
  productosCategoriaChart: any;
  proyectosEstadoChart: any;
  proyectosRecaudoChart: any;
  puntosEstadoChart: any;

  ngOnInit(): void {
    this.loadGlobalStats();
  }

  async loadGlobalStats(): Promise<void> {
    try {
      this.loading = true;
      this.statsData = await firstValueFrom(this.statisticsService.getGlobalStats());
      
      if (this.statsData) {
        this.initializeCharts();
        this.toastService.showToast({ 
          severity: 'success', 
          summary: 'Estadísticas', 
          detail: 'Estadísticas globales cargadas correctamente' 
        });
      }
    } catch (error) {
      console.error('Error al obtener estadísticas globales:', error);
      this.toastService.showToast({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No se pudieron obtener las estadísticas globales' 
      });
    } finally {
      this.loading = false;
    }
  }

  private initializeCharts(): void {
    if (!this.statsData) return;

    const textColor = this.getPrimeNGColor('--p-text-color');
    const defaultOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: {
              weight: 500
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            color: textColor
          },
          grid: {
            color: this.getPrimeNGColor('--p-content-border-color')
          }
        },
        x: {
          ticks: {
            color: textColor
          },
          grid: {
            color: this.getPrimeNGColor('--p-content-border-color')
          }
        }
      }
    };

    // Gráfico de Usuarios por Tipo (Torta)
    this.usuariosTipoChart = {
      labels: Object.keys(this.statsData.usuarios.cantidadPorTipo || {}),
      datasets: [{
        data: Object.values(this.statsData.usuarios.cantidadPorTipo || {}),
        backgroundColor: [
          this.getPrimeNGColor('--p-blue-500'),
          this.getPrimeNGColor('--p-green-500'),
          this.getPrimeNGColor('--p-amber-500'),
          this.getPrimeNGColor('--p-red-500')
        ],
        borderColor: this.getPrimeNGColor('--p-content-border-color'),
        borderWidth: 2
      }],
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: {
                weight: 500
              }
            }
          }
        }
      }
    };

    // Gráfico de Usuarios por Rol (Barras)
    this.usuariosRolChart = {
      labels: Object.keys(this.statsData.usuarios.usuariosUserPorRol || {}),
      datasets: [{
        label: 'Cantidad de Usuarios',
        data: Object.values(this.statsData.usuarios.usuariosUserPorRol || {}),
        backgroundColor: this.getPrimeNGColor('--p-blue-500'),
        borderColor: '#1F2937',
        borderWidth: 1
      }],
      options: {
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            ticks: {
              color: textColor
            },
            grid: {
              color: this.getPrimeNGColor('--p-content-border-color')
            }
          },
          x: {
            ticks: {
              color: textColor
            },
            grid: {
              color: this.getPrimeNGColor('--p-content-border-color')
            }
          }
        }
      }
    };

    // Gráfico de Productos por Estado (Torta)
    this.productosEstadoChart = {
      labels: Object.keys(this.statsData.productos.cantidadPorEstado || {}),
      datasets: [{
        data: Object.values(this.statsData.productos.cantidadPorEstado || {}),
        backgroundColor: [
          this.getPrimeNGColor('--p-green-500'),
          this.getPrimeNGColor('--p-blue-500'),
          this.getPrimeNGColor('--p-amber-500'),
          this.getPrimeNGColor('--p-red-500')
        ],
        borderColor: this.getPrimeNGColor('--p-content-border-color'),
        borderWidth: 2
      }],
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: {
                weight: 500
              }
            }
          }
        }
      }
    };

    // Gráfico de Productos por Categoría (Barras)
    this.productosCategoriaChart = {
      labels: Object.keys(this.statsData.productos.cantidadPorCategoria || {}),
      datasets: [{
        label: 'Cantidad de Productos',
        data: Object.values(this.statsData.productos.cantidadPorCategoria || {}),
        backgroundColor: this.getPrimeNGColor('--p-green-500'),
        borderColor: '#1F2937',
        borderWidth: 1
      }],
      options: {
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            ticks: {
              color: textColor
            },
            grid: {
              color: this.getPrimeNGColor('--p-content-border-color')
            }
          },
          x: {
            ticks: {
              color: textColor
            },
            grid: {
              color: this.getPrimeNGColor('--p-content-border-color')
            }
          }
        }
      }
    };

    // Gráfico de Proyectos por Estado (Barras)
    this.proyectosEstadoChart = {
      labels: Object.keys(this.statsData.proyectosSolidarios.cantidadPorEstado || {}),
      datasets: [{
        label: 'Cantidad de Proyectos',
        data: Object.values(this.statsData.proyectosSolidarios.cantidadPorEstado || {}),
        backgroundColor: this.getPrimeNGColor('--p-amber-500'),
        borderColor: '#1F2937',
        borderWidth: 1
      }],
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            ticks: {
              color: textColor
            },
            grid: {
              color: this.getPrimeNGColor('--p-content-border-color')
            }
          },
          x: {
            ticks: {
              color: textColor
            },
            grid: {
              color: this.getPrimeNGColor('--p-content-border-color')
            }
          }
        }
      }
    };

    // Gráfico de Recaudo por Día (Histograma/Barras)
    const recaudoPorDia = this.statsData.proyectosSolidarios.recaudoPorDia || {};
    const sortedDates = Object.keys(recaudoPorDia).sort();
    this.proyectosRecaudoChart = {
      labels: sortedDates,
      datasets: [{
        label: 'Recaudo por Día',
        data: sortedDates.map(date => recaudoPorDia[date]),
        backgroundColor: this.getPrimeNGColor('--p-purple-500'),
        borderColor: '#1F2937',
        borderWidth: 1
      }],
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            ticks: {
              color: textColor
            },
            grid: {
              color: this.getPrimeNGColor('--p-content-border-color')
            }
          },
          x: {
            ticks: {
              color: textColor
            },
            grid: {
              color: this.getPrimeNGColor('--p-content-border-color')
            }
          }
        }
      }
    };

    // Gráfico de Puntos por Estado (Torta)
    this.puntosEstadoChart = {
      labels: Object.keys(this.statsData.puntos.cantidadPorEstado || {}),
      datasets: [{
        data: Object.values(this.statsData.puntos.cantidadPorEstado || {}),
        backgroundColor: [
          this.getPrimeNGColor('--p-red-500'),
          this.getPrimeNGColor('--p-blue-500')
        ],
        borderColor: this.getPrimeNGColor('--p-content-border-color'),
        borderWidth: 2
      }],
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: {
                weight: 500
              }
            }
          }
        }
      }
    };
  }

  // Métodos auxiliares para validar datos
  hasData(data: any): boolean {
    if (data == null) return false;

    if (Array.isArray(data)) {
      return data.length > 0 && data.some((item) => {
        if (item == null) return false;
        if (typeof item === 'number') return item !== 0;
        if (typeof item === 'string') return !isNaN(Number(item)) ? Number(item) !== 0 : item.trim().length > 0;
        if (Array.isArray(item)) return item.length > 0;
        if (typeof item === 'object') return Object.keys(item).length > 0;
        return true;
      });
    }

    if (typeof data === 'object') {
      const values = Object.values(data);
      if (values.length === 0) return false;
      for (const v of values) {
        if (v == null) continue;
        if (typeof v === 'number' && v !== 0) return true;
        if (typeof v === 'string') {
          const n = Number(v);
          if (!isNaN(n) && n !== 0) return true;
          if (v.trim().length > 0) return true;
        }
        if (Array.isArray(v) && v.length > 0) return true;
        if (typeof v === 'object' && Object.keys(v).length > 0) {
          if (this.hasData(v)) return true;
        }
      }
      return false;
    }

    if (typeof data === 'number') return data !== 0;
    if (typeof data === 'string') return data.trim().length > 0;
    return true;
  }

  isEmptyArray(arr: any[]): boolean {
    return !arr || arr.length === 0;
  }

  goHome() {
    this.router.navigate(['/principal']);
  }

  private getPrimeNGColor(cssVariable: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(cssVariable).trim();
  }
}
