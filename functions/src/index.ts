/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import { createUserApp } from './create-user';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const createUser = functions.https.onRequest(createUserApp);

export const onAddCourseUpdatePromoCounter =
    functions.firestore.document('courses/{courseId}')
        .onCreate(async (snap, context) => {
            await (await import('./promotions-counter/on-add-course')).default(snap, context);
        })

export const onUpdateCourseUpdatePromoCounter  =
    functions.firestore.document('courses/{courseId}')
        .onUpdate(async (changes, context) => {
            await (await import('./promotions-counter/on-update-course')).default(changes, context);
        })

export const onDeleteCourseUpdatePromoCounter  =
    functions.firestore.document('courses/{courseId}')
        .onDelete(async (changes, context) => {
            await (await import('./promotions-counter/on-delete-course')).default(changes, context);
        })
