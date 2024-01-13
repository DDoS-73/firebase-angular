import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Course } from '../model/course';
import { concatMap, map } from 'rxjs/operators';
import { convertSnaps } from './db-utils';

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
}
