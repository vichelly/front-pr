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

  planoTreinoHtml: string = '';
  loadingTreino: boolean = false;

  private baseUrl = 'http://localhost:8080/lifter';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.lifterId = Number(localStorage.getItem('token'));
    if (this.lifterId) {
      this.getLifterData();
      this.getLifterPrs();
    }
  }

  getLifterData() {
    this.http.get<any>(`${this.baseUrl}/${this.lifterId}`).subscribe({
      next: (res) => {
        console.log(res);
        this.lifterName = res.name;
        this.lifterWeight = res.weight;
      },
      error: (err) => {
        console.error('Erro ao buscar dados do lifter:', err);
      }
    });
  }

  deletePr(prId: number) {
    if (confirm('Tem certeza que deseja excluir este PR?')) {
      this.http.delete(`${this.baseUrl}/${this.lifterId}/pr/${prId}`).subscribe({
        next: () => {
          alert('PR excluído com sucesso!');
          this.getLifterPrs(); // Atualiza a lista após a exclusão
        },
        error: (err) => {
          console.error('Erro ao excluir PR:', err);
        }
      });
    }
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

  getLifterPrs() {
    this.http.get<any>(`${this.baseUrl}/${this.lifterId}/prs`).subscribe({
      next: (res) => {
        console.log('PRs recebidos:', res);
        this.prs = res;
      },
      error: (err) => {
        console.error('Erro ao buscar PRs do lifter:', err);
      }
    });
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
        this.getLifterPrs();
      },
      error: (err) => {
        console.error('Erro ao registrar PR:', err);
      }
    });
  }

  gerarTreino() {
    if (!this.lifterId) return;
  
    this.loadingTreino = true;
    this.planoTreinoHtml = ''; // Limpa treino anterior
  
    this.http.post<{ planoTreino: string }>(
      `http://localhost:8080/gemini/send-to-flask/${this.lifterId}`,
      null
    ).subscribe({
      next: (res) => {
        this.planoTreinoHtml = res.planoTreino;
        this.loadingTreino = false;
      },
      error: (err) => {
        console.error('Erro ao gerar treino:', err);
        alert('❌ Ocorreu um erro ao gerar o plano de treino.');
        this.loadingTreino = false;
      }
    });
  }
  
}
