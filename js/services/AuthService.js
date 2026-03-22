import { SecurityUtils } from './SecurityUtils.js';

export class AuthService {
  constructor(passwordHash) {
    this.passwordHash = passwordHash;
  }

  async login(inputPassword) {
    const inputHash = await SecurityUtils.hashPassword(inputPassword);
    return inputHash === this.passwordHash;
  }
}
