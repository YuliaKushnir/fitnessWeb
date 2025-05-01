import { AfterViewInit, Component, ElementRef, viewChild, ViewChild } from '@angular/core';
import { UserService } from '../../service/user.service';
import { SharedModule } from '../../shared/shared.module';
import Chart, { CategoryScale } from 'chart.js/auto';
import { DatePipe } from '@angular/common';

Chart.register(CategoryScale);

@Component({
  selector: 'app-dashboard',
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers:[DatePipe]
})

export class DashboardComponent implements AfterViewInit {

  statsData:any;
  workouts:any;
  activities:any;

  @ViewChild('workoutLineChart') private workoutLineChartRef:ElementRef;
  @ViewChild('activityLineChart') private activityLineChartRef:ElementRef;

  constructor(private userService: UserService,
    private datePipe: DatePipe
  ){}

  ngOnInit(){
    this.getStats();
    this.getGraphStats();
  }

  getGraphStats(){
    this.userService.getGraphStats().subscribe(res=>{
      this.workouts = res.workouts;
      this.activities = res.activities;
      console.log(this.workouts, this.activities);

      if(this.workoutLineChartRef || this.workoutLineChartRef){
        this.createLineChart();
      }
    })
  }

  ngAfterViewInit(){
    if(this.workouts && this.activities){
      this.createLineChart();
    }
  }

  createLineChart(){
    const workoutCtx = this.workoutLineChartRef.nativeElement.getContext('2d');
    const activityCtx = this.activityLineChartRef.nativeElement.getContext('2d');

    new Chart(workoutCtx, {
      type: 'line',
      data: {
        labels: this.workouts.map((data: {date:any;})=> this.datePipe.transform(data.date, 'MM/dd')),
        datasets: [
          {
            label: 'calories burned',
            data: this.workouts.map((data: {caloriesBurned: any; }) => data.caloriesBurned),
            fill:false,
            borderWidth: 2,
            backgroundColor: 'rgba(84, 203, 124, 0.6)',
            borderColor: 'rgba(0, 100, 0, 1)',
          }, 
          {
            label: 'duration',
            data: this.workouts.map((data: { duration: any; }) => data.duration),
            fill:false,
            borderWidth: 2,
            backgroundColor: 'rgba(120, 180, 200, 0.6)',
            borderColor: 'rgba(0, 100, 150, 1)',
          }, 
        ]
      }, 
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    new Chart(activityCtx, {
      type: 'line',
      data: {
        labels: this.activities.map((data: {date:any;})=> this.datePipe.transform(data.date, 'MM/dd')),
        datasets: [
          {
            label: 'calories burned',
            data: this.activities.map((data: {caloriesBurned: any; }) => data.caloriesBurned),
            fill:false,
            borderWidth: 2,
            backgroundColor: 'rgba(84, 203, 124, 0.6)',
            borderColor: 'rgba(0, 100, 0, 1)',
          }, 
          {
            label: 'steps',
            data: this.activities.map((data: { steps: any; }) => data.steps),
            fill:false,
            borderWidth: 2,
            backgroundColor: 'rgba(120, 180, 200, 0.6)',
            borderColor: 'rgba(0, 100, 150, 1)',
          }, 
          {
            label: 'distance',
            data: this.activities.map((data: { distance: any; }) => data.distance),
            fill:false,
            borderWidth: 2,
            backgroundColor: 'rgba(179, 120, 200, 0.6)',
            borderColor: 'rgb(135, 0, 150)',
          }
        ]
      }, 
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  getStats(){
    this.userService.getStats().subscribe(res=>{
      console.log(res);
      this.statsData = res;
    })
  }

}



