import {
  JsonController,
  Post,
  BodyParam,
  HeaderParam,
} from 'routing-controllers';
/*
Geo-point (identifier and con to alert)
Icon
Event (policy etc)
Created at
*/
import { MAP_INFO } from '../MapApiInfo';
import { Service } from 'typedi';
import MapSvc from '../service/MapSvc';
import { DecodedIdToken } from 'firebase-admin/auth';
import type { EventTypes } from '../../../types/types';
import { events } from '../../../types/consts';
import { Timestamp } from 'firebase-admin/firestore';
@JsonController(MAP_INFO.contextPath + '/map')
@Service()
export class MapController {
  constructor(public _mapSvc: MapSvc) {}
  @Post('/plot')
  public async submitLog(
    @HeaderParam('Authorization') token: string,
    @BodyParam('coordinates') coordinates: { long: number; lang: number },
    @BodyParam('icon') icon: String,
    @BodyParam('event') event: EventTypes,
    @BodyParam('info') info: String
  ): Promise<any> {
    try {
      if (!token) {
        return Promise.resolve({ error: 'No token provided', status: 401 });
      }
      if (!coordinates) {
        return Promise.resolve({
          error: 'No coordinates provided',
          status: 401,
        });
      }
      if (!icon) {
        return Promise.resolve({ error: 'No icon provided', status: 401 });
      }
      if (!event) {
        return Promise.resolve({ error: 'No event provided', status: 401 });
      }
      if (events.indexOf(event) === -1) {
        return Promise.resolve({
          error: 'Invalid event provided',
          status: 401,
          possibleEvents: events,
        });
      }
      token = token.split(' ')[1];

      const decodedToken: DecodedIdToken | Error =
        await this._mapSvc.verifyToken(token);

      if (decodedToken instanceof Error) {
        return Promise.resolve({
          status: 401,
          message: 'Invalid token',
        });
      }

      const coordsFound = await this._mapSvc.checkCoordinates(coordinates);
      if (coordsFound > 0) {
        return Promise.resolve({
          status: 409,
          message: 'Coordinates have already been plotted',
        });
      } else {
        await this._mapSvc.setAlert({
          coordinates,
          event,
          icon,
          info,
          created_by: decodedToken.uid,
          created_at: Timestamp.now(),
        });

        return Promise.resolve({
          status: 200,
          event,
          coordinates,
          info,
        });
      }
    } catch (error) {
      return Promise.reject({
        status: 500,
        message: error,
      });
    }
  }
}
