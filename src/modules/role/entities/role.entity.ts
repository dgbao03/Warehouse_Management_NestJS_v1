import BaseEntity from "../../../utils/base.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "../../permission/entities/permission.entity";
import { User } from "../../user/entities/user.entity";

@Entity({ name: "roles"})
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @ManyToMany(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
    users: User[];

    @ManyToMany(() => Permission, (permission) => permission.roles)    
    @JoinTable({ 
        name: "roles_permissions",
        joinColumn: { name: 'role_id', referencedColumnName: 'id' }, 
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }
     })
    permissions: Permission[];
}