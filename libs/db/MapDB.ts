import admin from 'firebase-admin';
import type {
  CollectionReference,
  Firestore,
  WriteResult,
} from 'firebase-admin/firestore';
import type { DecodedIdToken } from 'firebase-admin/auth';
import IMapData from '../../interfaces/IMapDB';
import type { MapData } from '../../types/types';
class MapDB implements IMapData {
  private db: Firestore;

  constructor() {
    this.db = admin.firestore();
  }

  // private initializeFirebase(): App {
  //   try {
  //     return admin.initializeApp({
  //       credential: admin.credential.cert(firebaseConfig as ServiceAccount),
  //     });
  //   } catch (e: any) {
  //     throw new Error(e);
  //   }
  // }

  public async set(data: MapData): Promise<WriteResult> {
    try {
      const collectionRef: CollectionReference = this.db.collection('map');
      return await collectionRef.doc().set(data);
    } catch (e: any) {
      throw new Error(e);
    }
  }
  public async getByID(id: string): Promise<MapData | null> {
    try {
      const collectionRef: CollectionReference = this.db.collection('map');
      const docRef = await collectionRef.doc(id).get();
      if (docRef.exists) {
        return docRef.data() as MapData;
      }
      return null;
    } catch (e: any) {
      throw new Error(e);
    }
  }
  public async getByCoordinates(coordinates: {
    long: number;
    lang: number;
  }): Promise<number | null> {
    try {
      const collectionRef: CollectionReference = this.db.collection('map');
      const docRef = await collectionRef
        .where(
          'coordinates',
          '==',
          new admin.firestore.GeoPoint(coordinates.lang, coordinates.long)
        )
        .get();

      return docRef.size;
    } catch (e: any) {
      throw new Error(e);
    }
  }
  public async update(
    logReference: string,
    data: Partial<MapData>
  ): Promise<WriteResult> {
    try {
      const collectionRef: CollectionReference = this.db.collection('map');
      return await collectionRef.doc(logReference).update(data);
    } catch (e: any) {
      throw new Error(e);
    }
  }
  public async deleteByID(id: string): Promise<Boolean> {
    try {
      const collectionRef: CollectionReference = this.db.collection('map');
      return !!(await collectionRef.doc(id).delete());
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async verifyJWT(token: string): Promise<DecodedIdToken> {
    try {
      return await admin.auth().verifyIdToken(token);
    } catch (e: any) {
      throw new Error(e);
    }
  }
}

export default MapDB;
