import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DataSharingService } from '../DataSharingService';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  

  constructor(
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private dataSharingService: DataSharingService,
    private router: Router,
    private cartService: CartService
  ) { }

  userDetail: any;
  productList: any;
  productTypeList: any = [];
  imageBlobUrl: any;
  imageBlobUrls: any = [];
  productImgList: any;
  selectedProduct: any;

  ngOnInit(): void {
    this.getProductTypeAll();

    this.callService.getAllProduct().subscribe(res => {
      if (res.data) {
        this.productList = res.data;
        for (let product of this.productList) {
          product.imgList = [];
          product.productType = this.productTypeList.filter((x: any) => x.productTypeId == product.productTypeId);
          if (!product.productType[0]) {
            window.location.reload();
          }

          this.callService.getProductImgByProductId(product.productId).subscribe((res) => {
            if (res.data) {
              this.getImageList(res.data, product.imgList);
            } else {
              window.location.reload();
            }
          });
        }

        this.dataSharingService.userDetail.subscribe(value => {
          const userDetailSession: any = sessionStorage.getItem("userDetail");
          this.userDetail = JSON.parse(userDetailSession);
        });
      }
    });
  }

  async addToCart(productId: any): Promise<void> {
    try {
      await this.cartService.addToCart(productId);
      await Swal.fire({
        icon: 'success',
        title: 'เพิ่มสำเร็จ!',
        text: 'สินค้าได้ถูกเพิ่มในรถเข็น',
        confirmButtonText: 'ตกลง'
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถเพิ่มสินค้าในรถเข็น กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง'
      });
    }
  }



  getImageList(imageNames: any[], imgList: any) {
    for (let imageName of imageNames) {
      this.callService.getBlobThumbnail(imageName.productImgName).subscribe((res) => {
        let objectURL = URL.createObjectURL(res);
        this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        imgList.push(this.imageBlobUrl);
      });
    }
  }

  getProductTypeAll() {
    this.callService.getProductTypeAll().subscribe((res) => {
      if (res.data) {
        this.productTypeList = res.data;
      }
    });
  }

  async onCart(productId: any) {
    if (productId) {
      const result = await Swal.fire({
        icon: 'success',
        title: 'คุณต้องเข้าสู่ระบบก่อน ค่อยซื้อสินค้าได้?',
        text: 'คุณต้องการเข้าสู่ระบบใช่หรือไม่!',
        showCancelButton: true, // เปิดใช้งานปุ่มยกเลิก
        confirmButtonColor: '#56C596',
        cancelButtonColor: '#d33',
        confirmButtonText: 'เข้าสู่ระบบ',
        cancelButtonText: 'ยกเลิก',
      });
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    }
  }

  setSelectedProduct(product: any) {
    this.selectedProduct = product;
  }
}
