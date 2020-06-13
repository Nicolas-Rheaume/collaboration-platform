import { Router, Request, Response } from "express";

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '../public/index.html');
});

export default router;