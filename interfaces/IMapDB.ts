import type { MapData } from '../types/types';
import type { WriteResult } from 'firebase-admin/firestore';
abstract class ILoggingDB {
  abstract set(data: MapData): Promise<WriteResult>;
  abstract getByID(id: string): Promise<MapData | null>;
  abstract update(
    logReference: string,
    data: Partial<MapData>
  ): Promise<WriteResult>;
  abstract deleteByID(id: string): Promise<Boolean>;
}
export default ILoggingDB;
