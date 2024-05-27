import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";
import { Exclude } from "class-transformer";

@Entity()
export default class UserConfig extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  @ApiProperty()
  id: number;

  @Column()
  user_id: number;

  @Column()
  @Exclude()
  is_ok: boolean;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (u) => u.id)
  @JoinColumn({ name: "user_id" })
  user: User;
}
