export class AuthService {
  constructor(password) {
    this.password = password;
  }

  login(inputPassword) {
    return inputPassword === this.password;
  }
}
