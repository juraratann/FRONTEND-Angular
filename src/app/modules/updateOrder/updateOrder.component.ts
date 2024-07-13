import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CallserviceService } from '../services/callservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-updateOrder',
  templateUrl: './updateOrder.component.html',
  styleUrls: ['./updateOrder.component.css']
})
export class UpdateOrderComponent implements OnInit {

  selectOrder: any;
  userList: any;

  constructor(
    private callService: CallserviceService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  updateOrderForm = this.formBuilder.group({
    orderId: '',
    userId: '',
    orderDate: '',
    itemCode: '',
    totalAmount: '',
    paymentId: '',
    addressId: '',
    status: ''
  });
  ngOnInit() {
  }

  setdata(data: any) {
    console.log(data);
    this.callService.getByUserId(data).subscribe((res) => {
      if (res.data) {
        this.setDataForm(res.data);
        this.selectOrder = data;
        console.log(res.data);
      }
    });
  }

  

  setDataForm(data: any) {
    this.updateOrderForm.patchValue({
      orderId: data.orderId,
      userId: data.userId,
      orderDate: data.orderDate,
      itemCode: data.itemCode,
      totalAmount: data.totalAmount,
      paymentId: data.paymentId,
      addressId: data.addressId,
      status: data.status
    });
  }

  onSubmit() {
    console.log(this.updateOrderForm.value);
    const data = this.updateOrderForm.value;
    this.callService.updateProfile(data, this.selectOrder).subscribe(res => {
      console.log(res);
      if (res.data) {
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'สมัครสมาชิกสำเร็จ',
          confirmButtonText: 'ตกลง',
        });

        window.location.reload();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'บันทึกไม่สำเร็จ!',
          text: 'กรุณาตรวจสอบข้อมูล ด้วยค่ะ',
          confirmButtonText: 'ตกลง',
        });
      }
    });
  }
  getAllOrder() {
    this.callService.getAllOrder().subscribe(res => {
      if (res.data) {
        this.userList = res.data;
        console.log(this.userList);
      }
    });
  }
}
