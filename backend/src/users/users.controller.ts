import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { User } from './user.entity';
import { UserInput } from './user.input';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(
        private service: UsersService
    ) {}

    @ApiCreatedResponse({
        description: 'The user has been successfully created.'
    })
    @Post()
    async create(@Body() input: UserInput): Promise<User> {
        return this.service.create(input.lastname, input.firstname, input.age);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAll(): Promise<User[]> {
        return this.service.getAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getById(@Param() parameter): Promise<User> {
        const userToGet: User = await this.service.getById(parameter.id);
        if (userToGet === undefined) {
            throw new HttpException(`Could not find a user with the id ${parameter.id}`, HttpStatus.NOT_FOUND);
        } else {
            return userToGet;
        }
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param() parameter, @Body() input: any): Promise<User> {
      return this.service.update(parameter.id, input.lastname, input.firstname, input.age);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteById(@Param() parameter): Promise<void> {
       this.service.delete(parameter.id);
    }

}
