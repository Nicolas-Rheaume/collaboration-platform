export enum UserRole {
	ADMIN = 'Admin',
	CONTRIBUTOR = 'Contributor',
	VISITOR = 'Visitor',
}

export class User {
	username?: string;
	email?: string;
	role?: UserRole = UserRole.VISITOR;
	createdAt?: Date;
	updateAt?: Date;

	constructor(username: string = '', email: string = '', role: UserRole = UserRole.VISITOR, createdAt: Date = null, updateAt: Date = null) {
		this.username = username;
		this.email = email;
		this.role = role;
		this.createdAt = createdAt;
		this.updateAt = updateAt;
	}

	public static newUser() {
		let user = new User();
		user.username = 'asd';
		return user;
	}

	public static map(data): User {
		let user: User = new User();

		user.username = data.username;
		user.email = data.email;
		user.role = data.role;
		user.createdAt = data.createdAt;
		user.updateAt = data.updateAt;

		return user;
	}

	public static maps(data): User[] {
		let users: User[] = [];

		for (let index = 0; index < data.length; index++) {
			let u = new User();

			u.username = data[index].username;
			u.email = data[index].email;
			u.role = data[index].role;
			u.createdAt = data[index].createdAt;
			u.updateAt = data[index].updateAt;

			users.push(u);
		}

		return users;
	}
}
