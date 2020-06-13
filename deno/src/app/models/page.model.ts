/*****************************************************************************
 *  DEPENDENCIES
*****************************************************************************/
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Repository} from "typeorm";
import { getConnection, getManager } from "typeorm";

/*****************************************************************************
 *  PAGE TYPE
*****************************************************************************/
export class Page {
    id?: number;
    title?: string;
    url?: string;

    contributors?: number;
    texts?: number;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(
        id: number = 0,
        title: string = "", 
        url: string = "", 

        contributors: number = 0,
        texts: number = 0,

        createdAt: Date = null,
        updatedAt: Date = null
    ) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.contributors = contributors;
        this.texts = texts;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public getJSON(): any {
        return {
            id: this.id,
            title: this.title,
            url: this.url,
            contributors: this.contributors,
            texts: this.texts,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
    public setJSON(json: any): void {
        this.id = json.id,
        this.title = json.title,
        this.url = json.url,
        this.contributors = json.contributors,
        this.texts = json.texts,
        this.createdAt = json.createdAt,
        this.updatedAt = json.updatedAt
    }

    public getClientVersion(): any {
        return {
            title: this.title,
            url: this.url,
            contributors: this.contributors,
            texts: this.texts,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
}

/*****************************************************************************
 *  PAGE ENTITY
*****************************************************************************/
@Entity('pages')
export class PageEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", width: 255 })
    title: string;

    @Column({ type: "varchar", width: 255 })
    url: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

/*****************************************************************************
 *  PAGE MODEL
*****************************************************************************/
export class PageModel {

    private static connection;
    private static manager;
    private static pageRepository;

    public static async initialize(): Promise<void> {
        return new Promise( async(resolve, reject) => {
            try {
                this.connection = await getConnection();
                this.manager = await getManager();
                this.pageRepository = await getConnection().getRepository(PageEntity);
                resolve();
            } catch(err) { reject(err); }
        })
    }

    public static async create(title: string, url: string): Promise<Page> {
        return new Promise( async(resolve, reject) => {
            try {
                const data = await this.connection.createQueryBuilder()
                    .insert()
                    .into(PageEntity)
                    .values({ title: title, url: url})
                    .execute()
                    .catch(err => { throw "Error creating the page" });

                const page = await this.findOneByID(data.raw.insertId).catch(err => { throw err });
                resolve(page);
            } catch(err) { reject(err); }
        })
    }

    public static async titleExists(title: string): Promise<boolean> {
        return new Promise( async(resolve, reject) => {
            try {
                const count = await this.pageRepository.count({where: {title: title}}).catch(err => { throw "Error counting the pages" });
                if(count > 0) throw "Page title already exists";
                else resolve(true);
             } catch(err) { reject(err); }
        })
    } 

    public static async findOneByID(id: number): Promise<Page> {
        return new Promise( async(resolve, reject) => {
            try {
                const result = await getConnection()
                    .createQueryBuilder()
                    .select("page")
                    .from(PageEntity, "page")
                    .where("page.id = :id", {id: id})
                    .getOne()
                    .catch(err => { throw "Error finding the page" });

                let page = new Page();
                page.setJSON(result);
                resolve(page);
            } catch(err) { reject(err); }
        })
    }

    public static async findAll(title: string, sort: string): Promise<Page[]> {
        return new Promise( async(resolve, reject) => {
            try {
                const results = await this.pageRepository.find();

                let pages: Page[] = new Array(results.length);
                results.forEach((result, i) => {
                    pages[i] = new Page();
                    pages[i].setJSON(result);
                });
                    resolve(pages);
            } catch(err) { reject(err); }
        })
    }


}