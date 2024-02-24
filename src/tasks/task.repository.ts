import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

/*
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {}

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private repository: TaskRepository) {}
}*/

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(
    @InjectRepository(Task)
    repository: Repository<Task>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
