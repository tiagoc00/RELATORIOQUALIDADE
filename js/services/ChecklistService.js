export class ChecklistService {
  constructor(setores, relatorios) {
    this.setores = setores;
    this.relatorios = relatorios;
    this.state = {
      loja: null,
      nome: null,
      gerente: null,
      relatorio: null,
      respostas: {}, // id -> { status: 'conforme'|'nao-conforme'|'na', obs: '', photos: [] }
      sigData: { estagiaria: null, gerente: null }
    };
  }

  setup(loja, nome, gerente, relatorio) {
    this.state.loja = loja;
    this.state.nome = nome;
    this.state.gerente = gerente;
    this.state.relatorio = relatorio;
    this.state.respostas = {};
    
    // Initialize responses for the selected report
    const sectorKeys = this.relatorios[relatorio];
    sectorKeys.forEach(sKey => {
      this.setores[sKey].items.forEach(item => {
        this.state.respostas[item.id] = { status: null, obs: '', photos: [] };
      });
    });
  }

  setAnswer(id, status, obs) {
    if (this.state.respostas[id]) {
      if (status !== undefined) this.state.respostas[id].status = status;
      if (obs !== undefined) this.state.respostas[id].obs = obs;
    }
  }

  addPhoto(id, photoData) {
    if (this.state.respostas[id]) {
      this.state.respostas[id].photos.push(photoData);
    }
  }

  removePhoto(id, index) {
    if (this.state.respostas[id]) {
      this.state.respostas[id].photos.splice(index, 1);
    }
  }

  setSignature(who, data) {
    this.state.sigData[who] = data;
  }

  getStats() {
    const vals = Object.values(this.state.respostas);
    const conf = vals.filter(v => v.status === 'conforme').length;
    const nc = vals.filter(v => v.status === 'nao-conforme').length;
    const na = vals.filter(v => v.status === 'na').length;
    const total = vals.length;
    const answered = vals.filter(v => v.status !== null).length;
    const pend = total - answered;
    const pct = Math.round((answered / total) * 100);
    const score = Math.round((conf / (total - na || 1)) * 100);

    return { conf, nc, na, total, pend, pct, score };
  }

  getSectors() {
    if (!this.state.relatorio) return [];
    return this.relatorios[this.state.relatorio].map(key => ({
      key,
      ...this.setores[key]
    }));
  }
}
