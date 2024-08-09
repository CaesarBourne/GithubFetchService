import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RepositoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  url!: string;

  @Column()
  starsCount!: number;

  @Column()
  description!: string;

  @Column()
  openIssuesCount!: number;

  @Column()
  forksCount!: number;

  @Column()
  language!: string;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;
}
