import { Router } from "express";
import { DataController } from "../controller/amazonData";

export const dataRouter = Router();

dataRouter.get("/scrape/", DataController.getData);
