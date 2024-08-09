import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class RepositoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 100,
  })
  name!: string;

  @Column()
  html_url!: string;

  @Column("double")
  stargazers_count!: number;

  @Column("text")
  description!: string;

  @Column()
  open_issues_count!: number;

  @Column()
  watchers_count!: number;

  @Column()
  forksCount!: number;

  @Column()
  language!: string;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;
}
