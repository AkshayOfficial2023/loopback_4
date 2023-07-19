import {/* inject, */ BindingScope, Provider, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import axios from 'axios';
import {ERRORS} from '../constants/error.messages';

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

  async getWeather(city: string) {
    const options = {
      method: 'GET',
      url: `https://open-weather13.p.rapidapi.com/city/${city}`,
      headers: {
        'X-RapidAPI-Key': '63dcb6905cmsh34395f4050dbf3cp1e2689jsnab8a4823c4a9',
        'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      throw new HttpErrors.NotFound(ERRORS.FAILED_FETCH);
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
