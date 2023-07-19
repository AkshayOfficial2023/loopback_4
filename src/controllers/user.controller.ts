import {TokenService, authenticate} from '@loopback/authentication';
import {
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import IsEmail from 'isemail';
import {ERRORS} from '../constants/error.messages';
import {SUCCESS} from '../constants/success.message';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {DemoProvider, HashingService} from '../services';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('HashPass') public hash: HashingService,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE) public userService: MyUserService,
    @inject('DemoProvider') public demo: DemoProvider,
  ) {}

  // third party api call method using service
  @get('/users/product')
  @response(200)
  async getProducts() {
    const data = await this.demo.value();
    return {message: SUCCESS.SUCCESS, data: data};
  }

  @get('/users/weather/{city}')
  @response(200)
  async getWeatherData(@param.path.string('city') city: string) {
    const data = await this.demo.getWeather(city);
    return {message: SUCCESS.SUCCESS, data: data};
  }

  @post('/users/register')
  @response(200)
  async register(@requestBody() newUser: User): Promise<object> {
    if (IsEmail.validate(newUser.email) == false)
      throw new HttpErrors.UnprocessableEntity(ERRORS.INVALID_EMAIL);
    if (newUser.password.length < 8)
      throw new HttpErrors.UnprocessableEntity(ERRORS.INVALID_PASSWORD_LENGTH);
    const userFound = await this.userRepository.findOne({
      where: {email: newUser.email},
    });
    if (userFound) throw new HttpErrors.BadRequest(ERRORS.EXISTING_EMAIL);
    newUser.password = await this.hash.hashPass(newUser.password);
    const {password, ...data} = await this.userRepository.create(newUser);
    if (!data) throw new HttpErrors.BadGateway(ERRORS.DATABASE_ERROR);
    return {message: SUCCESS.SUCCESS, data: data};
  }

  @post('/user/login')
  @response(200)
  async login(@requestBody() loginUser: LoginUser): Promise<object> {
    Object.defineProperty(this.constructor.prototype, 'password', {
      enumerable: true,
    });
    const user = await this.userRepository.findOne({
      where: {email: loginUser.email},
    });
    if (!user) throw new HttpErrors.BadRequest(ERRORS.USER_NOTFOUND);
    await this.hash.checkPass(loginUser.password, user.password);
    const token = await this.jwtService.generateToken(user);
    return {message: SUCCESS.SUCCESS, data: {user, token}};
  }

  @get('/user/{id}')
  @response(200)
  async getUser(@param.path.string('id') id: string): Promise<object> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new HttpErrors.NotFound(ERRORS.USER_NOTFOUND);
    return {message: SUCCESS.SUCCESS, data: user};
  }

  @authenticate('jwt')
  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.userRepository.create(user);
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}

export interface LoginUser {
  email: string;
  password: string;
}
