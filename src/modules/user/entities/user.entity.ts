import { Exclude } from "class-transformer";
import BaseEntity from "../../../utils/base.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../rbac/entities/role.entity";

@Entity({ name: "users" })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'text'})
    fullname: string;

    @Column({ type: 'text', unique: true})
    email: string
    
    @Column({ type: 'text'})
    @Exclude()
    password: string

    @Column({ type: 'int'})
    age: number;

    @ManyToMany(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
    @JoinTable({ 
        name: "users_roles",
        joinColumn: { name: 'user_id', referencedColumnName: 'id' }, 
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
    })
    roles: Role[];
}