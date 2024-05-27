import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsObject, IsString } from "class-validator";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import UserConfig from "./user.config.entity";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  @IsString()
  name: string;

  @Column()
  @ApiProperty()
  @IsString()
  @Exclude()
  password: string;

  @ApiProperty({ type: () => UserConfig })
  @OneToMany(() => UserConfig, (config) => config.user)
  config: UserConfig;
}
