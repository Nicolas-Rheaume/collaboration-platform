export const enum Role {
    visitor,
    admin
  }

export class User {

    id?: number;
    username: string;
    email?: string;
    password?: string;
    role?: Role = Role.visitor;
    createdAt?: Date;
    updateAt?: Date;
  
    constructor(
      id: number = 0, 
      username: string = "asd", 
      email: string = "", 
      password: string = "", 
      role: Role = Role.visitor, 
    ) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.password = password;
      this.role = role;
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

        users.push(u);
      }

      return users;
    }

  }