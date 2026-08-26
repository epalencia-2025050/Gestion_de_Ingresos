import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  computed,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../../../core/services/auth.service';
import { FinanzasService } from '../../../../core/services/finanzas.service';
import { Gasto, Ingreso } from '../../../../core/models/finanzas.model';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('donutCanvas') donutCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendCanvas') trendCanvas!: ElementRef<HTMLCanvasElement>;

  private donutChart: Chart | null = null;
  private trendChart: Chart | null = null;

  // Modales y vistas activas
  readonly activeView = signal<'dashboard' | 'history' | 'reports' | 'config'>('dashboard');
  readonly showIncomeModal = signal(false);
  readonly showExpenseModal = signal(false);
  readonly showDeleteConfirm = signal<{ type: 'ingreso' | 'gasto'; id: number; title: string } | null>(null);
  readonly editingItem = signal<{ type: 'ingreso' | 'gasto'; data: Ingreso | Gasto } | null>(null);
  readonly mobileSidebarOpen = signal(false);

  // Panel de Notificaciones
  readonly showNotifications = signal(false);
  readonly unreadNotificationsCount = computed(() => {
    return this.finanzasService.notifications().filter((n) => !n.leida).length;
  });

  // Modal para cambiar avatar de perfil
  readonly showAvatarModal = signal(false);
  readonly newAvatarUrlInput = signal('');
  readonly predefinedAvatars = [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
  ];

  // Formulario reactivo para búsqueda
  readonly searchControl = signal('');
  readonly showSearchDropdown = signal(false);

  // Formularios reactivos de Ingreso y Gasto
  incomeForm!: FormGroup;
  expenseForm!: FormGroup;
  formSubmitting = signal(false);
  formError = signal<string | null>(null);
  formSuccess = signal<string | null>(null);

  // Filtros de historial
  readonly historyFilter = signal<'all' | 'ingreso' | 'gasto'>('all');
  readonly historyCategoryFilter = signal<string>('all');

  // Categorías predefinidas
  readonly standardCategories = ['Vivienda', 'Alimentación', 'Transporte', 'Otros'];

  // Lista combinada de transacciones filtradas por búsqueda
  readonly filteredTransactions = computed(() => {
    const query = this.searchControl().toLowerCase().trim();
    const typeFilter = this.historyFilter();
    const catFilter = this.historyCategoryFilter();

    const incomes = this.finanzasService.ingresos().map((i) => ({
      ...i,
      transactionType: 'ingreso' as const,
    }));

    const expenses = this.finanzasService.gastos().map((g) => ({
      ...g,
      transactionType: 'gasto' as const,
    }));

    let combined: Array<(Ingreso | Gasto) & { transactionType: 'ingreso' | 'gasto' }> = [];

    if (typeFilter === 'all' || typeFilter === 'ingreso') {
      combined.push(...incomes);
    }
    if (typeFilter === 'all' || typeFilter === 'gasto') {
      combined.push(...expenses);
    }

    // Ordenar por fecha descendente
    combined.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    if (catFilter !== 'all') {
      combined = combined.filter(
        (t) => t.categoria.toLowerCase() === catFilter.toLowerCase(),
      );
    }

    if (query) {
      combined = combined.filter(
        (t) =>
          t.descripcion.toLowerCase().includes(query) ||
          t.categoria.toLowerCase().includes(query) ||
          t.estado.toLowerCase().includes(query) ||
          t.monto.toString().includes(query) ||
          t.fecha.includes(query),
      );
    }

    return combined;
  });

  constructor(
    readonly authService: AuthService,
    readonly finanzasService: FinanzasService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
  ) {
    // Efecto reactivo para actualizar los gráficos cuando los datos cambien
    effect(() => {
      const cats = this.finanzasService.categorias();
      if (this.donutCanvas && cats.length > 0) {
        this.updateDonutChart();
      }
    });

    effect(() => {
      const trend = this.finanzasService.tendencia();
      if (this.trendCanvas && trend.length > 0) {
        this.updateTrendChart();
      }
    });
  }

  ngOnInit(): void {
    this.initForms();
    this.finanzasService.loadAll();
  }

  ngAfterViewInit(): void {
    // Inicializar gráficos después de que el DOM esté listo
    setTimeout(() => {
      this.initDonutChart();
      this.initTrendChart();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private initForms(): void {
    const today = new Date().toISOString().split('T')[0];

    this.incomeForm = this.fb.group({
      monto: [null, [Validators.required, Validators.min(0.01)]],
      descripcion: ['', [Validators.required, Validators.minLength(2)]],
      fecha: [today, Validators.required],
      categoria: ['Salario', Validators.required],
      estado: ['completado', Validators.required],
    });

    this.expenseForm = this.fb.group({
      monto: [null, [Validators.required, Validators.min(0.01)]],
      descripcion: ['', [Validators.required, Validators.minLength(2)]],
      fecha: [today, Validators.required],
      categoria: ['Alimentación', Validators.required],
      estado: ['pagado', Validators.required],
    });
  }

  // --- Gráfica Donut (Gastos por categorías) ---
  private initDonutChart(): void {
    if (!this.donutCanvas) return;
    const ctx = this.donutCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.donutChart) {
      this.donutChart.destroy();
    }

    const cats = this.finanzasService.categorias();
    const labels = cats.map((c) => c.categoria);
    const data = cats.map((c) => c.total > 0 ? c.total : 0.0001); // Evitar donut vacío
    const backgroundColors = ['#0b3d4a', '#f5a324', '#1ea6b6', '#ffffff'];

    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels.length ? labels : ['Vivienda', 'Alimentación', 'Transporte', 'Otros'],
        datasets: [
          {
            data: data.length ? data : [40, 30, 20, 10],
            backgroundColor: backgroundColors,
            borderColor: '#13626e',
            borderWidth: 3,
            hoverOffset: 6,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            display: false, // Usamos la leyenda customizada idéntica a la imagen
          },
          tooltip: {
            backgroundColor: '#08323d',
            titleColor: '#ffffff',
            bodyColor: '#95b5bc',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const total = context.parsed;
                return ` ${context.label}: Q${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
              },
            },
          },
        },
      },
    });
  }

  private updateDonutChart(): void {
    if (!this.donutChart) {
      this.initDonutChart();
      return;
    }

    const cats = this.finanzasService.categorias();
    this.donutChart.data.labels = cats.map((c) => c.categoria);
    this.donutChart.data.datasets[0].data = cats.map((c) => c.total);
    this.donutChart.update();
  }

  // --- Gráfica de Barras (Tendencia de ahorro vs gasto) ---
  private initTrendChart(): void {
    if (!this.trendCanvas) return;
    const ctx = this.trendCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.trendChart) {
      this.trendChart.destroy();
    }

    const trend = this.finanzasService.tendencia();
    const labels = trend.map((t) => t.mes);
    const data = trend.map((t) => t.valorGrafica);

    this.trendChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.length ? labels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Tendencia',
            data: data.length ? data : [75, 60, 45, 30, 60, 45, 75, 60, 30, 60, 45, 45],
            backgroundColor: '#dca044',
            hoverBackgroundColor: '#f5a324',
            borderRadius: {
              topLeft: 6,
              topRight: 6,
              bottomLeft: 0,
              bottomRight: 0,
            },
            borderSkipped: false,
            barPercentage: 0.75,
            categoryPercentage: 0.85,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#08323d',
            titleColor: '#ffffff',
            bodyColor: '#f5a324',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              title: (items) => {
                const idx = items[0]?.dataIndex ?? 0;
                const item = this.finanzasService.tendencia()[idx];
                return item ? `${item.mesCompleto} ${item.ano}` : items[0]?.label ?? '';
              },
              label: (context) => {
                const idx = context.dataIndex;
                const item = this.finanzasService.tendencia()[idx];
                if (item) {
                  return [
                    `Ingresos: Q${item.ingresos.toLocaleString('en-US')}`,
                    `Gastos: Q${item.gastos.toLocaleString('en-US')}`,
                    `Ahorro: Q${item.ahorro.toLocaleString('en-US')}`,
                  ];
                }
                return `Valor: ${context.parsed.y}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#8fa7ad',
              font: {
                size: 11,
                family: 'Plus Jakarta Sans',
              },
            },
            border: {
              display: false,
            },
          },
          y: {
            min: 0,
            max: 80,
            ticks: {
              stepSize: 20,
              color: '#8fa7ad',
              font: {
                size: 11,
                family: 'Plus Jakarta Sans',
              },
            },
            grid: {
              color: 'rgba(25, 107, 121, 0.35)',
            },
            border: {
              display: false,
            },
          },
        },
      },
    });
  }

  private updateTrendChart(): void {
    if (!this.trendChart) {
      this.initTrendChart();
      return;
    }

    const trend = this.finanzasService.tendencia();
    this.trendChart.data.labels = trend.map((t) => t.mes);
    this.trendChart.data.datasets[0].data = trend.map((t) => t.valorGrafica);
    this.trendChart.update();
  }

  private destroyCharts(): void {
    if (this.donutChart) {
      this.donutChart.destroy();
      this.donutChart = null;
    }
    if (this.trendChart) {
      this.trendChart.destroy();
      this.trendChart = null;
    }
  }

  // --- Manejo de Navegación & Vistas ---
  setView(view: 'dashboard' | 'history' | 'reports' | 'config'): void {
    this.activeView.set(view);
    this.mobileSidebarOpen.set(false);

    if (view === 'dashboard') {
      setTimeout(() => {
        this.initDonutChart();
        this.initTrendChart();
      }, 50);
    }
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen.update((v) => !v);
  }

  // --- Modales de Crear / Editar ---
  openAddIncomeModal(): void {
    this.editingItem.set(null);
    this.formError.set(null);
    this.formSuccess.set(null);
    this.incomeForm.reset({
      monto: null,
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      categoria: 'Salario',
      estado: 'completado',
    });
    this.showIncomeModal.set(true);
    this.mobileSidebarOpen.set(false);
  }

  openAddExpenseModal(): void {
    this.editingItem.set(null);
    this.formError.set(null);
    this.formSuccess.set(null);
    this.expenseForm.reset({
      monto: null,
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      categoria: 'Alimentación',
      estado: 'pagado',
    });
    this.showExpenseModal.set(true);
    this.mobileSidebarOpen.set(false);
  }

  openEditModal(item: (Ingreso | Gasto) & { transactionType: 'ingreso' | 'gasto' }): void {
    this.formError.set(null);
    this.formSuccess.set(null);
    this.editingItem.set({ type: item.transactionType, data: item });

    if (item.transactionType === 'ingreso') {
      this.incomeForm.patchValue({
        monto: item.monto,
        descripcion: item.descripcion,
        fecha: item.fecha.split('T')[0],
        categoria: item.categoria,
        estado: item.estado,
      });
      this.showIncomeModal.set(true);
    } else {
      this.expenseForm.patchValue({
        monto: item.monto,
        descripcion: item.descripcion,
        fecha: item.fecha.split('T')[0],
        categoria: item.categoria,
        estado: item.estado,
      });
      this.showExpenseModal.set(true);
    }
  }

  closeModals(): void {
    this.showIncomeModal.set(false);
    this.showExpenseModal.set(false);
    this.showDeleteConfirm.set(null);
    this.editingItem.set(null);
    this.formError.set(null);
    this.formSuccess.set(null);
  }

  // --- Guardar Ingreso ---
  saveIncome(): void {
    if (this.incomeForm.invalid) {
      this.incomeForm.markAllAsTouched();
      return;
    }

    this.formSubmitting.set(true);
    this.formError.set(null);

    const values = this.incomeForm.value;
    const isEdit = this.editingItem();

    if (isEdit && isEdit.type === 'ingreso') {
      this.finanzasService.updateIngreso(isEdit.data.id, values).subscribe({
        next: () => {
          this.formSubmitting.set(false);
          this.closeModals();
        },
        error: (err) => {
          this.formSubmitting.set(false);
          this.formError.set(err?.error?.message || 'Error al actualizar ingreso');
        },
      });
    } else {
      this.finanzasService.createIngreso(values).subscribe({
        next: () => {
          this.formSubmitting.set(false);
          this.closeModals();
        },
        error: (err) => {
          this.formSubmitting.set(false);
          this.formError.set(err?.error?.message || 'Error al registrar ingreso');
        },
      });
    }
  }

  // --- Guardar Gasto ---
  saveExpense(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    this.formSubmitting.set(true);
    this.formError.set(null);

    const values = this.expenseForm.value;
    const isEdit = this.editingItem();

    if (isEdit && isEdit.type === 'gasto') {
      this.finanzasService.updateGasto(isEdit.data.id, values).subscribe({
        next: () => {
          this.formSubmitting.set(false);
          this.closeModals();
        },
        error: (err) => {
          this.formSubmitting.set(false);
          this.formError.set(err?.error?.message || 'Error al actualizar gasto');
        },
      });
    } else {
      this.finanzasService.createGasto(values).subscribe({
        next: () => {
          this.formSubmitting.set(false);
          this.closeModals();
        },
        error: (err) => {
          this.formSubmitting.set(false);
          this.formError.set(err?.error?.message || 'Error al registrar gasto');
        },
      });
    }
  }

  // --- Confirmar y Ejecutar Eliminación ---
  confirmDelete(item: (Ingreso | Gasto) & { transactionType: 'ingreso' | 'gasto' }): void {
    this.showDeleteConfirm.set({
      type: item.transactionType,
      id: item.id,
      title: item.descripcion,
    });
  }

  executeDelete(): void {
    const toDelete = this.showDeleteConfirm();
    if (!toDelete) return;

    this.formSubmitting.set(true);

    const obs =
      toDelete.type === 'ingreso'
        ? this.finanzasService.deleteIngreso(toDelete.id)
        : this.finanzasService.deleteGasto(toDelete.id);

    obs.subscribe({
      next: () => {
        this.formSubmitting.set(false);
        this.showDeleteConfirm.set(null);
      },
      error: (err) => {
        this.formSubmitting.set(false);
        this.formError.set(err?.error?.message || 'Error al eliminar registro');
      },
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchControl.set(input.value);
    this.showSearchDropdown.set(input.value.trim().length > 0);
  }

  selectSearchResult(item: (Ingreso | Gasto) & { transactionType: 'ingreso' | 'gasto' }): void {
    this.showSearchDropdown.set(false);
    this.openEditModal(item);
  }

  // --- Manejo de Notificaciones ---
  toggleNotifications(): void {
    const isShowing = this.showNotifications();
    this.showNotifications.set(!isShowing);
    if (!isShowing) {
      this.finanzasService.markNotificationsAsRead();
    }
  }

  clearAllNotifications(): void {
    this.finanzasService.clearNotifications();
  }

  // --- Manejo de Avatar de Usuario ---
  openAvatarModal(): void {
    this.newAvatarUrlInput.set(this.finanzasService.userAvatar());
    this.showAvatarModal.set(true);
  }

  choosePredefinedAvatar(url: string): void {
    this.finanzasService.setAvatar(url);
    this.showAvatarModal.set(false);
  }

  saveCustomAvatarUrl(): void {
    const url = this.newAvatarUrlInput().trim();
    if (url) {
      this.finanzasService.setAvatar(url);
      this.showAvatarModal.set(false);
    }
  }

  onAvatarFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.finanzasService.setAvatar(base64);
        this.showAvatarModal.set(false);
      };
      reader.readAsDataURL(file);
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  // Format currency helper
  formatMoney(amount: number | undefined): string {
    if (amount === undefined || isNaN(amount)) return 'Q0.00';
    return (
      'Q' +
      amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
}
