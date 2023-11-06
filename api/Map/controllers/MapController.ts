import {
  JsonController,
  Post,
  BodyParam,
  HeaderParam,
} from 'routing-controllers';
/*
Field Name vs FireBase Name
Geo-point (identifier and con to alert) | coordinates                                   
Event (policy etc)                      | event
info (body)                             | info
Created at                              | created_at
Creaed by (uid)                         | created_by
*/
import { LOGGING_INFO } from '../MapApiInfo';
import { Service } from 'typedi';
import LoggingSvc from '../service/MapSvc';
import { DecodedIdToken } from 'firebase-admin/auth';
@JsonController(LOGGING_INFO.contextPath + '/logger')
@Service()
export class LoggingController {
  constructor(public _loggingSvc: LoggingSvc) {}
  @Post('/log')
  public async submitLog(
    @HeaderParam('Authorization') token: string,
    @BodyParam('log') log: string,
    @BodyParam('type') type: string,
    @BodyParam('written_by') written_by: string,
    @BodyParam('message') message: string
  ): Promise<any> {
    try {
      if (!log) {
        return Promise.reject({
          status: 400,
          message: 'Invalid log',
        });
      }
      // make sure all the body params are present
      if (!type || !written_by || !message || !token) {
        return Promise.reject({
          status: 400,
          message: 'Missing required body params',
        });
      }
      token = token.split(' ')[1];

      const decodedToken: DecodedIdToken | Error =
        await this._loggingSvc.verifyToken(token);

      if (decodedToken instanceof Error) {
        return Promise.resolve({
          status: 401,
          message: 'Invalid token',
        });
      }
      const resp = await this._loggingSvc.submitLog({
        type,
        written_by,
        message,
        user_uid: decodedToken.uid,
        response_code: 200,
      });
      return Promise.resolve({
        status: 200,
        message: 'Log submitted successfully',
        data: resp,
      });
    } catch (error) {
      return Promise.reject({
        status: 500,
        message: error,
      });
    }
  }
}
