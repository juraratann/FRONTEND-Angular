import { Component, OnInit } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DataSharingService } from '../DataSharingService';

@Component({
  selector: 'app-producyHome',
  templateUrl: './producyHome.component.html',
  styleUrls: ['./producyHome.component.css']
})
export class ProducyHomeComponent implements OnInit {

  userDetail: any;
  imageBlobUrl: any;
  imageBlobUrls: any = [];
  productImgList: any;
  productList: any;
  productTypeList: any = [];
  selectedProduct: any;

  constructor(
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private dataSharingService: DataSharingService
  ) { }

  ngOnInit() {
    this.getProductTypeAll();

    this.callService.getAllProduct().subscribe(res => {
      if (res.data) {
        this.productList = res.data;
        for (let product of this.productList) {
          product.imgList = [];
          product.productType = this.productTypeList.filter((x: any) => x.productTypeId == product.productTypeId);
          if (null == product.productType[0]) {
            window.location.reload();
          }

          this.callService.getProductImgByProductId(product.productId).subscribe((res) => {
            if (res.data) {
              this.productImgList = res.data;
              for (let productImg of this.productImgList) {
                this.getImage(productImg.productImgName, product.imgList);
              }
            } else {
              window.location.reload();
            }
          });

          this.dataSharingService.userDetail.subscribe(value => {
            var userDetailSession: any = sessionStorage.getItem("userDetail");
            this.userDetail = JSON.parse(userDetailSession);
          });
        }
      }
    });

    var userDetailSession: any = sessionStorage.getItem("userDetail");
    this.userDetail = JSON.parse(userDetailSession);
  }

  getImage(fileNames: any, imgList: any) {
    this.callService.getBlobThumbnail(fileNames).subscribe((res) => {
      let objectURL = URL.createObjectURL(res);
      this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      imgList.push(this.imageBlobUrl);
    });
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
        showCancelButton: true,
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

  addToCart(product: any) {
    console.log('Product added to cart:', product);
    // Add your logic to add the product to the cart here
  }
}

