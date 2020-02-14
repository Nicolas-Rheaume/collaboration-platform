export const enum Role {
    visitor,
    admin
  }

export class User {

    uid: number;
    username: string;
    email: string;
    password: string;
    role?: Role = Role.visitor;
  
    constructor() {
    }
  
  }