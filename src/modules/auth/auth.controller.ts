import { Request, Response } from "express";
import { validateLogin, validateSignup } from "./auth.validation";
import { StatusCodes } from "http-status-codes";
import { createUser, loginUser } from "./auth.service";
import { LoginResponse, User } from "../../interfaces/auth.interface";

export const signup = async ( req: Request, res: Response) =>{
    try {
        const invalid = validateSignup(req.body);

        if(invalid){
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: invalid
            })
        }

        const user: User = await createUser(req.body);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "user registration successful",
            data: user
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An error occurred";
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message
        })
    }
}


export const login = async ( req: Request, res: Response) => {
    try{

        const invalid = validateLogin(req.body);

        if(invalid){
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: invalid
            })
        }

        const result: LoginResponse = await loginUser(req.body);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "login successful",
            data: result
        })

    }catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An error occurred";
        res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message
        })
    }
}