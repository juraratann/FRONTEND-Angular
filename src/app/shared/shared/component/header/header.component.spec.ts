import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/modules/DataSharingService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userDetail: any;  // เก็บข้อมูลของผู้ใช้
  cartItemCount: number = 0;  // เก็บจำนวนรายการในตะกร้า

  constructor(
    private router: Router,
    private dataSharingService: DataSharingService
  ) { 
    // Subscribe การเปลี่ยนแปลงข้อมูลของผู้ใช้จาก DataSharingService
    this.dataSharingService.userDetail.subscribe(value => {
      var userDetailSession: any = sessionStorage.getItem("userDetail");
      this.userDetail = JSON.parse(userDetailSession);
    });
  }
  
  ngOnInit() {
    // ดึงข้อมูลของผู้ใช้จาก sessionStorage ในกรณีที่มีการ refresh หน้าเว็บ
    var userDetailSession: any = sessionStorage.getItem("userDetail");
    this.userDetail = JSON.parse(userDetailSession);
  }

  logout() {
    // ลบข้อมูลผู้ใช้ที่อยู่ใน sessionStorage
    sessionStorage.removeItem("userDetail");
    // แจ้งข้อมูลให้กับ DataSharingService ว่าผู้ใช้ออกจากระบบ
    this.dataSharingService.userDetail.next(true);
    // นำผู้ใช้ออกจากระบบไปยังหน้า login
    this.router.navigate(['/login']);
  }

}
