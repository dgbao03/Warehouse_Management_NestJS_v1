import { BadRequestException, Injectable, NotFoundException, Res } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '../../jwt/services/jwt.service';
import { SignInPayload } from '../dtos/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RbacService } from '../../rbac/services/rbac.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,

        private configService: ConfigService,

        private rbacService: RbacService,

        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    hashPassword(plainPassword: string) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(plainPassword, salt);
    }

    async comparePassword(plainPassword: string, hashedPassword: string) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async signIn(payload: SignInPayload) {
        const user = await this.userRepository.findOne({ where: { email: payload.email} })
        if (!user) throw new NotFoundException("Email not exist! Please try again!");

        const checkPassword = await this.comparePassword(payload.password, user.password);
        if(!checkPassword) throw new BadRequestException("Password is incorrect! Please try again!");

        const userRoles = await this.rbacService.getUserRoles(user.id);

        
        const accessToken = this.jwtService.sign(
            {
                id: user.id,
                email: user.email,
                roles: userRoles
            },

            this.configService.getOrThrow("ACCESS_SECRET_TOKEN"),

            {
                expiresIn: "15m"
            }
        )

        const refreshToken = this.jwtService.sign(
            {
                id: user.id,
                email: user.email,
                roles: userRoles
            },

            this.configService.getOrThrow("REFRESH_SECRET_TOKEN"),

            {
                expiresIn: "1h"
            }
        )
        
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

}
