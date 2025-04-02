import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true, // 🔥 Confirma que o componente é standalone
  imports: [CommonModule, FormsModule], // 🔥 Adiciona FormsModule aqui
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lifterId: number | null = null;
  lifterName: string = '';
  lifterWeight: number = 0;
  prs: any[] = [];
  
  novoPR = {
    exercise: '',
    kg: 0
  };

  private baseUrl = 'http://localhost:8080/lifter';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.lifterId = Number(localStorage.getItem('token'));
    if (this.lifterId) {
      this.getLifterData();
    }
  }

  getLifterData() {
    this.http.get<any>(`${this.baseUrl}/${this.lifterId}`).subscribe({
      next: (res) => {
        console.log(res);
        this.lifterName = res.name;
        this.lifterWeight = res.weight;
        this.prs = res.prs;
      },
      error: (err) => {
        console.error('Erro ao buscar dados do lifter:', err);
      }
    });
  }

  alterarPeso() {
    const novoPeso = prompt('Digite seu novo peso corporal:');
    if (novoPeso) {
      const pesoAtualizado = parseFloat(novoPeso);
      console.log(pesoAtualizado);
      this.http.patch(`${this.baseUrl}/${this.lifterId}`, pesoAtualizado, {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe({
        next: () => {
          this.lifterWeight = pesoAtualizado;
          alert('Peso atualizado com sucesso!');
          this.getLifterData();
        },
        error: (err) => {
          console.error('Erro ao atualizar peso:', err);
        }
      });
      
    }
  }

  registrarPR() {
    if (!this.novoPR.exercise || this.novoPR.kg <= 0) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const prData = { ...this.novoPR, lifterId: this.lifterId };
    this.http.post(`${this.baseUrl}/${this.lifterId}/prs`, prData).subscribe({
      next: (res) => {
        alert('PR registrado com sucesso!');
        this.prs.push(prData);
        this.novoPR = { exercise: '', kg: 0 }; // Reseta o formulário
      },
      error: (err) => {
        console.error('Erro ao registrar PR:', err);
      }
    });
  }
}
