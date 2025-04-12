import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserDTO } from './dtos';
import { AuthGuard } from 'src/guards/auth.guard';
import { Auth, CurrentUser, Permissions } from 'src/decorators/decorators.decorator';
import { UpdateUserDTO } from './dtos';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @Get()
    @Auth("get_all_users")
    getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Get(":id")
    @Auth("get_user_by_id")
    getUserById(@Param('id') id: string){
        return this.userService.getUserById(id);
    }

    @Post()
    @Auth("create_user")
    @UsePipes(new ValidationPipe({ whitelist: true }))
    createUser(@Body() createData: CreateUserDTO) {
        return this.userService.createUser(createData);
    }

    @Put(":id")
    @Auth("update_user")
    @UsePipes(new ValidationPipe({ whitelist: true }))
    updateUser(@Body() updateData: UpdateUserDTO, @Param("id") id: string) {
        return this.userService.updateUser(id, updateData);
    }

    @Delete(":id")
    @Auth("delete_user")
    deleteUser(@Param("id") id: string) {
        return this.userService.deleteUser(id);
    }

}
