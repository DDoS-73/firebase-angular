import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Course } from '../model/course';
import { concatMap, map } from 'rxjs/operators';
import { convertSnaps } from './db-utils';
import { Lesson } from '../model/lesson';

@Injectable({
    providedIn: 'root',
})
export class CoursesService {
    constructor(private db: AngularFirestore) {
    }

    loadCoursesByCategory(category: string): Observable<Course[]> {
        return this.db
            .collection(
            'courses',
            ref =>
                ref.where('categories', 'array-contains', category).orderBy('seqNo')
            )
            .get()
            .pipe(map(results => convertSnaps<Course>(results)));
    }

    createCourse(newCourse: Partial<Course>, courseId?: string): Observable<Course> {
        return this.db.collection(
            'courses',
                ref => ref.orderBy('seqNo', 'desc').limit(1)
        ).get()
            .pipe(
                concatMap(result => {
                    const courses = convertSnaps<Course>(result);
                    const lastSeqNo = courses[0]?.seqNo ?? 0;

                    const course = {
                        seqNo: lastSeqNo + 1,
                        ...newCourse
                    } as Course;

                    let save$: Observable<any>;

                    if (courseId) {
                        save$ = from(this.db.doc(`/courses/${courseId}`).set(course));
                    } else {
                        save$ = from(this.db.collection('courses').add(course));
                    }

                    return save$.pipe(
                        map(res => {
                            return {
                                id: courseId ?? res.id,
                                ...course
                            } as Course;
                        })
                    );
                })
            );
    }

    updateCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        return from(this.db.doc(`/courses/${courseId}`).update(changes));
    }

    deleteCourse(courseId: string): Observable<void> {
        return from(this.db.doc(`/courses/${courseId}`).delete());
    }

    deleteCourseAndLessons(courseId: string): Observable<void> {
        return this.db.collection(`/courses/${courseId}/lessons`)
            .get()
            .pipe(
                concatMap(results => {
                    const lessons = convertSnaps<Lesson>(results);

                    const batch = this.db.firestore.batch();

                    const courseRef = this.db.doc(`/courses/${courseId}`).ref;
                    batch.delete(courseRef);

                    for (const lesson of lessons) {
                        const lessonRef =
                            this.db.doc(`/courses/${courseId}/lessons/${lesson.id}`).ref;
                        batch.delete(lessonRef);
                    }

                    return from(batch.commit());
                })
            );
    }
}
