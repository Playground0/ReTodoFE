import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as dayjs from 'dayjs';
import { ITask } from 'src/app/private/model/task';
import { IDialogData, ITaskUI } from 'src/app/private/model/task-ui';

@Component({
  selector: 'app-task-editor-dialog',
  templateUrl: './task-editor-dialog.component.html',
  styleUrls: ['./task-editor-dialog.component.scss'],
})
export class TaskEditorDialogComponent implements OnInit {
  taskFrom!: FormGroup;
  maxDate = '2014-05-29T08:30';
  showTimePicker = false;
  priorityLevels = [
    {
      value: 0,
      name: 'Low',
    },
    {
      value: 1,
      name: 'Normal',
    },
    {
      value: 2,
      name: 'High',
    },
    {
      value: 3,
      name: 'Urgent',
    },
  ];
  reminder = false;
  data!: ITask;
  dataChanged: boolean = false;
  initialFormData: any;

  constructor(
    public dialogRef: MatDialogRef<TaskEditorDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.taskFrom = this.fb.group({
      taskTitle: ['', [Validators.required]],
      taskDesc: [''],
      taskEndDate: [''],
      taskEndTime: [''],
      priority: [''],
      reminder: [false],
      isRecurring: [false],
      occurance: [''],
    });

    this.data = this.dialogData.data;

    if (dialogData.panel === 'today') {
      const today = dayjs().toISOString();
      this.taskFrom.get('taskEndDate')?.setValue(today);
    } else if (dialogData.panel === 'upcoming') {
      const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
      this.taskFrom.get('taskEndDate')?.setValue(tomorrow);
    }
  }

  ngOnInit(): void {
    if (this.data) {
      this.taskFrom.get('taskTitle')?.setValue(this.data.taskTitle);
      this.taskFrom.get('taskDesc')?.setValue(this.data.taskDesc);
      this.taskFrom.get('taskEndDate')?.setValue(this.data.taskEndDate);
      this.taskFrom.get('taskEndTime')?.setValue('');
      this.taskFrom.get('priority')?.setValue(this.data.priority);
      this.taskFrom.get('reminder')?.setValue(this.data.reminder);
      this.taskFrom.get('isRecurring')?.setValue(this.data.isRecurring);
      this.taskFrom.get('occurance')?.setValue(this.data.occurance);
      this.initialFormData = this.taskFrom.value;
    }

    this.taskFrom.valueChanges.subscribe(() => {
      if (this.data) {
        const currentFormData = this.taskFrom.value;
        this.dataChanged = !this.isFormValueEqual(
          this.initialFormData,
          currentFormData
        );
      }
    });
  }

  addTask() {
    if (this.taskFrom.invalid) {
      this.taskFrom.markAsTouched();
      return;
    }
    const dialogData: IDialogData = {
      action: 'add',
      data: this.taskFrom.value as ITaskUI,
    };
    this.dialogRef.close(dialogData);
  }

  toggleTimePicker() {
    this.showTimePicker = !this.showTimePicker;
  }
  clearTime() {
    this.taskFrom.get('taskEndTime')?.reset();
  }

  toggleReurring() {
    //TODO: implememt Recurring feature
  }

  saveData() {
    this.data.taskTitle = this.taskFrom.get('taskTitle')?.value;
    this.data.taskDesc = this.taskFrom.get('taskDesc')?.value;
    this.data.taskEndDate = this.taskFrom.get('taskEndDate')?.value;
    this.data.priority = this.taskFrom.get('priority')?.value;
    this.data.reminder = this.taskFrom.get('reminder')?.value;
    this.data.isRecurring = this.taskFrom.get('isRecurring')?.value;
    this.data.occurance = this.taskFrom.get('occurance')?.value;
    const dialogData: IDialogData = {
      action: 'update',
      data: this.data,
    };
    this.dialogRef.close(dialogData);
  }

  deleteTask(taskId: string) {
    const dialogData: IDialogData = {
      action: 'delete',
      data: taskId,
    };
    this.dialogRef.close(dialogData);
  }

  isFormValueEqual(initialValue: any, currentValue: any): boolean {
    // Logic to compare form values
    // You may need to implement custom comparison logic based on your specific requirements
    return JSON.stringify(initialValue) === JSON.stringify(currentValue);
  }
}
