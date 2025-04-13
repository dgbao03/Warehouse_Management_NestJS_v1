import { IsNotEmpty, IsString } from "class-validator";

export class UpdateProductDTO {
    @IsString()
    @IsNotEmpty()
    name: string
}