// import { Component, OnInit } from '@angular/core';
// import { CallserviceService } from '../services/callservice.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormBuilder } from '@angular/forms';
// import { Observable } from 'rxjs';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-manageUser',
//   templateUrl: './manageUser.component.html',
//   styleUrls: ['./manageUser.component.css']
// })
// export class ManageUserComponent implements OnInit {

//   constructor(
//     private callService: CallserviceService,
//     private router: Router,
//     private formBuilder: FormBuilder,
//     private activated: ActivatedRoute
//   ) { }

//   selectUser: any;
//   userList: any;
//   roleList: any;
//   userId: any;
//   title: any;
//   userDetail: any;
//   user: any;
//   imgUser: any;
//   idImg:any
//   fileimg:any;

//   updateForm = this.formBuilder.group({
//     firstName: '',
//     lastName: '',
//     phone: '',
//     age: '',
//     roleId: '',
//     userName: ''
//   });

//   ngOnInit() {
//     this.getAllUsers();
//     this.getAllRole();
//     this.userId = this.activated.snapshot.paramMap.get("userId");
//     if (this.userId) {
//       this.callService.getByUserId(this.userId).subscribe(res => {
//         if (res.data) {
//           this.title = "Your Profile User";
//           this.userDetail = res.data;
//           this.setDataForm(this.userDetail);
//         }
//       });
//     } else {
//       this.title = "Your Profile Login";
//       let userDetailSession: any = sessionStorage.getItem("userDetail");
//       this.userDetail = JSON.parse(userDetailSession);
//       this.setDataForm(this.userDetail);
//       this.getData(this.userDetail.userId);
//     }
    
//     this.callService.userImage(this.userDetail.userId).subscribe(res => {
//       if (res) {
//         this.imgUser = res.data.img;
//         this.idImg = res.data.id
//       }
//     });
//   }


//   setProfileForm = this.formBuilder.group({
//     Img : '',
//     userId: ''
//   })

//   getData(userId: any) {
//     this.callService.getByUserId(userId).subscribe(res => {
//       if (res) {
//         this.user = res.data;
//       }
//     });
//   }

//   getAllUsers() {
//     this.callService.getAllUser().subscribe(res => {
//       if (res.data) {
//         this.userList = res.data;
//         console.log(this.userList);
//       }
//     });
//   }

//   setdata(data: any) {
//     console.log(data);
//     this.callService.getByUserId(data).subscribe((res) => {
//       if (res.data) {
//         this.setDataForm(res.data);
//         this.selectUser = data;
//         console.log(res.data);
//       }
//     });
//   }

//   setDataForm(data: any) {
//     this.updateForm.patchValue({
//       firstName: data.firstName,
//       lastName: data.lastName,
//       phone: data.phone,
//       age: data.age,
//       roleId: data.roleId,
//       userName: data.userName,
//     });
//   }

//   getAllRole() {
//     this.callService.getAllRole().subscribe(res => {
//       if (res) {
//         this.roleList = res;
//       }
//     });
//   }

//   onSubmit() {
//     console.log(this.updateForm.value);
//     const data = this.updateForm.value;
//     this.callService.updateProfile(data, this.selectUser).subscribe(res => {
//       console.log(res);
//       if (res.data) {
//         Swal.fire({
//           icon: 'success',
//           title: 'สำเร็จ!',
//           text: 'สมัครสมาชิกสำเร็จ',
//           confirmButtonText: 'ตกลง',
//         });

//         window.location.reload();

//       } else {
//         Swal.fire({
//           icon: 'warning',
//           title: 'บันทึกไม่สำเร็จ!',
//           text: 'กรุณาตรวจสอบข้อมูล ด้วยค่ะ',
//           confirmButtonText: 'ตกลง',
//         });
//       }
//     });
//   }

//   getUserById(userId: any) {
//     this.callService.getByUserId(userId).subscribe(res => {
//       if (res.data) {
//         this.setDataForm(res.data);
//         sessionStorage.removeItem("userDetail");
//         sessionStorage.setItem("userDetail", JSON.stringify(res.data));
//       }
//     });
//   }

//   onUpdateUser(userId: any) {
//     if (userId) {
//       this.router.navigate(['/profile/' + userId]);
//     }
//   }

//   onDeleteUser(userId: any): void {
//     if (userId) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'ต้องการลบหรือไม่',
//         text: 'คุณต้องการลบใช่หรือไม่.',
//         confirmButtonText: 'ตกลง',
//         showCancelButton: true,
//         cancelButtonText: 'ยกเลิก'
//       }).then((result) => {
//         if (result.isConfirmed) {
//           this.callService.deleteUserByUserId(userId).subscribe(res => {
//             if (res.data) {
//               Swal.fire({
//                 icon: 'success',
//                 title: 'ลบผู้ใช้สำเร็จ!',
//                 text: 'ผู้ใช้ถูกลบเรียบร้อยแล้ว.',
//                 timer: 1000
//               });
//               window.location.reload();
//             }
//           });
//         }
//       });

//     }
//   }

  
//   onChangePictureClick() {
//     document.getElementById('fileInput')!.click();
//   }

//   onFileSelected(event: any) {
//     const file: File = event.target.files[0];
//     this.fileimg = file
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.imgUser = e.target.result.split(',')[1];
//       Swal.fire({
//         icon:'question',
//         title:'Are your sure for update?',
//         showConfirmButton:true,
//         showCancelButton:true
//       }).then((result)=>{
//         if(result.isConfirmed){
//           const data = new FormData();
//           data.append('Img',this.fileimg as any);
//           data.append('userId',this.userDetail.userId as any);
//           this.callService.updateProfileAvatar(data,this.idImg).subscribe(res => {
//           if (res) {
//             Swal.fire({
//               icon: 'success',
//               title: 'สำเร็จ!',
//               text: 'อัปเดตรูปโปรไฟล์สำเร็จ',
//               confirmButtonText: 'ตกลง',
//             });
//           }
//         });
//         }
//       })
        
//       };
//       reader.readAsDataURL(file);
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manageUser',
  templateUrl: './manageUser.component.html',
  styleUrls: ['./manageUser.component.css']
})
export class ManageUserComponent implements OnInit {

  constructor(
    private callService: CallserviceService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activated: ActivatedRoute
  ) { }

  selectUser: any;
  userList: any;
  roleList: any;
  userId: any;
  title: any;
  userDetail: any

  updateForm = this.formBuilder.group({
    fristName: '',
    lastName: '',
    phone: '',
    age: '',
    roleId: '',
    userName: ''
  });

  ngOnInit() {
    this.getAllUsers();
    this.getAllRole();
  }

  getAllUsers() {
    this.callService.getAllUser().subscribe(res => {
      if (res.data) {
        this.userList = res.data;
        console.log(this.userList);
      }
    });
  }

  setdata(data: any) {
    console.log(data);
    this.callService.getByUserId(data).subscribe((res) => {
      if (res.data) {
        this.setDataForm(res.data);
        this.selectUser = data
        console.log(res.data)
      }
    })
  }


  setDataForm(data: any) {
    this.updateForm.patchValue({
      fristName: data.fristName,
      lastName: data.lastName,
      phone: data.phone,
      age: data.age,
      roleId: data.roleId,
      userName: data.userName,
    })
  }

  getAllRole() {
    this.callService.getAllRole().subscribe(res => {
      if (res) {
        this.roleList = res;
      }
    })
  }

  onSubmit() {
    console.log(this.updateForm.value)
    const data = this.updateForm.value
    this.callService.updateProfile(data, this.selectUser).subscribe(res => {
      console.log(res);
      if (res.data) {
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'สมัครสมาชิกสำเร็จ',
          confirmButtonText: 'ตกลง',
        });

        window.location.reload()

      } else {
        Swal.fire({
          icon: 'warning',
          title: 'บันทึกไม่สำเร็จ!',
          text: 'กรุณาตรวจสอบข้อมูล ด้วยค่ะ',
          confirmButtonText: 'ตกลง',
        });
      }
    })
  }
  getUserById(userId: any) {
    this.callService.getByUserId(userId).subscribe(res => {
      if (res.data) {
        this.setDataForm(res.data)
        sessionStorage.removeItem("userDetail")
        sessionStorage.setItem("userDetail", JSON.stringify(res.data))
      }
    })
  }

  onUpdateUser(userId: any) {
    if (userId) {
      this.router.navigate(['/profile/' + userId]);
    }
  }

  onDeleteUser(userId: any): void {
    if (userId) {
      Swal.fire({
        icon: 'warning',
        title: 'ต้องการลบหรือไม่',
        text: 'คุณต้องการลบใช่หรือไม่.',
        confirmButtonText: 'ตกลง',
        showCancelButton: true,
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.callService.deleteUserByUserId(userId).subscribe(res => {
            if (res.data) {
              Swal.fire({
                icon: 'success',
                title: 'ลบผู้ใช้สำเร็จ!',
                text: 'ผู้ใช้ถูกลบเรียบร้อยแล้ว.',
                timer: 1000
              })
              window.location.reload()
            }
          });
        }
      });

    }
  }

}

