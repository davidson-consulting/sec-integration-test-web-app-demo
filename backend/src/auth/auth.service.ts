import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService  
    ) {}

    public async validateUser(id: number, password: string) : Promise<User> {
        const user: User = await this.usersService.getById(id);
        if (user !== undefined && bcrypt.compare(user.password, password)) {
            return user;
        } else {
            return undefined;
        }
    }

    async login(user: any) {
        const payload = { username: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
