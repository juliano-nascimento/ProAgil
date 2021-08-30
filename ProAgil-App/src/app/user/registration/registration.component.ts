import { AuthService } from './../../_services/auth.service';
import { User } from './../../_models/User';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  //@ts-ignore
  registerForm: FormGroup;
  user: User | any;
  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.validation();
  }

  validation(){
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      passwords: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, {
        validator: this.compararSenhas
      })
    });
  }

  compararSenhas(fb: FormGroup){
    const confirmeSenhaCtrl = fb.get('confirmPassword');
    if (confirmeSenhaCtrl?.errors  == null || 'mismatch' in confirmeSenhaCtrl?.errors){
      if (fb.get('password')?.value !== confirmeSenhaCtrl?.value) {
          confirmeSenhaCtrl?.setErrors({mismatch: true});
      }
      else{
        confirmeSenhaCtrl?.setErrors(null);
      }
    }
  }

  cadastrarUsuario(){
    if (this.registerForm.valid) {
      this.user = Object.assign({password: this.registerForm.get('passwords.password')?.value},
        this.registerForm.value);
      this.authService.register(this.user).subscribe(
          () => {
            this.router.navigate(['/user/login']);
            this.toastr.success('Cadastro Realizado');
          }, error => {
            const erro = error.error;
            erro.forEach(element => {
              switch (element.code) {
                case 'DuplicateUserName':
                  this.toastr.error('Cadastro Duplicado!');
                  break;
                default:
                  this.toastr.error(`Erro no Cadastro! CODE: ${element.code}`);
                  break;
              }
            });
          }
        );
    }
  }
}
