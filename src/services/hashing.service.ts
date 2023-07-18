import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import bcrypt from 'bcrypt';

@injectable({scope: BindingScope.TRANSIENT})
export class HashingService {
  constructor(/* Add @inject to inject parameters */) {}

  async hashPass(password:string){
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password,salt)
    return hashedPass
  }

  async checkPass(userPass:string,dbPass:string){
    const password = await bcrypt.compare(userPass,dbPass)
    if(!password) throw new HttpErrors.BadRequest('Wrong Password')
    return true
  }
}
