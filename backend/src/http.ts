import { Express } from "express";
import express from "express";


export function initHttp(app: Express) {
    app.use(express.json());
    app.get("/test", (req, res) => {
        res.send("Hello World!");
    });
   
}