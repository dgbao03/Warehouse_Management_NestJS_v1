import { Exclude } from "class-transformer";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../role/entities/role.entity";
import { ExportStock } from "../../export_stock/entities/export.entity";

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

    @OneToMany(() => ExportStock, exportStock => exportStock.user)
    exportStocks: ExportStock[];
}