import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

interface CartItem {
  productId: number;
  productTypeId: number;
  productName: string;
  productDesc: string;
  price: number;
  imgList: { key: string, value: string }[];
  quantity: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public selectedProduct: any;
  public formData: FormGroup;
  public productId: number[] = [];
  public quantity: number [] = [];
  public productList: CartItem[] = [];
  public grandTotal: number = 0;
  public imageBlobUrl: any;
  public provinces: any[] = [];
  promptpayNumber = '0626922817'; // ใส่หมายเลข PromptPay ที่ใช้

  qrCodeUrl: string = ''; // เพิ่มตัวแปรสำหรับเก็บ URL ของ QR Code

  cartItems: any[] = [];
  totalCost: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 25;
  intervalId: any;;
  userId: any;
  userDetail: any;
  title: any;
  selectedFiles : any = []



  constructor(
    private cartservice: CartService,
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private activated: ActivatedRoute,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { cartItems: any[], totalCost: number };
    if (state) {
      this.cartItems = state.cartItems || [];
      this.totalCost = state.totalCost || 0;
      this.cartItems = this.cartItems.map(item => ({
        ...item,
        imageUrl: this.sanitizer.bypassSecurityTrustUrl(item.imageUrl.changingThisBreaksApplicationSecurity)
      }));
    }
    this.formData = this.formBuilder.group({
      userId: '',
      productId: [],
      quantity: [],
      address: '',
      province: '',
      zipcode: '',
      files : [],
    });
  }


  ngOnInit(): void {
    this.cartservice.getProduct()
    
      .subscribe(res => {
        this.productList = res.map((item: any) => ({ ...item, quantity: 1 }));
        console.log("productListCart", this.productList);
        for (let product of this.productList) {
          this.callService.getProductImgByProductId(product.productId).subscribe((res) => {
            if (res.data) {
              product.imgList = [];
              this.getImageList(res.data, product.imgList);
            } else {
              window.location.reload();
            }
          });
        }
        this.updateGrandTotal();
      });
  
 
     
    this.userId = this.activated.snapshot.paramMap.get("userId");
    if (this.userId) {
      this.callService.getByUserId(this.userId).subscribe(res => {
        if (res.data) {
          this.title = "Your Profile User";
          this.userDetail = res.data;
          this.formData.patchValue({
            userId: this.userDetail.userId 
          });
        }
      });
    } else {
      let userDetailSession: any = sessionStorage.getItem("userDetail");
      if (userDetailSession) {
        this.userDetail = JSON.parse(userDetailSession);
        this.formData.patchValue({
          userId: this.userDetail.userId 
        });
        console.log("User ID:", this.userDetail.userId);
      } else {
        // Handle case where userDetail is not found in sessionStorage
      }
    } 
       // คำนวณและสร้าง URL ของ QR Code
       this.generateQRCode();
  }
  
  generateQRCode() {
    // เพิ่มราคาทั้งหมดอีก 40 หน่วย
    const totalWithExtra = this.totalCost ;
    // สร้าง URL ของ QR Code โดยใช้หมายเลข PromptPay และราคาที่เพิ่ม 40 หน่วย
    this.qrCodeUrl = `https://promptpay.io/${this.promptpayNumber}/${this.grandTotal}.png`;
    console.log(this.qrCodeUrl);
    console.log(this.totalCost);
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

  removeItem(item: CartItem): void {
    if (confirm('Are you sure to remove this item from cart?')) {
      this.cartservice.removeCartItem(item.productId);
      alert('Item removed from cart');
      this.productList = this.productList.filter(p => p.productId !== item.productId);
      this.updateGrandTotal();
    }
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item);
    }
    this.updateGrandTotal();
  }

  incrementQuantity(item: CartItem): void {
    item.quantity++;
    this.updateGrandTotal();
  }

  updateGrandTotal(): void {
    this.grandTotal = this.productList.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  onFileChanged(event: any) {
    this.selectedFiles.push(event.target.files);
  }


  onSubmit(): void {
    // นำ productId จาก productList
    this.productId = this.productList.map(item => item.productId);
    this.formData.patchValue({ productId: this.productId });
  
    // นำ quantity จาก productList
    this.quantity = this.productList.map(item => item.quantity);
    this.formData.patchValue({ quantity: this.quantity });
  
    // แสดงค่า formData ใน console
    console.log('Form Data:', this.formData.value);
  
    // เรียกใช้ฟังก์ชัน saveOrder
    this.callService.saveOrder(this.formData.value).subscribe(
      response => { if(response.data){
        console.log('ส่งฟอร์มสำเร็จ:', response);
  
        // const responseData = response.data; // ดึงข้อมูลจาก response
  
        // วนลูปอัพโหลดไฟล์ที่เลือก
        for (const file of this.selectedFiles[0]) {
          const formData = new FormData();
          formData.append('file', file); 
          this.callService.saveQrcode(formData, response.data).subscribe(
            res => {
              console.log("saveImage=>", response.data);
            }
          );
        }
  
        // แสดง Swal แจ้งเตือนเมื่อส่งฟอร์มสำเร็จ
        if(response.data){
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ!',
            text: 'บันทึกข้อมูลสำเร็จ',
            confirmButtonText: 'ตกลง',
          }).then(res=>{
            if(res.isConfirmed){
              this.router.navigate(['/user-product']);
            }
          })
          
        }else{
          Swal.fire({
            icon: 'warning',
            title: 'บันทึกไม่สำเร็จ!',
            text: 'กรุณาตรวจสอบข้อมูล ด้วยค่ะ',
            confirmButtonText: 'ตกลง',
          });
        }
      }
      }
    );
  }
  
  
}
