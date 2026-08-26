import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository';
import { toPublicUser, UserPublic } from '../models/user.model';
import { signAccessToken } from '../utils/jwt.util';
import { ConflictError, UnauthorizedError } from '../utils/errors';

const SALT_ROUNDS = 10;

export interface LoginResult {
  token: string;
  user: UserPublic;
}

export class AuthService {
  /**
   * Valida credenciales y, si son correctas, genera un JWT que incluye el rol.
   */
  async login(email: string, password: string): Promise<LoginResult> {
    const user = await userRepository.findByEmail(email.toLowerCase().trim());

    // Importante: usar el mismo mensaje de error tanto si el email no existe
    // como si la contrasena es incorrecta, para no revelar informacion.
    if (!user || !user.activo) {
      throw new UnauthorizedError('Email o contrasena incorrectos');
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new UnauthorizedError('Email o contrasena incorrectos');
    }

    const token = signAccessToken({ sub: user.id, email: user.email, rol: user.rol });

    return { token, user: toPublicUser(user) };
  }

  /**
   * Registro publico de un nuevo usuario. SIEMPRE crea con rol 'user':
   * la promocion a 'admin' se hace desde un endpoint protegido por
   * roleMiddleware(['admin']) o directamente en base de datos, nunca
   * dejando que el propio usuario elija su rol.
   */
  async register(nombre: string, email: string, password: string): Promise<UserPublic> {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new ConflictError('Ya existe un usuario registrado con ese email');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const created = await userRepository.create(nombre.trim(), normalizedEmail, passwordHash, 'user');

    return toPublicUser(created);
  }

  async getProfile(userId: number): Promise<UserPublic> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('Usuario no encontrado');
    }
    return toPublicUser(user);
  }

  /**
   * Solo deberia exponerse detras de roleMiddleware(['admin']).
   */
  async listUsers(): Promise<UserPublic[]> {
    const users = await userRepository.findAll();
    return users.map(toPublicUser);
  }
}

export const authService = new AuthService();
