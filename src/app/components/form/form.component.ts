import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [ FormsModule, CommonModule, FormsModule ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  name: string = "";
  password: string = "";
  resultado: any;
  isLoginMode: boolean = false; // Modo padrão: registro

  private baseUrl = "http://localhost:8080/auth";

  constructor(private http: HttpClient) {}

  onAction() {
    if (this.isLoginMode) {
      this.loginLifter();
    } else {
      this.registerLifter();
    }
  }

  registerLifter() {
    this.postRegisterLifter().subscribe({
      next: (res) => {
        console.log("Lifter cadastrado com sucesso! ID:", res.id);
        localStorage.setItem("lifterId", res.id);
        this.resultado = "Registered user! Now try to Login";
      },
      error: (err) => {
        console.error('Erro, já existe um user:', err);
        this.resultado = 'User already exists try to Login!';
      }
    });
  }

  loginLifter() {
    this.postLoginLifter().subscribe({
      next: (res) => {
        console.log("Lifter logado com sucesso! Token:", res.id);
        localStorage.setItem("token", res.id); // Armazena o token
        this.resultado = "User logged in!";
      },
      error: (err) => {
        console.error('Erro ao logar:', err);
        this.resultado = 'Login failed. Check your credentials.';
      }
    });
  }

  public postRegisterLifter(): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/register`, {
        name: this.name,
        password: this.password
      }
    );
  }

  public postLoginLifter(): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/login`, {
        name: this.name,
        password: this.password
      }
    );
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.resultado = null; // Limpar a mensagem de resultado ao trocar de modo
  }
}