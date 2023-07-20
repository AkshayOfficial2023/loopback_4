import {
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/context';

export class MyInterceptorProvider implements Provider<Interceptor> {
  value(): MyInterceptor {
    return this.intercept.bind(this);
  }

  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ): Promise<InvocationResult> {
    // Logic to be executed before handling the request
    console.log('Before handling the request');

    // Call the next interceptor or the controller method
    const result = await next();

    // Logic to be executed after handling the request
    console.log('After handling the request');

    return result;
  }
}

// Define the custom interceptor type
type MyInterceptor = Interceptor;
