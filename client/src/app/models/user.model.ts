export const enum Role {
    visitor = "Visitor",
    contributor = "Contributor",
    admin = "Admin"
  }

export class User {

    id?: number;
    username?: string;
    email?: string;
    password?: string;
    role?: Role = Role.visitor;
    createdAt?: Date;
    updateAt?: Date;
  
    constructor(
      id: number = 0, 
      username: string = "", 
      email: string = "", 
      password: string = "", 
      role: Role = Role.visitor,
      createdAt: Date = null,
      updateAt: Date = null
    ) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.password = password;
      this.role = role;
      this.createdAt = createdAt;
      this.updateAt = updateAt;
    }

    public static newUser(){
      let user = new User();
      user.username = "asd";
      return user;
    }

    public static map(data): User {

      let user: User = new User();

      user.id = data.id;
      user.username = data.username;
      user.email = data.email;
      user.password = data.password;
      user.role = data.role;
      user.createdAt = data.createdAt;
      user.updateAt = data.updateAt;

      return user;
    }


    public static maps(data): User[] {

      let users: User[] = [];

      for (let index = 0; index < data.length; index++) {
        let u = new User();

        u.id = data[index].id;
        u.username = data[index].username;
        u.email = data[index].email;
        u.password = data[index].password;
        u.role = data[index].role;
        u.createdAt = data[index].createdAt;
        u.updateAt = data[index].updateAt;

        users.push(u);
      }

      return users;
    }

  }