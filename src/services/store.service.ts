import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import axios from 'axios';

@injectable({scope: BindingScope.SINGLETON})
export class StoreService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  async value() {
    // Add your implementation here
    try {
      const res = await axios.get('https://fakestoreapi.com/products');
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }
}
