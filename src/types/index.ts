import { Request } from "express";

export interface AuthUser {
  id: number;
  name: string;
  role: "contributor" | "maintainer";
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface IErrorResponse {
  code?: string;
  message?: string;
  detail?: string;
}

export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface StandardErrorResponse {
  success: false;
  message: string;
  errors?: string | Record<string, unknown>;
}
