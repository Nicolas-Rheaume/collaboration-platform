/*****************************************************************************
 *  USER ROLE
 *****************************************************************************/
export enum UserRole {
	ADMIN = 'Admin',
	CONTRIBUTOR = 'Contributor',
	VISITOR = 'Visitor',
}

/*****************************************************************************
 *  USER TYPE FOR THE CLIENT SIDE
 *****************************************************************************/
export class User {
	// Variables
	public username?: string;
	public email?: string;
	public role?: UserRole;
	public createdAt?: Date;
	public updatedAt?: Date;

	// Constructor
	constructor(username = '', email = '', role: UserRole = UserRole.VISITOR, createdAt: Date = null, updatedAt: Date = null) {
		this.username = username;
		this.email = email;
		this.role = role;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	// Get Entity
	public async getEntity(): Promise<UserEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(new UserEntity(0, this.username, this.email, '', this.role, null, null, this.createdAt, this.updatedAt));
			} catch (err) {
				reject(err);
			}
		});
	}

	// Set Entity
	public async setEntity(user: UserEntity): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				this.username = user.username;
				this.email = user.email;
				this.role = user.role;
				this.createdAt = user.createdAt;
				this.updatedAt = user.updatedAt;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	// Get JSON
	public async getJSON(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve({
					username: this.username,
					email: this.email,
					role: this.role,
					createdAt: this.createdAt,
					updatedAt: this.updatedAt,
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	// Set JSON
	public async setJSON(json: any): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				if (json.hasOwnProperty('username')) this.username = json.username;
				if (json.hasOwnProperty('email')) this.email = json.email;
				if (json.hasOwnProperty('role')) this.role = json.role;
				if (json.hasOwnProperty('createdAt')) this.createdAt = json.createdAt;
				if (json.hasOwnProperty('updatedAt')) this.updatedAt = json.updatedAt;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}
}

/*****************************************************************************
 *  USER ENTITY FOR THE SERVER SIDE
 *****************************************************************************/
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Repository, OneToMany } from 'typeorm';
import { DocumentEntity } from '../document/document.entity';
import { TextEntity } from '../text/text.entity';
import { CorpusEntity } from '../corpus/corpus.entity';

@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'varchar', width: 255 })
	public username: string;

	@Column({ type: 'varchar', width: 255 })
	public email: string;

	@Column({ type: 'varchar', width: 255 })
	public password: string;

	@Column({ type: 'enum', enum: UserRole, default: UserRole.VISITOR })
	public role: UserRole;

	@OneToMany(
		type => CorpusEntity,
		corpus => corpus.author,
	)
	public corpora: CorpusEntity[];

	@OneToMany(
		type => TextEntity,
		text => text.author,
	)
	public texts: TextEntity[];

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	// Constructor
	constructor(
		id: number = 0,
		username: string = '',
		email: string = '',
		password: string = '',
		role: UserRole = UserRole.VISITOR,
		corpora: CorpusEntity[] = null,
		texts: TextEntity[] = null,
		createdAt: Date = new Date(),
		updatedAt: Date = new Date(),
	) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.password = password;
		this.role = role;
		this.corpora = corpora;
		this.texts = texts;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	// Get User
	public async getUser(): Promise<User> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(new User(this.username, this.email, this.role, this.createdAt, this.updatedAt));
			} catch (err) {
				reject(err);
			}
		});
	}

	// Set User
	public async setUser(user: User): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				this.id = 0;
				this.username = user.username;
				this.email = user.email;
				this.password = '';
				this.role = user.role;
				this.createdAt = user.createdAt;
				this.updatedAt = user.updatedAt;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	// Get JSON
	public async getJSON(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve({
					id: this.id,
					username: this.username,
					email: this.email,
					password: this.password,
					role: this.role,
					createdAt: this.createdAt,
					updatedAt: this.updatedAt,
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	// Set JSON
	public async setJSON(json: any): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				if (json.hasOwnProperty('id')) this.id = json.id;
				if (json.hasOwnProperty('username')) this.username = json.username;
				if (json.hasOwnProperty('email')) this.email = json.email;
				if (json.hasOwnProperty('password')) this.password = json.password;
				if (json.hasOwnProperty('role')) this.role = json.role;
				if (json.hasOwnProperty('createdAt')) this.createdAt = json.createdAt;
				if (json.hasOwnProperty('updatedAt')) this.updatedAt = json.updatedAt;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}
}
