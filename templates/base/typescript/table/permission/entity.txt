import {
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    Column,
    ManyToOne,
} from "typeorm";
import { IsEnum, IsUUID, Length } from "class-validator";
import { Role } from "./role.entity";
import { PermissionAction } from "../common/enums/permissions.enum";
import { TablesNames } from "../common/enums/tables.enum";

@Entity()
export class Permission {
    // --- base columns ---
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    // --- columns ---
    @IsEnum(PermissionAction)
    @Column({
        type: "enum",
        enum: PermissionAction,
        nullable: false,
    })
    action: PermissionAction;

    @IsEnum(TablesNames)
    @Column({
        type: "enum",
        enum: TablesNames,
        nullable: false,
    })
    table: TablesNames;

    @Length(3, 25)
    @Column({
        nullable: true,
    })
    description: string;

    // --- relations ---
    @ManyToOne(() => Role, (role) => role.permissions)
    role: Role;
}
