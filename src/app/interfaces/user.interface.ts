/**
 * Representa um usuário autenticado no sistema.
 *
 * Usado para controlar permissões, exibir informações no dashboard
 * e armazenar preferências individuais.
 */
export interface UserInterface {
  /**
   * UID único gerado pelo Firebase Authentication.
   */
  id: string;

  /**
   * E-mail do usuário (único no sistema).
   */
  email: string;

  /**
   * URL da foto do perfil (fornecida pelo Google ou outro provedor).
   */
  photoURL?: string;

  /**
   * Nome público do usuário.
   */
  displayName?: string;

  /**
   * Papel do usuário no sistema.
   * - `admin`: acesso completo
   * - `user`: acesso restrito
   */
  role?: UserType; //'admin' | 'user';

  /**
   * Telefone do usuário (pode vir do provedor OAuth).
   */
  phoneNumber?: string;

  /**
   * Data de criação da conta
   */
  createdAt: Date;

  /**
   * Último login realizado
   */
  lastLogin: Date;

  /**
   * Indica se a conta está ativa no sistema.
   */
  isActive?: boolean;

  /**
   * Preferências personalizadas do usuário (UI/UX).
   */
  settings?: {
    /**
     * Define se o usuário prefere o tema escuro.
     */
    darkMode?: boolean;

    /**
     * Define se o usuário permite receber notificações.
     */
    notifications?: boolean;
  };
}

/**
 * Retorna um objeto vazio de usuário com valores vazios.
 *
 * Usado para inicializar formulários ou stores
 * antes do login efetivo.
 */
export const getEmptyUser = (): UserInterface => {
  return {
    id: '',
    email: '',
    displayName: '',
    photoURL: '',
    role: UserType.User,
    phoneNumber: '',
    createdAt: new Date(),
    lastLogin: new Date(),
    isActive: true,
    settings: {
      darkMode: false,
      notifications: true,
    },
  };
};

export enum UserType {
  Admin = 'admin',
  User = 'user',
}

