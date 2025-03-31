import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Propriedades necessárias
  num1: number = 0;
  num2: number = 0;
  resultado: number | null = null;
  
  private baseUrl = "http://localhost:8080/math";

  constructor(private http: HttpClient) {}

  // Método para cálculo da soma
  calcularSoma() {
    this.getSoma().subscribe({
      next: (res) => {
        this.resultado = res;
      },
      error: (err) => {
        console.error('Erro:', err);
        this.resultado = null;
      }
    });
  }

  private getSoma(): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/sum/${this.num1}/${this.num2}`
    );
  }
}
