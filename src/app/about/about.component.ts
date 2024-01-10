import {Component, OnInit} from '@angular/core';


import 'firebase/firestore';

import {AngularFirestore} from '@angular/fire/firestore';
import {COURSES, findLessonsForCourse} from './db-data';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {

    constructor(private db: AngularFirestore) {
    }

    async uploadData() {
        const coursesCollection = this.db.collection('courses');
        const courses = await this.db.collection('courses').get();
        for (let course of Object.values(COURSES)) {
            const newCourse = this.removeId(course);
            const courseRef = await coursesCollection.add(newCourse);
            const lessons = await courseRef.collection('lessons');
            const courseLessons = findLessonsForCourse(course['id']);
            console.log(`Uploading course ${course['description']}`);
            for (const lesson of courseLessons) {
                const newLesson = this.removeId(lesson);
                delete newLesson.courseId;
                await lessons.add(newLesson);
            }
        }
    }

    removeId(data: any) {
        const newData: any = {...data};
        delete newData.id;
        return newData;
    }


    onReadDoc() {
        this.db.doc('/courses/2RTZMra8RYkance3rgTU').get().subscribe(
            (snap) => {
                console.log(snap.id);
                console.log(snap.data());
            }
        )
    }

    onReadTopLevelCollection() {
        this.db.collection('courses').get().subscribe(snaps => {
            snaps.forEach(snap => {
                console.log(snap.id);
                console.log(snap.data());
            });
        });
    }

    onReadNestedCollection() {
        this.db.collection('/courses/2RTZMra8RYkance3rgTU/lessons').get().subscribe(snaps => {
            snaps.forEach(snap => {
                console.log(snap.id);
                console.log(snap.data());
            });
        })
    }

    onReadFilteredNestedCollection() {
        this.db.collection(
            '/courses/2RTZMra8RYkance3rgTU/lessons',
            ref => ref.where('seqNo', '<=', 5)
        ).get().subscribe(snaps => {
            snaps.forEach(snap => {
                console.log(snap.id);
                console.log(snap.data());
            });
        })
    }

    onReadFilteredCollectionWithCombinedIndex() {
        this.db.collection(
            'courses',
            ref => ref
                .where('price', '<=', 100)
                .where('promo', '==', false)
        ).get().subscribe(snaps => {
            snaps.forEach(snap => {
                console.log(snap.id);
                console.log(snap.data());
            });
        });
    }

    onReadCollectionGroup() {
        this.db.collectionGroup(
            'lessons',
            ref => ref.where('seqNo', '==', 1)
        ).get().subscribe(snaps => {
            snaps.forEach(snap => {
                console.log(snap.id);
                console.log(snap.data());
            });
        });
    }


    onReadDocUsingSnapshotChanges() {
        this.db.doc('/courses/2RTZMra8RYkance3rgTU').snapshotChanges().subscribe(
            (snap) => {
                console.log(snap.payload.id);
                console.log(snap.payload.data());
            }
        )
    }
}
















