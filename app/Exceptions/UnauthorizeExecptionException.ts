import { Exception } from '@adonisjs/core/build/standalone'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new UnauthorizeExecptionException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class UnauthorizeExecptionException extends Exception {
  constructor() {
    super('Unauthorize', 403, 'E_UNAUTHORIZE')
  }

  public async handle(error: this, {}) {
    return error
  }
}
