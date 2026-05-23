import {IUser, ILoginUser} from "../../interfaces/auth.interface";

export const validateSignup = (data: IUser)=>{
    const {name, email, password, role}= data;

    if(!name || !email || !password){
        return "All fields are required";
    }

    if(password.length < 6){
        return "Password must be at least 6 characters long";
    }

    if(role && role !== "contributor" && role !== "maintainer"){
        return "invalid role";
    }

    return null;
}


export const validateLogin = ( data: ILoginUser)=> {
    const { email, password} = data;

    if(!email || !password){
        return "all fields are required";
    }

    return null;
}