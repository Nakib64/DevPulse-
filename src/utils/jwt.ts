import jwt from "jsonwebtoken";


interface Payload {
    id: number;
    name: string;
    role: "contributor" | "maintainer";
}

export const generateToken = (payload: Payload): string => {
    return jwt.sign(
        {
            id: payload.id,
            name: payload.name,
            role: payload.role
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "24h"
        }
    )
}


export const verifyToken = (
  token: string
): Payload => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as Payload;
};