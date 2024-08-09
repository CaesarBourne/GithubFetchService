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
  starsCount!: number;

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

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
