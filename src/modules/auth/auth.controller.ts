import { Body, Controller, Get, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignInPayload } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('sign-in')
    @UsePipes(new ValidationPipe())
    signIn(@Body() payload: SignInPayload) {
        return this.authService.signIn(payload);
    }

}
