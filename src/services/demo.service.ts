import {/* inject, */ BindingScope, Provider, injectable} from '@loopback/core';
import axios from 'axios';

/*
 * Fix the service type. Possible options can be:
 * - import {Demo} from 'your-module';
 * - export type Demo = string;
 * - export interface Demo {}
 */
export type Demo = unknown;

@injectable({scope: BindingScope.SINGLETON})
export class DemoProvider implements Provider<Demo> {
  constructor(/* Add @inject to inject parameters */) {}

  async value() {
    try {
      const res = await axios.get<iProduct[]>(
        'https://fakestoreapi.com/products',
      );
      return res.data.map(res => {
        return res.price;
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export interface iProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface Rating {
  rate: number;
  count: number;
}
