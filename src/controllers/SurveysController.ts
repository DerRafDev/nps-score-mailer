import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveysController {
    async create(request: Request, response: Response) {
        const { title, description } = request.body;

        //this is to call the surveysrepositories
        const surveysRepository = getCustomRepository(SurveysRepository);
    
        //to create a survey
        const survey = surveysRepository.create({
            title,
            description
        });

        await surveysRepository.save(survey);

        return response.status(201).json(survey);
    }

    //this is for showing all the Surveys
    async show(request: Request, response: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository);
    
        const all = await surveysRepository.find();

        return response.json(all);
    }
}

export { SurveysController };