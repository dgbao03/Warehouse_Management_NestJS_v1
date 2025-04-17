import { User } from "../../user/entities/user.entity";
import BaseEntity from "../../../utils/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExportStockDetail } from "./export-detail.entity";

@Entity({ name: "export_stocks" })
export class ExportStock extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    description: string;

    @ManyToOne(() => User, user => user.exportStocks)
    @JoinColumn({ name: 'user_id' })
    user: User | null;

    @OneToMany(() => ExportStockDetail, exportStockDetail => exportStockDetail.exportStock)
    exportStockDetails: ExportStockDetail[];
}