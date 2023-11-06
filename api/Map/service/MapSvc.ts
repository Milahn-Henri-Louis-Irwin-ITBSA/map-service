import { DecodedIdToken } from 'firebase-admin/auth';
import DatabaseConnector from '../../../libs/db/MapDB';
import { Service } from 'typedi';
import { MapData } from 'types/types';

@Service()
export default class MapSvc {
  private db: DatabaseConnector;
  constructor() {
    this.db = new DatabaseConnector();
  }

  public async verifyToken(token: string): Promise<DecodedIdToken | Error> {
    try {
      return await this.db.verifyJWT(token);
    } catch (e) {
      return new Error(e as string);
    }
  }

  public async checkCoordinates(coordinates: { long: number; lang: number }): Promise<any> {
    return await this.db.getByCoordinates(coordinates);
  }

  public async setAlert(mapData: MapData): Promise<any> {
    return await this.db.set(mapData)
  }
}
