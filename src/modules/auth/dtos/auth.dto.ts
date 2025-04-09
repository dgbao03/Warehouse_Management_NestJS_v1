import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInPayload {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}