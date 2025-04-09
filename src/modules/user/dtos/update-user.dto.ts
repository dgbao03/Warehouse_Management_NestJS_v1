import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { Transform } from 'class-transformer';

export class UpdateUserDTO {
    @IsOptional()
    fullname: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @Transform(({ value }) => Number(value)) 
    age: number;
}