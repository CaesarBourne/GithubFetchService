import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RepositoryEntity } from "./RepositoryEntity";

@Entity("commit_table")
export class CommitEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  repositoryId!: number;

  @Column()
  message!: string;

  @Column()
  date!: Date;

  @Column()
  author!: string;

  @Column()
  url!: string;

  @ManyToOne(() => RepositoryEntity, (repository) => repository.id)
  repository!: RepositoryEntity;
}
