import { Button, Input, Label } from './atoms.js';

export const FormField = ({ label, type, id, placeholder, onInput, value = '' }) => `
  <div class="field">
    ${Label(label)}
    ${Input({ type, id, placeholder, onInput, value })}
  </div>
`;

export const OptionBtn = ({ icon, label, group, val, isSelected, onClick }) => `
  <button 
    class="option-btn ${isSelected ? 'selected' : ''}" 
    onclick="${onClick}" 
    data-group="${group}" 
    data-val="${val}"
  >
    <span class="opt-icon">${icon}</span>
    <span class="opt-label">${label}</span>
  </button>
`;

export const ReportBtn = ({ icon, name, sectors, id, isSelected, onClick }) => `
  <button 
    class="report-btn ${isSelected ? 'selected' : ''}" 
    onclick="${onClick}" 
    data-group="relatorio" 
    data-val="${id}"
  >
    <div class="report-icon">${icon}</div>
    <div class="report-name">${name}</div>
    <div class="report-sectors">${sectors}</div>
  </button>
`;

export const StatChip = ({ label, type, id }) => `
  <span class="stat-chip ${type}" id="${id}">${label}</span>
`;

export const PhotoItem = ({ src, id, index, onRemove }) => `
  <div class="photo-item">
    <img class="photo-thumb" src="${src}">
    <button class="photo-remove" onclick="${onRemove}('${id}', ${index})">×</button>
  </div>
`;
