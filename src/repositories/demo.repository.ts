import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {Demo, DemoRelations} from '../models';

export class DemoRepository extends DefaultCrudRepository<
  Demo,
  typeof Demo.prototype.id,
  DemoRelations
> {
  constructor(
    @inject('datasources.demo') dataSource: DemoDataSource,
  ) {
    super(Demo, dataSource);
  }
}
