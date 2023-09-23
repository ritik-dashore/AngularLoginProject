import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { LoginSystemService } from './login-system.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'LoginAuth';
  constructor(private _loginServicec: LoginSystemService, private router: Router) { }

  // Sign up form logics================
  isLoging: any;
  userData: any;
  userId: any;
  toLogin: any = false
  pattern = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}"
  UserDetails = new FormGroup({
    username: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    contactNo: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]),
    city: new FormControl(null, Validators.required),
    password: new FormControl(null, [Validators.required, Validators.pattern(this.pattern)])
  });


  ngOnInit(): void {
    this.isLoging = localStorage.getItem("username");
    this.getData()
    if (localStorage.getItem("userid")) {

      this.startInactivityTimer();
    }
  }
  isAccout() {
    this.toLogin = !this.toLogin
  }

  SingUp(data: any) {
    if (this.UserDetails.valid) {

      if (this.userId) {
        this._loginServicec.updateUser(data.value, this.userId).subscribe();
        setTimeout(() => {
          this.getData();
          this.UserDetails.reset();
          this.userId = false;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'User has been Updated',
            showConfirmButton: false,
            timer: 2000
          })

        }, 500)
      } else {
        this._loginServicec.submit(data.value).subscribe();
        setTimeout(() => {
          this.getData();
          this.UserDetails.reset();
          this.toLogin = true;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'User Succesfully Added',
            showConfirmButton: false,
            timer: 2000
          })
        }, 500)
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Details',
        text: 'Please fill all the required field.',
      })
    }

  }
  getData() {
    this._loginServicec.getData().subscribe((res: any) => {
      this.userData = res;
    })
  }
  editUser(id: any) {
    this._loginServicec.editUSer(id).subscribe((res: any) => {
      this.UserDetails.setValue({
        "username": res.username,
        "email": res.email,
        "contactNo": res.contactNo,
        "city": res.city,
        "password": res.password,
      })
      this.userId = id
    })
  }
  deletUSer(id: any) {
    Swal.fire({
      title: 'Are you sure you Want delete this user?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._loginServicec.deletUser(id).subscribe();
        setTimeout(() => {
          this.getData();
        }, 500)
        Swal.fire(
          'Deleted!',
          'User Succesfully has been deleted.',
          'success'
        )
      }
    })

  }


  // Login form logics=========
  userLog = new FormGroup({
    userid: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  });
  userFound: any = false;
  userLogin(data: any) {
    this.userData.forEach((e: any) => {
      if (!this.userFound && e.email == this.userLog.value.userid && e.password == this.userLog.value.password) {
        this.userFound = true
        this.isLoging = e.username
        console.log(this.isLoging)
        localStorage.setItem("userid", e.email)
        localStorage.setItem("username", e.username)
        this.router.navigate(['./profile'])
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'User Succesfully Login',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
    if (!this.userFound) {
      Swal.fire({
        icon: 'error',
        title: 'User Id And Password Not Matched',
      })
    }
    this.userFound = false
  }

  // forgot Password Logics========
  forgotPassword: any = false;
  OTPGenrate: any
  OTPFormShow: any = false;

  showForgotForm() {
    this.forgotPassword = !this.forgotPassword;
  }
  forgotMailId: any;
  forgotForm = new FormGroup({
    userid: new FormControl()
  })
  forgotSubmit(data: any) {
    this.userData.forEach((e: any) => {
      if (!this.userFound && e.email == this.forgotForm.value.userid) {
        this.forgotMailId = e.id;
        this.userFound = true
        this.OTPGenrate = Math.floor(Math.random() * 9000) + 1000;
        this.forgotPassword = false;
        this.OTPFormShow = true;
      }
    });
    if (!this.userFound) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
      })
    }
  }

  // OTP Form Logics========
  OTPForm = new FormGroup({
    otp: new FormControl()
  })
  otpSubmit() {
    if (this.OTPGenrate == this.OTPForm.value.otp) {
      this.UpdateFormShow = true;
      this.OTPFormShow = false;
      this.toLogin = false;
    }
  }

  // Password Update Form Logics========

  UpdateFormShow: any
  updatePassword = new FormGroup({
    confirmPassword: new FormControl(),
    password: new FormControl()
  })
  updateSubmit(data: any) {
    this.updatePassword.patchValue({ password: data.value.password })
    this._loginServicec.updatePassword(data.value.password, this.forgotMailId).subscribe((res) => {
      console.log(res)
    })
    console.log(data.value.password)
  }

  // log out form start=============
  logOutConfirmation() {
    Swal.fire({
      title: 'Are you sure you want to Log Out?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Log Out'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logOut();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'you have succesfully logout.',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }
  logOut() {
    this.isLoging = false
    localStorage.removeItem("userid")
    this.isLoging = localStorage.removeItem("username");
    this.router.navigate(['/login'])
  }
  // log out form end=============


  // 60 second timer function start ==============

  inactivityTimeout: any;
  logoutTimeout: any;
  inactivityDuration: number = 6000;
  
  @HostListener('window:mousemove')
  onMouseMove() {
    if (localStorage.getItem("userid")) {
      this.resetInactivityTimer();
    }
  }
  @HostListener('window:click')
  onMouseClcik() {
    if (localStorage.getItem("userid")) {
      this.resetInactivityTimer();
    }
  }
  @HostListener('window:keypress')
  onKeypress() {
    if (localStorage.getItem("userid")) {
      this.resetInactivityTimer();
    }
  }
  autoLout: any;
  startInactivityTimer() {
      console.log(this.isLoging)
      if (this.isLoging) {
        this.inactivityTimeout = setTimeout(() => {
          // Log out the user here
          console.log("Log out as no movement found");
          Swal.fire({
            title: 'Log out as no movement found',
            // text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log out'
          }).then((result) => {
            if (result.isConfirmed) {
              this.logOut()
              this.isLoging = false;
              console.log(this.autoLout)
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'you have succesfully logout.',
                showConfirmButton: false,
                timer: 1500
              })
            }
          })
        }, this.inactivityDuration)
      };

    if (this.autoLout) {
      this.logoutTimeout = setTimeout(() => {
        // Perform the actual logout operation here
        this.logOut()
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'you have succesfully logout.',
          showConfirmButton: false,
          timer: 1500
        })
        console.log("Force logout after 60 seconds of inactivity");
      }, this.inactivityDuration + 6000); // Add an additional second before logging out
    }
  }

  resetInactivityTimer() {
    clearTimeout(this.inactivityTimeout);
    clearTimeout(this.logoutTimeout);
    this.startInactivityTimer();
  }


  // 60 second timer function start ==============
}
