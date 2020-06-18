import express, { Request, Response } from "express";

export const TestRouter = express.Router();

let count = 0;

TestRouter.get('/asd', async (req: Request, res: Response) => {
    try {
        count++;
        res.send(`<p>${count}</p>`);
    } catch (e) {
        res.send(e.message);
    }
  });
