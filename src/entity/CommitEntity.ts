import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Repository } from "./Repository";

@Entity()
export class CommitEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  message!: string;

  @Column()
  date!: Date;

  @Column()
  author!: string;

  @Column()
  url!: string;

  @ManyToOne(() => Repository, (repository) => repository.id)
  repository!: Repository;
}
