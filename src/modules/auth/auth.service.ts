import { IUser, ILoginUser, User } from "../../interfaces/auth.interface";
import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt";


export const createUser  = async ( payload: IUser)=>{

    const {name, email, password, role} = payload;

    const existingUserQuery = 
       "SELECT * FROM users WHERE email = $1";

    const existingUser = await pool.query(existingUserQuery, [email]);

    if(existingUser.rows.length > 0){
        throw new Error( "user already exists with this email");
    }

    const hashedPassword= await bcrypt.hash(password, 10);
    
    const insertUserQuery = 
        `INSERT INTO users (
            name, email, password, role) VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role, created_at, updated_at`;

    
    const result = await pool.query(insertUserQuery, [name, email, hashedPassword, role || "contributor"]);

    return result.rows[0] as User;
}


export const loginUser = async (payload: ILoginUser) => {
    const {email, password } = payload;

    const userQuery = "SELECT * FROM users WHERE email = $1";

    const result = await pool.query(userQuery, [email]);

    const user = result.rows[0];

    if(!user){
        throw new Error('Invalid email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        throw new Error("Invalid password");
    }

    const token = generateToken({
        id: user.id,
        name: user.name,
        role: user.role
    });

    const response: User = user;
    return {
        token,
        user: response
    }

}