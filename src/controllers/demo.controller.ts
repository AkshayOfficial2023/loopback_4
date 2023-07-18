import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Demo} from '../models';
import {DemoRepository} from '../repositories';

export class DemoController {
  constructor(
    @repository(DemoRepository)
    public demoRepository : DemoRepository,
  ) {}

  @post('/demos')
  @response(200, {
    description: 'Demo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Demo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Demo, {
            title: 'NewDemo',
            exclude: ['id'],
          }),
        },
      },
    })
    demo: Omit<Demo, 'id'>,
  ): Promise<any> {
      const name = await this.demoRepository.findOne({where:{name:demo.name}})
      if(name) throw new HttpErrors.BadRequest('Username already exists')
      const data = this.demoRepository.create(demo);
      if(!data) throw new HttpErrors.BadGateway('Database error')
      return {'message':'successful','data':data}
  }

  @get('/demos/count')
  @response(200, {
    description: 'Demo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Demo) where?: Where<Demo>,
  ): Promise<Count> {
    return this.demoRepository.count(where);
  }

  @get('/all')
  @response(200)
  async getAll():Promise<object>{
    const data = await this.demoRepository.find()
    return {'message':'successful','data':data}
  }

  @get('/demos')
  @response(200, {
    description: 'Array of Demo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Demo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Demo) filter?: Filter<Demo>,
  ): Promise<Demo[]> {
    return this.demoRepository.find(filter);
  }

  @patch('/demos')
  @response(200, {
    description: 'Demo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Demo, {partial: true}),
        },
      },
    })
    demo: Demo,
    @param.where(Demo) where?: Where<Demo>,
  ): Promise<Count> {
    return this.demoRepository.updateAll(demo, where);
  }

  @get('/demos/{id}')
  @response(200, {
    description: 'Demo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Demo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Demo, {exclude: 'where'}) filter?: FilterExcludingWhere<Demo>
  ): Promise<Demo> {
    return this.demoRepository.findById(id, filter);
  }

  @patch('/demos/{id}')
  @response(204, {
    description: 'Demo PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Demo, {partial: true}),
        },
      },
    })
    demo: Demo,
  ): Promise<void> {
    await this.demoRepository.updateById(id, demo);
  }

  @put('/demos/{id}')
  @response(204, {
    description: 'Demo PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() demo: Demo,
  ): Promise<void> {
    await this.demoRepository.replaceById(id, demo);
  }

  @del('/demos/{id}')
  @response(204, {
    description: 'Demo DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.demoRepository.deleteById(id);
  }
}
