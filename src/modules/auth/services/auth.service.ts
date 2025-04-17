import { BadRequestException, Injectable, NotFoundException, Res } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(){}

    hashPassword(plainPassword: string) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(plainPassword, salt);
    }

    async comparePassword(plainPassword: string, hashedPassword: string) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}
