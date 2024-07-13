import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CallserviceService } from '../services/callservice.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  updateForm: FormGroup;
  userDetail: any;
  roleList: any;
  userId: any;
  title: any;

  constructor(
    private formBuilder: FormBuilder,
    private callService: CallserviceService,
    private router: Router,
    private activated: ActivatedRoute,
  ) {
    this.updateForm = this.formBuilder.group({
      fristName: '',
      lastName: '',
      phone: '',
      age: '',
      roleId: '',
      userName: ''
    });
  }

  ngOnInit() {
    this.getAllRole();

    this.userId = this.activated.snapshot.paramMap.get("userId");
    if (this.userId) {
      this.callService.getByUserId(this.userId).subscribe(res => {
        if (res.data) {
          this.title = "Your Profile User";
          this.userDetail = res.data;
          this.setDataForm(this.userDetail);
        }
      });
    } else {
      this.title = "Your Profile Login";
      const userDetailSession: any = sessionStorage.getItem("userDetail");
      this.userDetail = JSON.parse(userDetailSession);
      this.setDataForm(this.userDetail);
    }
  }

  setDataForm(data: any) {
    this.updateForm.patchValue({
      fristName: data.fristName,
      lastName: data.lastName,
      phone: data.phone,
      age: data.age,
      roleId: data.roleId,
      userName: data.userName,
    });
  }

  getAllRole() {
    this.callService.getAllRole().subscribe(res => {
      if (res) {
        this.roleList = res;
      }
    });
  }

  onSubmit() {
    const data = this.updateForm.value;

    this.callService.updateProfile(data, this.userDetail.userId).subscribe(res => {
      if (res.data) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Profile updated successfully',
          confirmButtonText: 'OK',
        });

        if (this.userId) {
          this.router.navigate(['/user-profile', this.userId]);
        } else {
          this.getUserById(res.data);
          this.router.navigate(['/user-profile']);
        }

      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Update Failed!',
          text: 'Please check your data and try again',
          confirmButtonText: 'OK',
        });
      }
    });
  }

  getUserById(userId: any) {
    this.callService.getByUserId(userId).subscribe(res => {
      if (res.data) {
        this.setDataForm(res.data);
        sessionStorage.removeItem("userDetail");
        sessionStorage.setItem("userDetail", JSON.stringify(res.data));
      }
    });
  }

}
