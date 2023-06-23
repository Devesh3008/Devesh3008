import { Router } from '@angular/router';
import { User } from './../models/register.model';
import { ApiService } from '../services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit {

  dataSource!: MatTableDataSource<User>;
  public users!: User[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['Id', 'firstName', 'lastName', 'email', 'mobile', 'bmiResult', 'gender', 'package', 'enquiryDate', 'action'];

  constructor(private apiService: ApiService, private router: Router,private route:ActivatedRoute, private confirmService: NgConfirmService, private toastService: NgToastService){
    this.getUsers();
   }

  ngOnInit() {
    // console.log('registration list')
    // this.getUsers();
  };

  async getUsers() {
   await this.apiService.getRegisteredUser().subscribe((res:any)=>{
      console.log("reponse here{]",res);
      this.dataSource.data=res;
      console.log("User data here", this.dataSource)
    });
  
  }

  edit(id: number) {
    this.router.navigate(['update', id])
  };

  deleteUser(id: number) {
    this.confirmService.showConfirm("Are you sure want to Delete?",
      () => {
      
        this.apiService.deleteRegistered(id)
          .subscribe({
            next: (res: any) => {
              this.toastService.success({ detail: 'SUCCESS', summary: 'Deleted Successfully', duration: 3000 });
              this.getUsers();
            },
            error: (err: any) => {
              this.toastService.error({ detail: 'ERROR', summary: 'Something went wrong!', duration: 3000 });
            }
          })
      },
      () => {
      })

  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

};