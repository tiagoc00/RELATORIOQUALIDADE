import { CONFIG } from './data/config.js';
import { SETORES, RELATORIOS } from './data/checklistData.js';
import { AuthService } from './services/AuthService.js';
import { ChecklistService } from './services/ChecklistService.js';
import { SignatureService } from './services/SignatureService.js';
import { PDFService } from './services/PDFService.js';
import * as Pages from './components/pages.js';

class App {
  constructor() {
    this.auth = new AuthService(CONFIG.APP_PASSWORD);
    this.checklist = new ChecklistService(SETORES, RELATORIOS);
    this.pdf = new PDFService();
    this.sigService = null;
    this.currentScreen = 'screenLogin';
    this.sigTarget = null;
    
    this.init();
  }

  init() {
    this.render();
    window.app = this; // Make app globally accessible for HTML string callbacks
  }

  render() {
    const container = document.getElementById('appContainer');
    const state = this.checklist.state;
    const stats = this.checklist.getStats();
    const sectors = this.checklist.getSectors();

    let html = '';
    switch (this.currentScreen) {
      case 'screenLogin':
        html = Pages.LoginPage();
        break;
      case 'screenSetup':
        html = Pages.SetupPage(state);
        break;
      case 'screenChecklist':
        html = Pages.ChecklistPage(state, stats, sectors, {
          onStatusChange: 'window.app.setStatus',
          onObsInput: 'window.app.saveObs',
          onPhotoAdd: 'window.app.addPhotos',
          onPhotoRemove: 'window.app.removePhoto'
        });
        break;
      case 'screenSuccess':
        html = Pages.SuccessPage(state);
        break;
    }

    container.innerHTML = html;
    window.scrollTo(0, 0);
    
    // Attach keyboard event for login
    if (this.currentScreen === 'screenLogin') {
      const pwInput = document.getElementById('loginPassword');
      if (pwInput) pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') this.doLogin(); });
    }
  }

  showScreen(name) {
    this.currentScreen = name;
    this.render();
  }

  doLogin() {
    const pw = document.getElementById('loginPassword').value;
    const err = document.getElementById('loginError');
    if (this.auth.login(pw)) {
      this.showScreen('screenSetup');
    } else {
      err.style.display = 'block';
    }
  }

  selectOption(btn, group, val) {
    if (group === 'loja') this.checklist.state.loja = val;
    if (group === 'relatorio') this.checklist.state.relatorio = val;
    this.render();
  }

  updateField(name, val) {
    this.checklist.state[name] = val.trim();
  }

  startChecklist() {
    const state = this.checklist.state;
    if (!state.loja) return alert('Selecione a loja.');
    if (!state.nome) return alert('Digite seu nome.');
    if (!state.gerente) return alert('Digite o nome do gerente de loja.');
    if (!state.relatorio) return alert('Selecione o relatório.');

    this.checklist.setup(state.loja, state.nome, state.gerente, state.relatorio);
    state.lojaLabel = state.loja === 'antonio-sales' ? 'Antônio Sales' : 'Messejana';
    state.todayISO = new Date().toISOString().slice(0, 10);

    this.showScreen('screenChecklist');
  }

  setStatus(id, status) {
    this.checklist.setAnswer(id, status);
    this.render();
  }

  saveObs(id, val) {
    this.checklist.setAnswer(id, undefined, val);
  }

  addPhotos(id, input) {
    const files = Array.from(input.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        this.checklist.addPhoto(id, e.target.result);
        this.render();
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removePhoto(id, idx) {
    this.checklist.removePhoto(id, idx);
    this.render();
  }

  openSigModal(who) {
    this.sigTarget = who;
    const overlay = document.getElementById('sigModalOverlay');
    const title = document.getElementById('sigModalTitle');
    title.textContent = `Assinatura — ${who === 'estagiaria' ? this.checklist.state.nome : this.checklist.state.gerente}`;
    overlay.classList.add('open');
    
    if (!this.sigService) {
      this.sigService = new SignatureService('sigCanvas', 'sigCanvasEmpty');
    }
    this.sigService.init();
    if (this.checklist.state.sigData[who]) {
      this.sigService.load(this.checklist.state.sigData[who]);
    }
  }

  closeSigModal() {
    document.getElementById('sigModalOverlay').classList.remove('open');
    this.sigTarget = null;
  }

  clearSigCanvas() {
    if (this.sigService) this.sigService.clear();
  }

  saveSig() {
    if (this.sigService && this.sigTarget) {
      const data = this.sigService.getData();
      this.checklist.setSignature(this.sigTarget, data);
      this.closeSigModal();
      this.render();
    }
  }

  generatePDF() {
    const html = this.pdf.generateHTML(
      this.checklist.state, 
      this.checklist.getStats(), 
      this.checklist.getSectors()
    );
    this.checklist.state.lastHTML = html;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank') || (location.href = url);
    
    this.showScreen('screenSuccess');
  }

  downloadPDFAgain() {
    if (this.checklist.state.lastHTML) {
      const blob = new Blob([this.checklist.state.lastHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank') || (location.href = url);
    }
  }

  startNew() {
    this.checklist.state = {
      loja: null,
      nome: null,
      gerente: null,
      relatorio: null,
      respostas: {},
      sigData: { estagiaria: null, gerente: null }
    };
    this.showScreen('screenSetup');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
