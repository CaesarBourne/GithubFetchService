import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("repository_table")
export class RepositoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 100,
  })
  name!: string;

  @Column()
  url!: string;

  @Column("double")
  starsCount!: number;

  @Column("text")
  description!: string;

  @Column()
  openIssuesCount!: number;

  @Column()
  watchersCount!: number;

  @Column()
  forksCount!: number;

  @Column()
  language!: string;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;
}
