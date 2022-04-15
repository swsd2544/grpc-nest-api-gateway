import { Request } from 'express';
export interface UserWithAuthRequest extends Request {
  user: number; // or any other type
}
