import { type User } from "@shared/types";
import { type RegisterRequest } from "@shared/api";
import { randomUUID } from "crypto";

// NOTE: This storage class is deprecated and will be removed
// when Pocketbase integration is complete. Use pocketbaseService.ts instead.

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: RegisterRequest): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(registerData: RegisterRequest): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      username: registerData.username,
      email: registerData.email,
      verified: false,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
