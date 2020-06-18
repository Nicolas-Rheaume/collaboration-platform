/*****************************************************************************
 *  DEPENDENCIES
*****************************************************************************/
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Repository} from "typeorm";
import { getConnection, getManager } from "typeorm";

/*****************************************************************************
 *  USER ROLE
*****************************************************************************/
export enum UserRole {
    ADMIN = 'Admin',
    CONTRIBUTOR = 'Contributor',
    VISITOR = 'Visitor'
}

/*****************************************************************************
 *  USER TYPE
*****************************************************************************/
export class User {
    id?: number;
    username?: string;
    email?: string;
    role?: UserRole
    createdAt?: Date;
    updatedAt?: Date;

    constructor(
        id: number = 0,
        username: string = "", 
        email: string = "", 
        role: UserRole = UserRole.VISITOR,
        createdAt: Date = null,
        updatedAt: Date = null
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public getJSON(): any {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
    public setJSON(json: any): void {
        this.id = json.id;
        this.username = json.username;
        this.email = json.email;
        this.role = json.role;
        this.createdAt = json.createdAt;
        this.updatedAt = json.updatedAt;
    }

    public getClientVersion(): any {
        return {
            username: this.username,
            email: this.email,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
}

/*****************************************************************************
 *  USER ENTITY
*****************************************************************************/
@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", width: 255 })
    username: string;

    @Column({ type: "varchar", width: 255 })
    email: string;

    @Column({ type: "varchar", width: 255 })
    password: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.VISITOR })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

/*****************************************************************************
 *  USER MODEL
*****************************************************************************/
export class UserModel {

    private static connection;
    private static manager;
    private static userRepository;

    public static async initialize(): Promise<void> {
        return new Promise( async(resolve, reject) => {
            try {
                this.connection = await getConnection();
                this.manager = await getManager();
                this.userRepository = await getConnection().getRepository(UserEntity);
                resolve();
            } catch(err) { reject(err); }
        })
    }

    public static async findOneByID(id: number): Promise<User> {
        return new Promise( async(resolve, reject) => {
            try {
                const result = await getConnection()
                    .createQueryBuilder()
                    .select("user")
                    .from(UserEntity, "user")
                    .where("user.id = :id", {id: id})
                    .getOne()
                    .catch(err => { throw "Error finding the user" });

                let user = new User();
                user.setJSON(result);
                resolve(user);
            } catch(err) { reject(err); }
        })
    }

    public static async findOneByUsername(username: string): Promise<User> {
        return new Promise( async(resolve, reject) => {
            try {
                const result = await getConnection()
                    .createQueryBuilder()
                    .select("user")
                    .from(UserEntity, "user")
                    .where("user.username = :username", {username: username})
                    .getOne()
                    .catch(err => { throw "Error finding the user" });

                let user = new User();
                user.setJSON(result);
                resolve(user);
            } catch(err) { reject(err); }
        })
    }

    public static async findOneWithPassword(search?: any): Promise<{user: User, password: string}> {
        return new Promise( async(resolve, reject) => {
            try {
                const result = await this.userRepository.findOne(search).catch(err => { throw "Error finding the user" });
                if(!result) throw "No user was found"
                let user = new User();
                user.setJSON(result);
                resolve({user: user, password: result.password});
            } catch(err) { reject(err); }
        })
    }

    public static async UsernameAndEmailDontExist(username: string, email: string): Promise<boolean> {
        return new Promise( async(resolve, reject) => {
            try {
                const count = await this.userRepository.count({where: [{username: username}, {email: email}]}).catch(err => { throw "Error counting the user" });
                if(count > 0) throw "Invalid username or email. It already exists";
                else resolve(true);
             } catch(err) { reject(err); }
        })
    }

    /*
    public static async findAll(): Promise<User[]> {
        return new Promise( async(resolve, reject) => {
            const users = await this.userRepository.find();

            console.log("Get All");
            console.log(users);
            resolve();

        })
    }
    */

    public static async create(username: string, email: string, password: string, role: UserRole): Promise<User> {
        return new Promise( async(resolve, reject) => {
            try {
                const data = await this.connection.createQueryBuilder()
                    .insert()
                    .into(UserEntity)
                    .values([
                        { username: username, email: email, password: password, role: role }, 
                    ])
                    .execute()
                    .catch(err => { throw "Error creating the user" });

                const user = await this.findOneByID(data.raw.insertId).catch(err => { throw err });
                resolve(user);
            } catch(err) { reject(err); }
        })
    }
}