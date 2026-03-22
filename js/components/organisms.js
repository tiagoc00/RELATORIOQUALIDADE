import { StatChip, PhotoItem } from './molecules.js';
import { Pill } from './atoms.js';

export const Header = (title, meta = '', subtitle = '', showLogout = false) => `
  <div class="header">
    <div class="header-top">
      <div style="display:flex;flex-direction:column;">
        <span class="logo">${title}</span>
        <span class="header-meta">${meta}</span>
      </div>
      ${showLogout ? '<button class="btn-logout" onclick="window.app.doLogout()">Sair 🚪</button>' : ''}
    </div>
    <h1>${subtitle}</h1>
  </div>
`;

export const ChecklistItemCard = (item, response, callbacks) => {
  const { id, text } = item;
  const { status, obs, photos } = response;
  
  const statusClasses = {
    'conforme': 'conforme',
    'nao-conforme': 'nao-conforme',
    'na': 'na'
  };

  const activeClasses = {
    'conforme': 'active-conf',
    'nao-conforme': 'active-nc',
    'na': 'active-na'
  };

  const photosHTML = (photos || []).map((photo, i) => 
    PhotoItem({ 
      src: photo.src, 
      id, 
      index: i, 
      caption: photo.caption,
      onRemove: callbacks.onPhotoRemove,
      onCaptionInput: callbacks.onPhotoCaptionInput
    })
  ).join('');

  return `
    <div class="item-card ${status ? statusClasses[status] : ''}" id="card-${id}">
      <div class="item-main">
        <span class="item-code">${id}</span>
        <span class="item-text">${text}</span>
      </div>
      <div class="item-actions">
        <button class="action-btn ${status === 'conforme' ? 'active-conf' : ''}" id="btn-conf-${id}" onclick="${callbacks.onStatusChange}('${id}','conforme')">✓ Conforme</button>
        <button class="action-btn ${status === 'nao-conforme' ? 'active-nc' : ''}" id="btn-nc-${id}" onclick="${callbacks.onStatusChange}('${id}','nao-conforme')">✗ Não conf.</button>
        <button class="action-btn ${status === 'na' ? 'active-na' : ''}" id="btn-na-${id}" onclick="${callbacks.onStatusChange}('${id}','na')">— N/A</button>
      </div>
      <div class="item-extra ${status === 'nao-conforme' ? 'visible' : ''}" id="extra-${id}">
        <div class="extra-label">Observação</div>
        <textarea class="obs-input" placeholder="Descreva a não conformidade..." oninput="${callbacks.onObsInput}('${id}', this.value)">${obs || ''}</textarea>
        <div class="extra-label">Fotos</div>
        <div class="photo-area" id="photos-${id}">
          ${photosHTML}
          <label class="photo-add">
            <input type="file" accept="image/*" multiple onchange="${callbacks.onPhotoAdd}('${id}', this)">
            <span>📷</span>
            <span>Adicionar</span>
          </label>
        </div>
      </div>
    </div>
  `;
};

export const SectorSection = (setor, responses, callbacks) => {
  const itemsHTML = setor.items.map(item => ChecklistItemCard(item, responses[item.id], callbacks)).join('');
  
  return `
    <div class="sector-header">
      ${Pill(setor.label, setor.icon)}
      <span class="sector-count">${setor.items.length} itens</span>
    </div>
    ${itemsHTML}
  `;
};

export const FooterStats = (stats, onGenerate) => `
  <div class="sticky-footer">
    <div class="footer-stats">
      ${StatChip({ label: `✓ ${stats.conf} Conformes`, type: 'conf', id: 'statConf' })}
      ${StatChip({ label: `✗ ${stats.nc} Não conf.`, type: 'nc', id: 'statNC' })}
      ${StatChip({ label: `○ ${stats.pend} Pendentes`, type: 'pend', id: 'statPend' })}
    </div>
    <button class="btn-generate" id="btnGenerate" onclick="${onGenerate}" ${stats.pend > 0 ? 'disabled' : ''}>
      📄 Gerar PDF ${stats.pend > 0 ? `(${stats.pend} pendentes)` : ''}
    </button>
  </div>
`;

export const SignatureBox = (label, who, value, onClick) => `
  <div>
    <div style="font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px;">${label}</div>
    <div class="sig-preview-box ${value ? 'signed' : ''}" id="sig-box-${who}" onclick="${onClick}('${who}')">
      ${value 
        ? `<img src="${value}">` 
        : '<div class="sig-preview-hint"><span>✍️</span><span>Toque para assinar</span></div>'
      }
    </div>
  </div>
`;
