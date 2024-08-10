import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CommitEntity } from "./CommitEntity";

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
  @Column({ nullable: true })
  lastCommitSha!: string | null;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;

  @OneToMany(() => CommitEntity, (commit) => commit.repository)
  commits!: CommitEntity[];
}
