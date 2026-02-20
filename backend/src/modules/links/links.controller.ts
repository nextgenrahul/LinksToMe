// I use get Profile Pramas to remove user name error   
import { Request, Response } from "express";
import { LinksService } from "./links.services";


export class LinksController {
    constructor(
        private readonly service: LinksService
    ) { }

    async check(){
        console.log("Hello")
    }

    
}
