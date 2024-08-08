import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Repository {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
