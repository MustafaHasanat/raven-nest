import {
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    Column,
    OneToMany,
} from "typeorm";
import { IsUUID, Length } from "class-validator";
import { Permission } from "./permission.entity";

@Entity()
export class Role {
    // --- base columns ---
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    // --- columns ---

    @Length(3, 25)
    @Column({
        nullable: false,
        unique: true,
    })
    name: string;

    // --- relations ---
    @OneToMany(() => Permission, (permission) => permission.role)
    permissions: Permission[];
}
