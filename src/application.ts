import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingScope} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MyInterceptorProvider} from './interceptors/logger.interceptor';
import {MySequence} from './sequence';
import {DemoProvider, HashingService, StoreService} from './services';

export {ApplicationConfig};

export class DemoApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);

    this.bind('interceptors.my-interceptor').toClass(MyInterceptorProvider);
    // set up application bindings
    this.setupBindings();

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  // Group all bindings
  setupBindings() {
    this.bind('HashPass')
      .toClass(HashingService)
      .inScope(BindingScope.SINGLETON);
    this.bind('DemoProvider')
      .toClass(DemoProvider)
      .inScope(BindingScope.SINGLETON);
    this.bind('services.store').toClass(StoreService);
  }
}
