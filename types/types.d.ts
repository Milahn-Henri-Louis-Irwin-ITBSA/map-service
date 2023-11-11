import type { GeoPoint, Timestamp } from 'firebase-admin/firestore';
import type { DecodedIdToken } from 'firebase-admin/auth';

export type EventTypes =
  | 'police'
  | 'fire'
  | 'medical'
  | 'animal'
  | 'road'
  | 'other';

export interface MapData {
  created_at: Timestamp;
  coordinates: GeoPoint;
  created_by: DecodedIdToken['uid'];
  event: EventTypes;
  info: String;
}
