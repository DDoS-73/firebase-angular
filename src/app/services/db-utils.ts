import { QuerySnapshot } from '@angular/fire/firestore';

export function convertSnaps<T>(results: QuerySnapshot<any>): T[] {
    return results.docs.map(snap => ({id: snap.id, ...snap.data() as any}));
}
