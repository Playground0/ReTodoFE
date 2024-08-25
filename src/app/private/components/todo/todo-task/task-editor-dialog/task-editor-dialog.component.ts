import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-editor-dialog',
  templateUrl: './task-editor-dialog.component.html',
  styleUrls: ['./task-editor-dialog.component.scss'],
})
//TODO: Refactor the whole component
export class TaskEditorDialogComponent implements OnInit, OnDestroy {
  taskForm!: FormGroup;
  isRecurring = false;
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
  istimePickerAppendToInput = true;
  timeSlots: string[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<TaskEditorDialogComponent>,
    private fb: FormBuilder,
    private dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public dialogData: IDialogData
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.data = this.dialogData.data as ITask;
    if (this.data) {
      this.setupUpdateFormData(this.data);
    }
    this.setupFormSubscription();
    this.setupDatesOnPanel();
    this.minDate = this.dateService.getStartOfDay();
  }

  initializeForm() {
    this.taskForm = this.fb.group({
      taskTitle: ['', [Validators.required]],
      taskDesc: [''],
      taskStartDate: [null],
      taskEndDate: [null],
      taskEndTime: [{ value: null, disabled: true }],
      priority: [''],
      reminder: [false],
      isRecurring: [false],
      occurance: [''],
    });
  }

  setupDatesOnPanel() {
    if (this.taskForm.get('taskEndDate')?.value) return;
    const taskEndDate = this.taskForm.get('taskEndDate');
    if (this.dialogData.panel === DefaultPanels.Today) {
      const today = dayjs().toISOString();
      taskEndDate?.setValue(today);
    } else if (this.dialogData.panel === DefaultPanels.Upcoming) {
      const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
      taskEndDate?.setValue(tomorrow);
    }
  }

  setupUpdateFormData(newData: ITask) {
    const taskControls = [
      'taskTitle',
      'taskDesc',
      'taskStartDate',
      'taskEndDate',
      'priority',
      'reminder',
      'isRecurring',
      'occurance',
    ];

    taskControls.forEach((control) => {
      this.taskForm.get(control)?.setValue(newData[control as keyof ITask]);
    });

    if (newData.taskEndDate) {
      this.handleTaskEndDateChange(newData.taskEndDate);
      const endTime = this.setEndTime(newData.taskEndDate);
      this.taskForm.get('taskEndTime')?.setValue(endTime);
    }
    this.initialFormData = this.taskForm.value;
  }

  setupFormSubscription() {
    this.subscription.add(
      this.taskForm
        .get('taskEndDate')
        ?.valueChanges.subscribe((value) => this.handleTaskEndDateChange(value))
    );
    this.subscription.add(
      this.taskForm.valueChanges.subscribe((values) =>
        this.checkDataChanges(values)
      )
    );
  }

  handleTaskEndDateChange(value: string) {
    const endTime = this.taskForm.get('taskEndTime');
    if (value) {
      this.setupTimeSlots();
      endTime?.enable();
    } else {
      this.timeSlots = [];
      endTime?.disable();
    }
  }

  checkDataChanges(data: ITask) {
    if (data) {
      const currentFormData = this.taskForm.value;
      this.dataChanged = !this.isFormValueEqual(
        this.initialFormData,
        currentFormData
      );
    }
  }

  addTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAsTouched();
      return;
    }
    this.setupDateAndTime();
    const dialogData: IDialogData = {
      action: TaskActions.Add,
      data: this.taskForm.value as ITaskUI,
    };
    this.dialogRef.close(dialogData);
  }

  clearTime() {
    this.taskForm.get('taskEndTime')?.reset();
  }

  saveData() {
    this.setupDateAndTime();
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
    // console.log(dialogData)
    this.dialogRef.close(dialogData);
  }

  deleteTask() {
    const data = this.data as ITask;
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

  generateTimeSlots() {
    const times: string[] = [];
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? '0' + i : i;
      times.push(`${hour}:00`, `${hour}:15`, `${hour}:30`, `${hour}:45`);
    }
    return times;
  }

  filterValidTimeSlots(allTimeSlots: string[]): string[] {
    const endDate = dayjs(this.taskForm.get('taskEndDate')?.value);

    if (endDate.isSame(dayjs(), 'day')) {
      const currentTime = dayjs();
      return allTimeSlots.filter((time) => {
        const [hour, minute] = time.split(':').map(Number);
        const timeSlot = dayjs().hour(hour).minute(minute).second(0);
        return timeSlot.isAfter(currentTime);
      });
    }
    return allTimeSlots;
  }

  setTime(time: string, endDate: string): string {
    if (time) {
      const date = dayjs(endDate);
      const [hour, minute] = time.split(':').map(Number);

      if (isNaN(hour) || isNaN(minute)) {
        throw new Error('Invalid time format');
      }
      const dateTime = date.hour(hour).minute(minute).second(0).millisecond(0);
      return dateTime.format('YYYY-MM-DDTHH:mm:ss');
    }
    return dayjs(endDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
  }

  setEndTime(date: string) {
    if (!date) return '';
    const hour = dayjs(date).hour();
    const minutes = dayjs(date).minute();

    if (hour <= 0 && minutes === 0) {
      return '';
    }
    const time = date.split('T')[1].split(':');
    if (time) time.pop();
    const convertedTime = time.join(':');
    return convertedTime;
  }

  setupDateAndTime() {
    const time = this.taskForm.get('taskEndTime')?.value;
    const startDate = this.taskForm.get('taskStartDate')?.value;
    const endDate = this.taskForm.get('taskEndDate')?.value;

    if (time) {
      this.updateDateWithTime(startDate, time, 'taskStartDate');
      this.updateDateWithTime(endDate, time, 'taskEndDate');
      return
    }

    this.setStartOfDay(startDate, 'taskStartDate');
    this.setStartOfDay(endDate, 'taskEndDate');
  }

  private updateDateWithTime(date: string | null, time: string, controlName: string) {
    if (date) {
      const formattedDate = this.setTime(time, date);
      this.taskForm.get(controlName)?.setValue(formattedDate);
    }
  }

  private setStartOfDay(date: string | null, controlName: string) {
    if (date) {
      const startOfDay = this.dateService.getStartOfDay(date);
      this.taskForm.get(controlName)?.setValue(startOfDay);
    }
  }

  setupTimeSlots() {
    const times = this.generateTimeSlots();
    this.timeSlots = this.filterValidTimeSlots(times);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
