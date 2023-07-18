import {
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise
} from '@loopback/core';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
// @globalInterceptor('app', {tags: {name: 'removePassword'}})
export class RemovePasswordInterceptor implements Provider<Interceptor> {
  /*
  constructor() {}
  */

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ):Promise<InvocationResult> {
    const result = await next();

    if (result && result.value) {
      if (Array.isArray(result.value)) {
        // Handle an array of objects
        result.value.forEach((item:any) => {
          if (item.hasOwnProperty('password')) {
            delete item.password;
          }
        });
      } else if (result.value.hasOwnProperty('password')) {
        // Handle a single object
        delete result.value.password;
      }
    }

      return result;
  }
}
