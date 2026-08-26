import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { User } from '../../../../core/models/user.model';

interface UsersResponse {
  data: User[];
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users.component.html',
})
export class AdminUsersComponent implements OnInit {
  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    // El jwtInterceptor adjunta el token automaticamente.
    // El backend valida ademas, con roleMiddleware(['admin']), que
    // quien llama sea realmente un administrador.
    this.http.get<UsersResponse>(`${environment.apiUrl}/auth/users`).subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message ?? 'No se pudo cargar la lista de usuarios.');
        this.loading.set(false);
      },
    });
  }
}
