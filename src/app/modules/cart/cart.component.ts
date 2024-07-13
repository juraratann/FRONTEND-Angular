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

 
  cartItems: any[] = [];
  totalCost: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 25;
  intervalId: any;;
  userId: any;
  userDetail: any;
  title: any;
 



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



  onSubmit(): void {


    this.productId = this.productList.map(item => item.productId);
    this.formData.patchValue({ productId: this.productId });
    
    this.quantity = this.productList.map(item => item.quantity);
    this.formData.patchValue({ quantity: this.quantity });
  
    console.log('Form Data:', this.formData.value);
  
    this.callService.saveOrder(this.formData.value).subscribe(
      response => {
        console.log('Form submitted successfully:', response);

        const responseData = response.data; // Extract data from response

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Form submitted successfully.',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            const queryParams = {
              responseData: responseData
            };
            this.router.navigate(['/user-product'], { queryParams });

            // Clear cart items after successful order submission
            this.cartservice.removeAllCartItems();
          }
        });
      },
      error => {
        console.error('Error submitting form:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to submit form. Please try again later.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
}
