import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [ FormsModule, CommonModule,FormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  // Propriedades necessárias
  name: string = "";
  password: string = "";
  resultado: any;

  private baseUrl = "http://localhost:8080/lifter";

  constructor(private http: HttpClient) {}

  registerLifter() {
    this.postRegisterLifter().subscribe({
      next: (res) => {
        console.log("Lifter cadastrado com sucesso! ID:", res.id);
        localStorage.setItem("lifterId", res.id); // Armazena o ID no localStorage
        this.resultado = res;
      },
      error: (err) => {
        console.error('Erro:', err);
        this.resultado = null;
      }
    });
  }

  public postRegisterLifter(): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/auth/register`,{
        name: this.name,
        password: this.password
      }
    );
  }
}
