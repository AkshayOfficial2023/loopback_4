import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'demo',
  connector: 'mongodb',
  url: 'mongodb+srv://Akshay:6NIGul6AE2S1MJ5X@cluster0.2toxrfa.mongodb.net/demo',
  host: '',
  port: 0,
  user: '',
  password: '',
  database: '',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DemoDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'demo';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.demo', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
