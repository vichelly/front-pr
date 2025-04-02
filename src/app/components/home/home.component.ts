import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  lifterId: string | null = null;

  ngOnInit() {
    // ✅ Pegando o lifterId do localStorage ao iniciar o componente
    this.lifterId = localStorage.getItem("token");
    console.log("Lifter ID:", this.lifterId);
  }
}
