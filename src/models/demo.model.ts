import {Entity, model, property} from '@loopback/repository';

@model()
export class Demo extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;


  constructor(data?: Partial<Demo>) {
    super(data);
  }
}

export interface DemoRelations {
  // describe navigational properties here
}

export type DemoWithRelations = Demo & DemoRelations;
