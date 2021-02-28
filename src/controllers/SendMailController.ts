import {Request, Response } from "express";
import { resolve } from "path";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        
        //this is to find the email to see if the user exist
        const userAlreadyExists = await usersRepository.findOne({ email });
        
        if(!userAlreadyExists) {
            return response.status(400).json({
                error: "User does not exists",
            });
        }

        //this is to find the id of the Survey to see if the Survey exist
        const surveyAlreadyExists = await surveysRepository.findOne({id: survey_id});
    
        if(!surveyAlreadyExists) {
            return response.status(400).json({
              error: "Survey does not exists!"  
            })
        }

        const variables = {
            name: userAlreadyExists.name,
            title: surveyAlreadyExists.title,
            description: surveyAlreadyExists.description,
            user_id: userAlreadyExists.id,
            link: process.env.URL_MAIL
        };

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");


        const surveySave = await surveysUsersRepository.findOne({
            where: [{user_id: userAlreadyExists.id}, {value: null}],
            //this relations is for in insominia showing everything of user
            relations: ["user", "survey"]
        });

        if (surveySave) {
            await SendMailService.execute(
                email,
                surveyAlreadyExists.title,
                variables,
                npsPath
            );
            return response.json(surveySave);
        }
        //save the info in the table surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id
        });

        await surveysUsersRepository.save(surveyUser);

        //send e-mail to the user
        await SendMailService.execute(
            email,
            surveyAlreadyExists.title,
            variables,
            npsPath);
    
        return response.json(surveyUser);
    }
}

export { SendMailController };