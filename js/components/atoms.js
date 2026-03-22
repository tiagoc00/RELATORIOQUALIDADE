export const Button = ({ label, className = '', onClick = '', disabled = false, id = '' }) => `
  <button 
    ${id ? `id="${id}"` : ''} 
    class="btn ${className}" 
    ${onClick ? `onclick="${onClick}"` : ''} 
    ${disabled ? 'disabled' : ''}
  >
    ${label}
  </button>
`;

export const Input = ({ type = 'text', id, placeholder = '', value = '', onInput = '', className = '' }) => `
  <input 
    type="${type}" 
    id="${id}" 
    placeholder="${placeholder}" 
    value="${value}" 
    ${onInput ? `oninput="${onInput}"` : ''}
    class="${className}"
  >
`;

export const Label = (text) => `
  <label>${text}</label>
`;

export const Pill = (text, icon = '') => `
  <span class="sector-pill">${icon ? icon + ' ' : ''}${text}</span>
`;

export const Badge = (label, type) => `
  <span class="badge badge-${type}">${label}</span>
`;

export const ThemeToggle = (isDark, onChange) => `
  <label class="theme-switch" title="Alternar tema">
    <input type="checkbox" id="themeToggleBtn" ${isDark ? 'checked' : ''} onchange="${onChange}">
    <span class="slider round"></span>
  </label>
`;
