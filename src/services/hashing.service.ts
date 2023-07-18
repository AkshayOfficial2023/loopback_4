import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {compare, genSalt, hash} from 'bcrypt';

@injectable({scope: BindingScope.TRANSIENT})
export class HashingService {
  constructor(/* Add @inject to inject parameters */) {}

  async hashPass(password:string){
    const salt = await genSalt(10)
    return await hash(password,salt)
  }

  async checkPass(userPass:string,dbPass:string){
    const password = await compare(userPass,dbPass)
    if(!password) throw new HttpErrors.Unauthorized('Wrong Password')
    return true
  }
}
