export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  password: string
}

export interface ChangePasswordData {
  old_password: string
  new_password: string
}
