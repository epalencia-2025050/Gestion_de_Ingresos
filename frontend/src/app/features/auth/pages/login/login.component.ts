import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import * as THREE from 'three';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: [`
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 25px rgba(23, 163, 152, 0.25); }
      50% { box-shadow: 0 0 45px rgba(245, 166, 35, 0.4); }
    }
    @keyframes panelEntrance {
      from { opacity: 0; transform: translateY(30px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .glass-panel {
      background: rgba(43, 45, 51, 0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(238, 241, 244, 0.18);
      animation: panelEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .glass-panel:hover {
      animation: pulseGlow 4s infinite alternate;
    }
  `]
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sphereCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly sessionExpiredMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly form: FormGroup;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationFrameId!: number;

  private bgMaterial!: THREE.ShaderMaterial;

  // Shader para simular el pliegue y textura de la seda en movimiento
  private vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  private fragmentShader = `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 p = vUv * 4.0 - vec2(2.0);
      
      // Deformación armónica para pliegues profundos de tela
      for(int i = 1; i < 6; i++) {
        float f = float(i);
        p.x += 0.4 / f * sin(f * 2.5 * p.y + uTime * 1.2 + float(i)*1.2);
        p.y += 0.4 / f * cos(f * 2.5 * p.x + uTime * 1.1 + float(i)*1.8);
      }

      float wave = sin(p.x * 1.5 + p.y * 1.5);
      float wave2 = cos(p.x * 2.0 - p.y * 1.0);

      // Paleta Oficial: #0F2C4C, #1E8A5D, #17A398, #F5A623
      vec3 azulMarino     = vec3(0.058, 0.172, 0.298);
      vec3 verdeEsmeralda = vec3(0.117, 0.541, 0.364);
      vec3 verdeAzulado   = vec3(0.090, 0.639, 0.596);
      vec3 ambar          = vec3(0.960, 0.650, 0.137);
      vec3 brilloBlanco   = vec3(0.933, 0.945, 0.957);

      // Mezcla de sombras y luces de los pliegues
      vec3 color = mix(azulMarino, verdeEsmeralda, smoothstep(-0.8, 0.8, wave));
      color = mix(color, verdeAzulado, smoothstep(-0.5, 0.9, wave2));
      
      // Reflejo especular satinado (Luces en las crestas de la tela)
      float highlight = pow(max(0.0, wave * wave2), 3.0);
      color = mix(color, ambar, highlight * 0.6);
      color += brilloBlanco * pow(highlight, 2.0) * 0.25;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    // Si authService tiene mensaje de expiración de sesión previo
    if (this.authService.sessionExpiredMessage()) {
      this.sessionExpiredMessage.set(this.authService.sessionExpiredMessage());
    }

    // Escuchar parámetros dinámicamente y limpiar la URL al detectar la flag
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired'] === 'true') {
        this.sessionExpiredMessage.set('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');

        // Remover el queryParam de la URL para evitar que persista en refrescos/recargas
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { sessionExpired: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.init3DScene();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) this.renderer.dispose();
  }

  private init3DScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 6;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Fondo animado de seda
    const bgGeo = new THREE.PlaneGeometry(16, 10);
    this.bgMaterial = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: { uTime: { value: 0 } },
      depthWrite: false
    });
    const bgMesh = new THREE.Mesh(bgGeo, this.bgMaterial);
    bgMesh.position.z = -4;
    this.scene.add(bgMesh);

    window.addEventListener('resize', this.onWindowResize);
    this.animate();
  }

  private onWindowResize = (): void => {
    if (!this.renderer || !this.camera) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    if (this.bgMaterial) {
      this.bgMaterial.uniforms['uTime'].value += 0.025;
    }

    this.renderer.render(this.scene, this.camera);
  };

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.sessionExpiredMessage.set(null);
    this.authService.sessionExpiredMessage.set(null);

    const { email, password } = this.form.getRawValue();

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Credenciales inválidas.');
      },
    });
  }
}