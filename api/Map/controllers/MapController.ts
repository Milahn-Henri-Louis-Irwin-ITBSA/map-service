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
@JsonController(MAP_INFO.contextPath + '/map')
@Service()
export class MapController {
  constructor(public _mapSvc: MapSvc) {}
  @Post('/plot')
  public async submitLog(
    @HeaderParam('Authorization') token: string,
    @BodyParam('alertId') alertId: string,
    @BodyParam('icon') icon: string,
    @BodyParam('event') event: EventTypes,
  ): Promise<any> {
    try {
      if (!token) {
        return Promise.resolve({ error: 'No token provided', status: 401 });
      }
      if (!alertId) {
        return Promise.resolve({ error: 'No alertId provided', status: 401 });
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

      //TODO: Get alert from db. 
      //TODO: Plot point on map with current time
      //TODO: Add Icon
      //TODO: Add log of plotted point and who was the plot initiated from (AlertService/FeedService)
            
      // return Promise.resolve({
      //   status: 200,
      //   message: 'Location plotted successfully',
      //   data: resp,
      // });
    } catch (error) {
      return Promise.reject({
        status: 500,
        message: error,
      });
    }
  }
}
