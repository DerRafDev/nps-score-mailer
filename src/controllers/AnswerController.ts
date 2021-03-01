import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { AppError } from "../errors/AppError";

//this is for receiving the Answer from the User in the Mail
class AnswerController {

    async execute(request: Request, response: Response) {
        const { value } = request.params;
        const { u } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        //to see if exist
        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });

        if(!surveyUser) {
            throw new AppError("Survey User does not exists!")
        }

        //this is for replacing the value with the user answer
        surveyUser.value = Number(value);
    
        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);
    }

}

export { AnswerController };