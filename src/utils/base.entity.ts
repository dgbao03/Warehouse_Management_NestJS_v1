import { instanceToPlain } from "class-transformer";
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export default class BaseEntity {
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    static instanceToPlain(obj: any | any[]) {
        return instanceToPlain(obj);
    }
}