import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserDTO, SignInPayload } from './dtos';
import { Auth } from 'src/decorators/decorators.decorator';
import { UpdateUserDTO } from './dtos';
import { DataSource } from 'typeorm';

@Controller()
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @Post('sign-in')
    @UsePipes(new ValidationPipe())
    signIn(@Body() payload: SignInPayload) {
        return this.userService.signIn(payload);
    }

    @Get("users")
    @Auth("get_all_users")
    getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Get("users/:id")
    @Auth("get_user_by_id")
    getUserById(@Param('id') id: string){
        return this.userService.getUserById(id);
    }

    @Post("users")
    @Auth("create_user")
    @UsePipes(new ValidationPipe({ whitelist: true }))
    createUser(@Body() createData: CreateUserDTO) {
        return this.userService.createUser(createData);
    }

    @Put("users/:id")
    @Auth("update_user")
    @UsePipes(new ValidationPipe({ whitelist: true }))
    updateUser(@Body() updateData: UpdateUserDTO, @Param("id") id: string) {
        return this.userService.updateUser(id, updateData);
    }

    @Post("users-roles/:roleId/:userId")
    addUserRole(@Param('roleId') roleId: number, @Param('userId') userId: string) {
        return this.userService.addUserRole(roleId, userId);
    }

    @Delete("users/:id")
    @Auth("delete_user")
    deleteUser(@Param("id") id: string) {
        return this.userService.deleteUser(id);
    }

    @Delete("users-roles/:roleId/:userId")
    removeUserRole(@Param('roleId') roleId: number, @Param('userId') userId: string) {
        return this.userService.removeUserRole(roleId, userId);
    }

}
