import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../role/entities/role.entity";

@Entity({ name: "permissions"})
export class Permission extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToMany(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
    roles: Role[];
}