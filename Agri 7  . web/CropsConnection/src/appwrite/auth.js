import { Client, Account, ID } from "appwrite";
import conf, { isAppwriteConfigured } from "./conf";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    if (isAppwriteConfigured) {
      this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
    }
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      if (userAccount) {
        return this.login({ email, password });
      }
      return userAccount;
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    if (!isAppwriteConfigured) return null;

    try {
      return await this.account.get();
    } catch (error) {
      return null;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
