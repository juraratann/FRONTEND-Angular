import { Component, OnInit } from '@angular/core';
import { DataSharingService } from '../DataSharingService';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-userproduct',
  templateUrl: './userproduct.component.html',
  styleUrls: ['./userproduct.component.css']
})
export class UserproductComponent implements OnInit {

  updateForm: FormGroup;
  orderList: any[] = [];
  provincesData: any[] = [];
  productTypeList: any[] = [];
  userDetail: any;
  selectedProduct: any;
  ordersId : any
  paymentImages: any[] = [];
  selected: any;
  selecteds:number;
  selectedOrder: any;
  allimgs: any[] = [];
   grandTotal: number = 0;

  constructor(
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private cartservice: CartService,
    private dataSharingService: DataSharingService,
    private router : Router,
    private formBuilder : FormBuilder,
    
  ) {
    
    this.updateForm = this.formBuilder.group({
          userId: '',
          address: '',
          province: '',
          zipcode: '',
          status: '',
          productId: this.formBuilder.array([]),
          quantity: this.formBuilder.array([]),
    });
}
statuses1 = [
  { value: '6', label: 'ยกเลิกคำสั่งซื้อ' },
];

// constructor1() {
//   this.updateForm = this.group({
//     status: ['']
//   });
// }

setSelectedProduct1(order: any) {
  this.selectedProduct = order;
  this.updateForm.patchValue({ status1: order.status1 });
}

onSubmit1() {
  console.log(this.updateForm.value);
  // Handle form submission logic here
}

ngOnInit() {
  let userDetailSession: any = sessionStorage.getItem('userDetail');
  this.userDetail = JSON.parse(userDetailSession);

  this.callService
    .getOrderByUserId(this.userDetail.userId)
    .subscribe((res) => {
      if (res.data) {
        this.orderList = res.data;
        console.log('orderList', res.data);
        this.orderList.forEach((order) => {
          this.getUserDetails(order.userId).then((userData) => {
            order.userData = userData;
          });
        });

 
        this.callService.getAllPaymentImage().subscribe(
          (data: any) => {
            const paymentImages = data.data;
            
            this.orderList.forEach((order: any) => {
            
              order.paymentImage = paymentImages.filter((payment: any) => order.ordersId === payment.ordersId);
            
              order.paymentImage.forEach((payment: any) => {
                console.log('paymentImagesssssssssssssss', order.paymentImage);
                payment.imgList = [];
                this.callService.getPaymentImgByUserId(payment.ordersId).subscribe((imgRes: any) => {
                  if (imgRes.data) {
                    this.getImage(imgRes.data, payment.imgList);
                  }
                });
              });
            });
      
            console.log('orderList with payment images', this.orderList);
          },
          (error: any) => {
            console.error('Error fetching payment images', error);
          }
        );
      
      this.callService.getAllProduct().subscribe((res: any) => {
        if (res.data) {
          const allProducts = res.data;
          this.orderList.forEach((order: any) => {
            order.productList = allProducts.filter((product: any) => order.productId.includes(product.productId));
            
            order.productList.forEach((product: any) => {
              product.imgList = [];
              this.callService.getProductImgByProductId(product.productId).subscribe((imgRes) => {
                if (imgRes.data) {
                  this.getImageList(imgRes.data, product.imgList);
                }
              });
            });
          });
        }
      });

    }
  });


 
}

getImage(imageNames: any[], imgList: any[]) {
  for (let imageName of imageNames) {
    console.log('paymentImagesssssssssssssss', imageName);
    this.callService.getPaymentImgBlobThumbnail(imageName.paymentImgName).subscribe((res) => {
      if (res) {
        let objectURL = URL.createObjectURL(res);
        let safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        imgList.push(safeUrl);
      }
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


  getImageList(imageNames: any[], imgList: any[]) {
    for (let imageName of imageNames) {
      this.callService.getBlobThumbnail(imageName.productImgName).subscribe((res) => {
        if (res) {
          let objectURL = URL.createObjectURL(res);
          let safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          imgList.push(safeUrl);
        }
      });
    }
  }

  getUserDetails(userId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.callService.getByUserId(userId).subscribe(response => {
        if (response.status === 'SUCCESS') {
          resolve(response.data);
        } else {
          reject('Error fetching user details');
        }
      });
    });
  }
  calculateTotalSum(order: any): number {
    return order.productList.reduce((total: number, product: any) => {
      return total + (product.price * this.getQuantity(order, product.productId));
    }, 0);
  }
  getQuantity(order: any, productId: number): number {
    const productIndex = order.productId.indexOf(productId);
    return productIndex > -1 ? order.quantity[productIndex] : 0;
  } 
  
  onDeleteOrder(ordersId : any){
    if(ordersId){
     
      this.callService.deleteOrder(ordersId).subscribe(res=>{
        if(res.data){
          window.location.reload()
        
        }
      })
    }
  }
  

  setDataForm(selectedProduct: any): void {
      this.updateForm.patchValue({
        userId: selectedProduct.userId,
        address: selectedProduct.address,
        province: selectedProduct.province,
        zipcode: selectedProduct.zipcode,
        status: selectedProduct.status,
      });
    
      this.updateForm.setControl(
        'productId',
        this.formBuilder.array(selectedProduct.productId || [])
      );
      this.updateForm.setControl(
        'quantity',
        this.formBuilder.array(selectedProduct.quantity || [])
      );
    }

  setSelectedProduct(order: any): void {
    this.selectedProduct = order;
    console.log('Selected Product:', this.selectedProduct);
    this.setDataForm(order);
  }
 

   onSubmit(): void {
    console.log('Form Values:', this.updateForm.value);

    const order = this.updateForm.value;

    console.log('Request Payload:', {
      order: order,
      ordersId: this.selectedProduct.ordersId
    });

    this.callService.updateOrder(order, this.selectedProduct.ordersId).subscribe(
      res => {
        console.log('Response:', res);
        if (res.data) {
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ!',
            text: 'แก้ไขข้อมูลสำเร็จ',
            confirmButtonText: 'ตกลง',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'บันทึกไม่สำเร็จ!',
            text: 'กรุณาตรวจสอบข้อมูล ด้วยค่ะ',
            confirmButtonText: 'ตกลง',
          });
        }
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'ข้อผิดพลาด!',
          text: 'เกิดข้อผิดพลาดในการส่งข้อมูล',
          confirmButtonText: 'ตกลง',
        });
        console.error('Error:', error);
      }
    );
  }
 
  setSelectedOrderId(orderId: any) {
    const queryParams = {
      responseData: orderId 
    };
    this.router.navigate(['/order'], { queryParams });
    console.log('responseData', orderId);
  }
  setSelected(payment: any,totalSum: number) {
    this.selected = payment;
    this.selecteds = totalSum;
    console.log('Selected Payment:', this.selected);
    console.log('Selected Total Sum:', this.selecteds);
  }

  getPrompay(order: any) {
    this.callService.getPaymentImgByUserId(order.ordersId).subscribe((imgRes: any) => {
      if (imgRes.data) {
        order.allimgs = [];
        this.getImage(imgRes.data, order.allimgs);
      }
    });
  }

  setSelectedOrder(order: any): void {
    this.selectedOrder = order;
    this.getPrompay(this.selectedOrder);
    console.log('Selected Order:', this.selectedOrder);
  }

}


// import { Component, OnInit } from '@angular/core';
// import { DataSharingService } from '../DataSharingService';
// import { CallserviceService } from '../services/callservice.service';
// import { DomSanitizer } from '@angular/platform-browser';
// import * as bootstrap from 'bootstrap';
// import { Router } from '@angular/router';
// import { CartService } from '../services/cart.service';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-userproduct',
//   templateUrl: './userproduct.component.html',
//   styleUrls: ['./userproduct.component.css']
// })
// export class UserproductComponent implements OnInit {

  
//   orderList: any[] = [];
//   provincesData: any[] = [];
//   productList: any[] = [];
//   userData: any;
//   selectedOrder: any;
//   updateForm: FormGroup;
//     productTypeList: any[] = [];
//     userDetail: any;
//     selectedProduct: any;
//     ordersId : any
//     paymentImages: any[] = [];
//     selected: any;
//     selecteds:number;
//     allimgs: any[] = [];
//      grandTotal: number = 0;
//      updateOrder: FormGroup;

//      constructor(
//       private dataSharingService: DataSharingService,
//       private callService: CallserviceService,
//       private formBuilder: FormBuilder,
//       private sanitizer: DomSanitizer,
//       private router: Router
//     ) {
//       this.updateOrder = this.formBuilder.group({
//         userId: '',
//         address: '',
//         province: '',
//         zipcode: '',
//         status: '',
//         productId: this.formBuilder.array([]),
//         quantity: this.formBuilder.array([])
//       })
//     }
  
//    ngOnInit() {
//   this.callService.getAllOrder().subscribe(res => {
//     if (res.data) {
//       this.orderList = res.data;
//       console.log('ข้อมูล',this.orderList);


//       this.orderList.forEach(order => {
//         this.getUserDetails(order.userId).then(userData => {
//           order.userData = userData;
//         });
//       });

 
//         this.callService.getAllPaymentImage().subscribe(
//           (data: any) => {
//             const paymentImages = data.data;
            
//             this.orderList.forEach((order: any) => {
            
//               order.paymentImage = paymentImages.filter((payment: any) => order.ordersId === payment.ordersId);
            
//               order.paymentImage.forEach((payment: any) => {
//                 console.log('paymentImagesssssssssssssss', order.paymentImage);
//                 payment.imgList = [];
//                 this.callService.getPaymentImgByUserId(payment.ordersId).subscribe((imgRes: any) => {
//                   if (imgRes.data) {
//                     this.getImage(imgRes.data, payment.imgList);
//                   }
//                 });
//               });
//             });
      
//             console.log('orderList with payment images', this.orderList);
//           },
//           (error: any) => {
//             console.error('Error fetching payment images', error);
//           }
//         );
      
//       this.callService.getAllProduct().subscribe((res: any) => {
//         if (res.data) {
//           const allProducts = res.data;
//           this.orderList.forEach((order: any) => {
//             order.productList = allProducts.filter((product: any) => order.productId.includes(product.productId));
            
//             order.productList.forEach((product: any) => {
//               product.imgList = [];
//               this.callService.getProductImgByProductId(product.productId).subscribe((imgRes) => {
//                 if (imgRes.data) {
//                   this.getImageList(imgRes.data, product.imgList);
//                 }
//               });
//             });
//           });
//         }
//       });

//     }
//   });
// }

// getImage(imageNames: any[], imgList: any[]) {
//   for (let imageName of imageNames) {
//     console.log('paymentImagesssssssssssssss', imageName);
//     this.callService.getPaymentImgBlobThumbnail(imageName.paymentImgName).subscribe((res) => {
//       if (res) {
//         let objectURL = URL.createObjectURL(res);
//         let safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
//         imgList.push(safeUrl);
//       }
//     });
//   }
// }
  
//     setDataForm(selectedOrder: any) {
//       this.updateOrder.patchValue({
//         userId: selectedOrder.userId,
//         address: selectedOrder.address,
//         province: selectedOrder.province,
//         zipcode: selectedOrder.zipcode,
//         status: selectedOrder.status,
//       })
//       this.updateOrder.setControl('productId', this.formBuilder.array(selectedOrder.productId || []));
//       this.updateOrder.setControl('quantity', this.formBuilder.array(selectedOrder.quantity || []));
//     }
  
  
//     getUserDetails(userId: number): Promise<any> {
//           return new Promise((resolve, reject) => {
//             this.callService.getByUserId(userId).subscribe(response => {
//               if (response.status === 'SUCCESS') {
//                 resolve(response.data);
//               } else {
//                 reject('Error fetching user details');
//               }
//             });
//           });
//         }
//         getQuantity(order: any, productId: number): number {
//               const productIndex = order.productId.indexOf(productId);
//               return productIndex > -1 ? order.quantity[productIndex] : 0;
//             } 

//     getImageList(imageNames: any[], imgList: any[]) {
//       for (let imageName of imageNames) {
//         this.callService.getBlobThumbnail(imageName.productImgName).subscribe((res) => {
//           if (res) {
//             let objectURL = URL.createObjectURL(res);
//             let safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
//             imgList.push(safeUrl);
//           }
//         });
//       }
//     }
//     onDeleteOrder(ordersId : any){
//       if(ordersId){
       
//         this.callService.deleteOrder(ordersId).subscribe(res=>{
//           if(res.data){
//             window.location.reload()
          
//           }
//         })
//       }
//     }
//     setSelectedProduct(order: any): void {
//           this.selectedProduct = order;
//           console.log('Selected Product:', this.selectedProduct);
//           this.setDataForm(order);
//         }
      
//          onSubmit(): void {
//           console.log('Form Values:', this.updateForm.value);
      
//           const order = this.updateForm.value;
      
//           console.log('Request Payload:', {
//             order: order,
//             ordersId: this.selectedProduct.ordersId
//           });
      
//           this.callService.updateOrder(order, this.selectedProduct.ordersId).subscribe(
//             res => {
//               console.log('Response:', res);
//               if (res.data) {
//                 Swal.fire({
//                   icon: 'success',
//                   title: 'สำเร็จ!',
//                   text: 'แก้ไขข้อมูลสำเร็จ',
//                   confirmButtonText: 'ตกลง',
//                 }).then((result) => {
//                   if (result.isConfirmed) {
//                     window.location.reload();
//                   }
//                 });
//               } else {
//                 Swal.fire({
//                   icon: 'warning',
//                   title: 'บันทึกไม่สำเร็จ!',
//                   text: 'กรุณาตรวจสอบข้อมูล ด้วยค่ะ',
//                   confirmButtonText: 'ตกลง',
//                 });
//               }
//             },
//             error => {
//               Swal.fire({
//                 icon: 'error',
//                 title: 'ข้อผิดพลาด!',
//                 text: 'เกิดข้อผิดพลาดในการส่งข้อมูล',
//                 confirmButtonText: 'ตกลง',
//               });
//               console.error('Error:', error);
//             }
//           );
//         }
       
//         setSelectedOrderId(orderId: any) {
//           const queryParams = {
//             responseData: orderId 
//           };
//           this.router.navigate(['/order'], { queryParams });
//           console.log('responseData', orderId);
//         }
//         setSelected(payment: any,totalSum: number) {
//           this.selected = payment;
//           this.selecteds = totalSum;
//           console.log('Selected Payment:', this.selected);
//           console.log('Selected Total Sum:', this.selecteds);
//         }
      
//         getPrompay(order: any) {
//           this.callService.getPaymentImgByUserId(order.ordersId).subscribe((imgRes: any) => {
//             if (imgRes.data) {
//               order.allimgs = [];
//               this.getImage(imgRes.data, order.allimgs);
//             }
//           });
//         }
      
//         setSelectedOrder(order: any): void {
//           this.selectedOrder = order;
//           this.getPrompay(this.selectedOrder);
//           console.log('Selected Order:', this.selectedOrder);
//         }
//   }

