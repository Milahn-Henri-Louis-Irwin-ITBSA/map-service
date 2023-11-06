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
    coordinates: { long: number; lang: number };
    created_by: DecodedIdToken['uid'];
    event: EventTypes;
    icon: String;
    info: String;
  }