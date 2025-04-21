import { Exclude, instanceToPlain } from "class-transformer";
import { CreateDateColumn, DeleteDateColumn, JoinColumn, UpdateDateColumn } from "typeorm";

export default class BaseEntity {
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    static instanceToPlain(obj: any | any[]) {
        return instanceToPlain(obj);
    }
}