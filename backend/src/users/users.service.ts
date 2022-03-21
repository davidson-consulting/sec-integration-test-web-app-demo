import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private repository: Repository<User>,
    ) { }

    async create(lastname: string, firstname: string, age: number): Promise<User> {
        const password: string = 'password';
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        const user: User = this.repository.create({ 
            lastname: lastname, 
            password: hash, 
            firstname: firstname, 
            age: age 
        });
        return this.repository.save(user);
    }

    async getAll(): Promise<User[]> {
        return this.repository.find();
    }

    async getById(id: number): Promise<User> {
        return this.repository.findOne( { id: Equal(id) } );
    }

    async update(id: number, firstname: string, lastname: string, age: number): Promise<User> {
        const userToUpdate: User = await this.getById(id);
        if (firstname !== undefined) {
            userToUpdate.firstname = firstname;
        }
        if (lastname !== undefined) {
            userToUpdate.lastname = lastname;
        }
        if (age !== undefined) {
            userToUpdate.age = age;
        }
        return this.repository.save(userToUpdate);
    }

    delete(id: number): void {
        this.repository.delete({ id: Equal(id) });
    }

}
