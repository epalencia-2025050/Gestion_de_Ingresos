export type Role = 'admin' | 'user';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: Role;
  fechaCreacion: string;
}

export interface LoginResponse {
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}
