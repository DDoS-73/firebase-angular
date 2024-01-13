import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import { CoursesService } from '../services/courses.service';


@Component({
    selector: 'edit-course-dialog',
    templateUrl: './edit-course-dialog.component.html',
    styleUrls: ['./edit-course-dialog.component.css']
})
export class EditCourseDialogComponent {

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private course: Course,
        private dialogRef: MatDialogRef<EditCourseDialogComponent>,
        private coursesService: CoursesService
    ) {
        this.form = this.fb.group({
            description: [this.course.description, Validators.required],
            longDescription: [this.course.longDescription, Validators.required],
            promo: [this.course.promo]
        });
    }

    save() {
        const changes = this.form.value;
        this.coursesService.updateCourse(this.course.id, changes).subscribe(() => {
            this.dialogRef.close(changes);
        });
    }
}






