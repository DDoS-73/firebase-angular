import * as functions from 'firebase-functions';
import { db } from '../init';
import { FieldValue } from 'firebase-admin/firestore'

export default async (changes, context) => {
    if (context.params.courseId === 'stats') {
        return;
    }

    functions.logger.debug(
        `Running update course trigger for courseId ${context.params.courseId}`
    )

    const newData = changes.after.data();
    const oldData = changes.before.data();

    let increment = 0;

    if(!oldData.promo && newData.promo) {
        increment = 1;
    } else if (oldData.promo && !newData.promo) {
        increment = -1;
    }

    if (increment === 0) {
        return;
    }

    return db.doc("courses/stats").update({
        totalPromo: FieldValue.increment(increment)
    })
}
