import express, { Application } from 'express';
import { Socket, Server } from 'socket.io'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { ConnectionService } from '../services/connection.service';

import { Page, PageEntity , PageModel } from '../models/page.model';
import { configuration } from '../configuration'

export class DashboardController {

    constructor(
        private app: Application,
        private io: Server,
        private cs: ConnectionService,
    ) {
        io.on('connection', socket => {

            // create
            socket.on('dashboard/createPage', async (title) => {
                try {
                    const pages = await this.createPage(title).catch(err => { throw err; });
                    socket.emit("dashboard/create-error", null);
                    io.emit("dashboard/pages", pages);
                } catch(err) { socket.emit("dashboard/create-error", err); }
            });

            // Find All
            socket.on('dashboard/findAllPages', async ({title, sort}) => {
                try {
                    const pages = await this.findAll(title, sort).catch(err => { throw err; });
                    socket.emit("dashboard/pages", pages);
                } catch(err) { socket.emit("dashboard/error", err); }
            });
        });
    }

    // Create a new Page
    private async createPage(title: string): Promise<Page[]> {
        return new Promise<any>( async(resolve, reject) => {
            try {
                const [cleanedTitle, url] = await this.validateTitle(title).catch(err => { throw err; })
                await PageModel.titleExists(cleanedTitle).catch(err => { throw err; })
                await PageModel.create(cleanedTitle, url).catch(err => { throw err; })
                const pages = await PageModel.findAll("", "").catch(err => { throw err; }) 
                resolve(pages);
            } catch(err) { reject(err); }
        })
    }

    // Update a new Page
    private async updatePage(title: string): Promise<Page[]> {
        return new Promise<any>( async(resolve, reject) => {
            try {
                const [cleanedTitle, url] = await this.validateTitle(title).catch(err => { throw err; })
                await PageModel.titleExists(cleanedTitle).catch(err => { throw err; })
                await PageModel.create(cleanedTitle, url).catch(err => { throw err; })
                const pages = await PageModel.findAll("", "").catch(err => { throw err; }) 
                resolve(pages);
            } catch(err) { reject(err); }
        })
    }

    // Delete a new Page
    private async deletePage(title: string): Promise<Page[]> {
        return new Promise<any>( async(resolve, reject) => {
            try {
                const [cleanedTitle, url] = await this.validateTitle(title).catch(err => { throw err; })
                await PageModel.titleExists(cleanedTitle).catch(err => { throw err; })
                await PageModel.create(cleanedTitle, url).catch(err => { throw err; })
                const pages = await PageModel.findAll("", "").catch(err => { throw err; }) 
                resolve(pages);
            } catch(err) { reject(err); }
        })
    }

    // Create a new Page
    private async validateTitle(title: string): Promise<[string, string]> {
        return new Promise<any>( async(resolve, reject) => {
            try {
                if(title === '' || title === null) throw "Page title can't be empty";
                let name: string = title.replace(/\s\s+/g, ' ');
                let nameSplit: string[] = name.split(" ");
                if(nameSplit[0] == '') nameSplit.splice(0, 1);
                if(nameSplit[nameSplit.length - 1] == '') nameSplit.splice(-1, 1);
                let nameJoin: string = nameSplit.join(" ");
                const path = ('/' + nameJoin).replace(/ /g, "_").match(/(?<!\?.+)(?<=\/)[\w-]+(?=[/\r\n?]|$)/g);
                if(path === null || path.length != 1) throw "Page URL is invalid";
                const url = path[0];
                resolve([nameJoin, url]);
            } catch(err) { reject(err); }
        })
    }


    // Find All pages
    private async findAll(title: string, sort: string): Promise<Page[]> {
        return new Promise<any>( async(resolve, reject) => {
            try {
                const pages = await PageModel.findAll(title, sort).catch(err => { throw err; })
                resolve(pages);
            } catch(err) { reject(err); }
        })
    }
}