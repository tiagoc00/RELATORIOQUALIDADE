import { Header, SectorSection, FooterStats, SignatureBox } from './organisms.js';
import { FormField, OptionBtn, ReportBtn } from './molecules.js';
import { Button } from './atoms.js';

export const LoginPage = (callbacks) => `
  <div class="login-wrap">
    <div class="login-box">
      <div class="login-brand">
        <div class="brand-icon">✅</div>
        <h2>Checklist Qualidade</h2>
        <p>Acesso restrito — equipe interna</p>
      </div>
      <div class="login-error" id="loginError">Senha incorreta. Tente novamente.</div>
      ${FormField({
        label: 'Senha',
        type: 'password',
        id: 'loginPassword',
        placeholder: 'Digite a senha',
        onInput: ''
      })}
      <button class="btn btn-primary" onclick="window.app.doLogin()">Entrar</button>
    </div>
  </div>
`;

export const SetupPage = (state, callbacks) => `
  ${Header('Qualidade', new Date().toLocaleDateString('pt-BR'), 'Novo Checklist', true)}
  <div class="setup-wrap">
    <h2>Olá! 👋</h2>
    <p>Configure o preenchimento de hoje antes de começar.</p>

    <div class="card">
      <h3>Loja</h3>
      <div class="option-grid">
        ${OptionBtn({ icon: '🏪', label: 'Antônio Sales', group: 'loja', val: 'antonio-sales', isSelected: state.loja === 'antonio-sales', onClick: "window.app.selectOption(this,'loja','antonio-sales')" })}
        ${OptionBtn({ icon: '🏪', label: 'Messejana', group: 'loja', val: 'messejana', isSelected: state.loja === 'messejana', onClick: "window.app.selectOption(this,'loja','messejana')" })}
      </div>
    </div>

    <div class="card">
      <h3>Estagiária</h3>
      ${Input({
        id: 'nomeInput',
        className: 'field',
        placeholder: 'Digite seu nome completo',
        value: state.nome || '',
        onInput: 'window.app.updateField(\'nome\', this.value)'
      })}
    </div>

    <div class="card">
      <h3>Gerente de Loja</h3>
      ${Input({
        id: 'gerenteInput',
        className: 'field',
        placeholder: 'Nome do gerente responsável',
        value: state.gerente || '',
        onInput: 'window.app.updateField(\'gerente\', this.value)'
      })}
    </div>

    <div class="card">
      <h3>Relatório</h3>
      <div class="report-grid">
        ${ReportBtn({ icon: '❄️🥦', name: 'Relatório A', sectors: 'Frios · Horti · Apoio · Loja', id: 'A', isSelected: state.relatorio === 'A', onClick: "window.app.selectOption(this,'relatorio','A')" })}
        ${ReportBtn({ icon: '🍖🔪', name: 'Relatório B', sectors: 'Gastr. · Açougue · Merc. · Loja', id: 'B', isSelected: state.relatorio === 'B', onClick: "window.app.selectOption(this,'relatorio','B')" })}
      </div>
    </div>

    <div class="start-btn-wrap">
      <button class="btn btn-primary" onclick="window.app.startChecklist()">Iniciar preenchimento →</button>
    </div>
  </div>
`;

export const ChecklistPage = (state, stats, sectors, callbacks) => `
  ${Header(state.lojaLabel, state.todayISO, state.nome + ' · Relatório ' + state.relatorio, true)}
  <div class="progress-bar-wrap">
    <div class="progress-bar-fill" id="progressFill" style="width:${stats.pct}%"></div>
  </div>
  <div class="checklist-wrap" id="checklistContent">
    ${sectors.map(setor => SectorSection(setor, state.respostas, callbacks)).join('')}
    
    <div class="sector-header" style="margin-top:32px;">
      <span class="sector-pill" style="background:#7A7770;">✍️ Assinatura</span>
    </div>
    <div class="item-card" id="card-assinatura" style="padding:20px 16px;">
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;line-height:1.5;">
        Confirmo que este relatório foi apresentado ao gerente de loja responsável.
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        ${SignatureBox('Estagiária', 'estagiaria', state.sigData.estagiaria, 'window.app.openSigModal')}
        ${SignatureBox('Gerente', 'gerente', state.sigData.gerente, 'window.app.openSigModal')}
      </div>
    </div>
  </div>
  ${FooterStats(stats, 'window.app.generatePDF()')}
`;

export const SuccessPage = (state) => `
  ${Header('Qualidade', '', 'Tudo certo!', true)}
  <div class="success-wrap">
    <div class="success-icon">✅</div>
    <h2>Checklist enviado!</h2>
    <p>O PDF foi gerado com sucesso. Encaminhe para o gestor pelo WhatsApp ou e-mail.</p>
    <button class="btn btn-primary" onclick="window.app.downloadPDFAgain()">⬇ Baixar PDF novamente</button>
    <button class="btn-new" onclick="window.app.startNew()">Novo preenchimento</button>
  </div>
`;

// Helper to keep Input available for templates
import { Input } from './atoms.js';
