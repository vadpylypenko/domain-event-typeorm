import { QueryRunner } from 'typeorm';

export interface TypeOrmEventPublisherFactoryOptionsInterface {
  /**
   * The instance of the TypeORM query runner. 
   */
  queryRunner: QueryRunner;
}
