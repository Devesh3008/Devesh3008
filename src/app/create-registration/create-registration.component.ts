import { User } from './../models/register.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit {

  selectedGender!: string;
  genders: string[] = ["Male", "Female"];
  packages: string[] = ["Monthly", "Quarterly", "Yearly"];
  importantList: string[] = [
    "Strenghth Training",
    "Energy and Endurance",
    "Building Lean Muscle",
    "Aerobic Training",
    "Balance and cordination",
    "Fitness"
  ]

  registrationForm!: FormGroup;
  private userIdToUpdate!: number;
  public isUpdateActive: boolean = false;

  constructor(private fb: FormBuilder, private api: ApiService, private toastService: NgToastService, private activatedRoute: ActivatedRoute, private router: Router) {

  }
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: [''],
    });


    this.registrationForm.controls['height'].valueChanges.subscribe(res => {
      this.calculateBmi(res);
    });

    this.activatedRoute.params.subscribe(val => {
      this.userIdToUpdate = val['Id'];
      if (this.userIdToUpdate) {
        this.isUpdateActive = true;
        this.api.getRegisteredUserId(this.userIdToUpdate)
          .subscribe({
            next: (res: User) => {
              this.fillFormToUpdate(res);
            },
            error: (err: any) => {
              console.log(err);
            }
          })
      }
    })
  };
  // submit(): void {
  //   try{
  //   this.api.postRegistration(this.registrationForm.value)
  //     .subscribe((res) => { 
  //       console.log('submit',res)
  //       this.toastService.success({ detail: 'SUCCESS', summary: 'Registration Successful', duration: 3000 });
  //       this.registrationForm.reset();
  //     },(err)=>{
  //       console.log(err)
  //     }
  //     );
  //   } catch(err){console.log(err)}
  //   }

  submit(){
console.log("inside constructor");
console.log(this.registrationForm);
if(this.registrationForm.invalid) return
this.api.postRegistration(this.registrationForm.value);
this.toastService.success({ detail: 'SUCCESS', summary: 'Registration Successful', duration: 3000 });
  }
    
    update() {
      this.api.updateRegisterUser(this.registrationForm.value, this.userIdToUpdate)
        .subscribe((res: any) => {
          this.toastService.success({ detail: 'SUCCESS', summary: 'User Details Updated Successful', duration: 3000 });
          this.router.navigate(['/list']);
          this.registrationForm.reset();
        });
    }
  fillFormToUpdate(user: User) {
    this.registrationForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate
    })
  };


  calculateBmi(value: number) {
    const weight = this.registrationForm.value.weight; 
    const height = value; 
    const bmi = weight / (height * height);
    this.registrationForm.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi < 18.5:
        this.registrationForm.controls['bmiResult'].patchValue("Underweight");
        break;
      case (bmi >= 18.5 && bmi < 25):
        this.registrationForm.controls['bmiResult'].patchValue("Normal");
        break;
      case (bmi >= 25 && bmi < 30):
        this.registrationForm.controls['bmiResult'].patchValue("Overweight");
        break;

      default:
        this.registrationForm.controls['bmiResult'].patchValue("Obese");
        break;
    }
  }
  
};