import { Express } from "express";
import express from "express";
import { Space } from "./db/schema";


export function initHttp(app: Express) {
    app.use(express.json());
    app.get("/test", (req, res) => {
        res.send("Hello World!");
    });
   app.post("/newspace", async(req, res) => {
    const {email, roomId, title} = req.body;
    const space = new Space({email, roomId, title});
    await space.save();
    res.send(space);
   });
   app.post('/getspace', async(req, res) => {
         const {email} = req.body;
         const spaces = await Space.find({email});
            res.send(spaces);
    });
    app.post('/deletespace', async(req, res) => {
        const {email, roomId} = req.body;
        const space = await Space.findOneAndDelete({email, roomId});
        res.send(space);
    });
}