import { User } from "../../user/entities/user.entity";
import BaseEntity from "../../../databases/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExportStockDetail } from "./export-detail.entity";
import { Status } from "../../../constants/status.enum";

@Entity({ name: "export_stocks" })
export class ExportStock extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    description: string;

    // @Column({ type: 'varchar', length: 255, default: 'pending' })
    // status: string;

    @Column({ type: 'enum', enum: Status, default: Status.Pending })
    status: string;

    @Column({ type: 'text', nullable: true })
    reason: string

    @ManyToOne(() => User, user => user.exportStocks)
    @JoinColumn({ name: 'user_id' })
    user: User | null;

    @OneToMany(() => ExportStockDetail, exportStockDetail => exportStockDetail.exportStock)
    exportStockDetails: ExportStockDetail[];
}