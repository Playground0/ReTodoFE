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
import { ITask } from 'src/app/private/model/task.model';
import {
  DefaultPanels,
  TaskActions,
} from 'src/app/private/model/UI/tasks.contanst';
import { IDialogData, ITaskUI } from 'src/app/private/model/UI/task-ui';
import { DateService } from 'src/app/shared/service/date.service';

@Component({
  selector: 'app-task-editor-dialog',
  templateUrl: './task-editor-dialog.component.html',
  styleUrls: ['./task-editor-dialog.component.scss'],
})
//TODO: Refactor the whole component
export class TaskEditorDialogComponent implements OnInit {
  taskForm!: FormGroup;
  isRecurring = false
  minDate = '';
  showTimePicker = false;
  priorityLevels = [
    {
      value: 1,
      name: 'Low',
    },
    {
      value: 2,
      name: 'Normal',
    },
    {
      value: 3,
      name: 'High',
    },
    {
      value: 4,
      name: 'Urgent',
    },
  ];
  reminder = false;
  data!: ITask | undefined;
  dataChanged: boolean = false;
  initialFormData: any;

  constructor(
    public dialogRef: MatDialogRef<TaskEditorDialogComponent>,
    private fb: FormBuilder, private dateService : DateService,
    @Inject(MAT_DIALOG_DATA) public dialogData: IDialogData
  ) {
    this.taskForm = this.fb.group({
      taskTitle: ['', [Validators.required]],
      taskDesc: [''],
      taskStartDate: [''],
      taskEndDate: [''],
      taskEndTime: [''],
      priority: [''],
      reminder: [false],
      isRecurring: [false],
      occurance: [''],
    });
    this.minDate = this.dateService.getStartOfDay()

    this.data = this.dialogData.data as ITask;

    if (dialogData.panel === DefaultPanels.Today) {
      const today = dayjs().toISOString();
      this.taskForm.get('taskEndDate')?.setValue(today);
    } else if (dialogData.panel === DefaultPanels.Upcoming) {
      const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
      this.taskForm.get('taskEndDate')?.setValue(tomorrow);
    }
  }

  ngOnInit(): void {
    if (this.data) {
      const newData = this.data as ITask;
      this.taskForm.get('taskTitle')?.setValue(newData.taskTitle);
      this.taskForm.get('taskDesc')?.setValue(newData.taskDesc);
      this.taskForm.get('taskStartDate')?.setValue(newData.taskStartDate)
      this.taskForm.get('taskEndDate')?.setValue(newData.taskEndDate);
      this.taskForm.get('taskEndTime')?.setValue('');
      this.taskForm.get('priority')?.setValue(newData.priority);
      this.taskForm.get('reminder')?.setValue(newData.reminder);
      this.taskForm.get('isRecurring')?.setValue(newData.isRecurring);
      this.taskForm.get('occurance')?.setValue(newData.occurance);
      this.initialFormData = this.taskForm.value;
    }

    this.taskForm.valueChanges.subscribe(() => {
      if (this.data) {
        const currentFormData = this.taskForm.value;
        this.dataChanged = !this.isFormValueEqual(
          this.initialFormData,
          currentFormData
        );
      }
    });
  }

  addTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAsTouched();
      return;
    }
    const dialogData: IDialogData = {
      action: TaskActions.Add,
      data: this.taskForm.value as ITaskUI,
    };
    this.dialogRef.close(dialogData);
  }

  toggleTimePicker() {
    this.showTimePicker = !this.showTimePicker;
  }
  clearTime() {
    this.taskForm.get('taskEndTime')?.reset();
  }

  toggleReurring() {
      this.isRecurring = !this.isRecurring
  }

  saveData() {
    const updateData = this.data as ITask;
    updateData.taskTitle = this.taskForm.get('taskTitle')?.value;
    updateData.taskDesc = this.taskForm.get('taskDesc')?.value;
    updateData.taskStartDate = this.taskForm.get('taskStartDate')?.value;
    updateData.taskEndDate = this.taskForm.get('taskEndDate')?.value;
    updateData.priority = this.taskForm.get('priority')?.value;
    updateData.reminder = this.taskForm.get('reminder')?.value;
    updateData.isRecurring = this.taskForm.get('isRecurring')?.value;
    updateData.occurance = this.taskForm.get('occurance')?.value;

    const dialogData: IDialogData = {
      action: TaskActions.Update,
      data: updateData,
    };
    this.dialogRef.close(dialogData);
  }

  deleteTask() {
    const data = this.data as ITask
    const dialogData: IDialogData = {
      action: TaskActions.Delete,
      data: data._id,
    };
    this.dialogRef.close(dialogData);
  }

  isFormValueEqual(initialValue: any, currentValue: any): boolean {
    // Logic to compare form values
    // You may need to implement custom comparison logic based on your specific requirements
    return JSON.stringify(initialValue) === JSON.stringify(currentValue);
  }
}
