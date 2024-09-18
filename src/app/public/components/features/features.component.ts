import { Component, Input, OnInit } from '@angular/core';

interface IFeatures {
  title: string;
  description: string;
  details?: string[];
  image?: string;
  matIcon?: string;
}

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit {
  @Input() isHome : boolean = false
  keyFeatures: IFeatures[] = [];
  detailedFeatureDesc: IFeatures[] = [];
  usp: IFeatures[] = [];
  roadMap: IFeatures[] = [];

  ngOnInit(): void {
    this.keyFeatures = [
      {
        title: 'Task Creation',
        description: `Quickly create tasks with ease. Just enter the task details, set a priority level, and hit save. 
          Our intuitive interface ensures you can add new tasks in seconds, keeping you organized and on track with your daily responsibilities.`,
        details: [
          'Simple task input form.',
          'Option to set task priorities (e.g., Urgent, High, Normal, Low).',
          'Supports adding additional notes to each task.',
          'Instant feedback upon task creation.',
        ],
        matIcon: 'add_task',
      },
      {
        title: 'Scheduled Tasks',
        description: `Plan ahead by scheduling tasks for specific dates and times. 
        Whether it’s a meeting, a reminder to pick up groceries, or an important deadline, scheduled tasks ensure you won't miss anything important.`,
        details: [
          'Set specific dates and times for each task',
          'Task level reminders for upcoming tasks.',
          'Supports adding additional notes to each task.',
          'Flexible rescheduling options.',
        ],
        matIcon: 'schedule',
      },
      {
        title: 'Recurring Tasks',
        description: `Automate your routine by creating recurring tasks. 
        Set tasks to repeat daily, weekly, monthly, or on custom intervals, so you never have to worry about forgetting a recurring activity again.`,
        details: [
          'Create daily, weekly, monthly, or custom recurring tasks',
          'Automatically generates future occurrences.',
          'Easy to edit or stop recurrences.',
          'Perfect for routine activities like workouts, bill payments, or weekly meetings.',
        ],
        matIcon: 'autorenew',
      },
      {
        title: 'User-Friendly Interface',
        description: `Experience a clean, intuitive interface designed with simplicity in mind. 
        Our user-friendly design ensures that managing your tasks is effortless, whether you're a new or experienced user.`,
        details: [
          'Minimalistic design focused on usability',
          'Easy navigation between different sections (e.g., Today, Upcoming, Completed)',
          'Responsive design for use on all devices (mobile, tablet, desktop).',
        ],
        matIcon: 'thumb_up',
      },
    ];
    this.detailedFeatureDesc = [
      {
        title: 'Quick Add',
        description: `Quickly add tasks on the go with a streamlined input process. 
        Perfect for those moments when you need to jot down a task quickly without any fuss.`,
        details: [
          'Minimal input fields for faster task creation',
        ],
        matIcon: 'flash_on'
      },
      {
        title: 'Task Organization',
        description: `Organize your tasks based on priority, due dates, or categories. 
        Easily find and focus on what's most important with the ability to filter and sort tasks.`,
        details: [
          'Customizable task lists to suit your workflow',
          'Search you task for quicker access',
        ],
        matIcon: 'view_list'
      },
      {
        title: 'Time-Sensitive Filters',
        description: `Stay on top of your schedule with time-sensitive filters. 
        View tasks for today, this week, or custom date ranges to focus on what matters most at any given time.`,
        details: [
          'Highlighting of overdue tasks to catch what you might have missed.',
          'Color-coded task priority for at-a-glance urgency assessment',
        ],
        matIcon:'filter_list'
      },
    ];
    this.usp = [
      {
        title: 'Clutter-Free Experience',
        description: `Emphasize how Retodo’s focus on simplicity helps users manage their tasks without feeling overwhelmed`,
      },
      {
        title: 'Data Privacy',
        description: `If your app emphasizes privacy (e.g., data not being stored on third-party servers), make this a key point.`,
      },
      {
        title: 'Recurring Tasks',
        description: 'You can create recurring tasks',
      },
    ];
  }
}
