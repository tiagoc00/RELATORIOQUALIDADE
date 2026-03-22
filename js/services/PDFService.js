export class PDFService {
  generateHTML(state, stats, sectors) {
    const lojaLabel = state.loja === 'antonio-sales' ? 'Antônio Sales' : 'Messejana';
    const dateStr = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

    let sectorsHTML = '';
    sectors.forEach(setor => {
      let itemsHTML = '';
      setor.items.forEach(item => {
        const r = state.respostas[item.id];
        if (!r) return;
        const statusClass = r.status === 'conforme' ? 'conf' : r.status === 'nao-conforme' ? 'nc' : 'na';
        const statusLabel = r.status === 'conforme' ? '✓ CONFORME' : r.status === 'nao-conforme' ? '✗ NÃO CONF.' : '— N/A';
        const photosHTML = (r.status === 'nao-conforme' && r.photos.length > 0)
          ? `<div class="photos-label">📷 Registros fotográficos:</div>
             <div class="photos-grid">${r.photos.map(src => `<img src="${src}" class="photo-img">`).join('')}</div>`
          : '';
        const obsHTML = (r.status === 'nao-conforme' && r.obs)
          ? `<div class="item-obs">📝 ${r.obs}</div>` : '';
          
        itemsHTML += `
          <div class="item item-${statusClass}">
            <div class="item-row">
              <span class="item-code">${item.id}</span>
              <span class="item-text">${item.text}</span>
              <span class="badge badge-${statusClass}">${statusLabel}</span>
            </div>
            ${obsHTML}${photosHTML}
          </div>`;
      });
      sectorsHTML += `
        <div class="sector">
          <div class="sector-title">${setor.icon} ${setor.label.toUpperCase()}</div>
          ${itemsHTML}
        </div>`;
    });

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', Arial, sans-serif; font-size: 11px; color: #1A1916; background: #fff; }
  .page { padding: 20mm 15mm; }
  .header { background: #1A1916; color: #fff; border-radius: 8px; padding: 14px 16px; margin-bottom: 12px; }
  .header h1 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
  .header-meta { font-size: 10px; color: #aaa; }
  .summary { display: flex; gap: 10px; margin-bottom: 18px; }
  .sum-box { flex: 1; border-radius: 6px; padding: 10px 12px; }
  .sum-box.pct { background: #E8F4EE; }
  .sum-box.conf { background: #E8F4EE; }
  .sum-box.nc { background: #FDECEA; }
  .sum-box.na { background: #F5F4F0; }
  .sum-val { font-size: 18px; font-weight: 700; }
  .sum-val.green { color: #1A6B3C; }
  .sum-val.red { color: #C0392B; }
  .sum-val.gray { color: #7A7770; }
  .sum-label { font-size: 9px; color: #7A7770; margin-top: 2px; text-transform: uppercase; letter-spacing: .05em; }
  .sector { margin-bottom: 16px; }
  .sector-title {
    background: #1A1916; color: #fff; font-size: 10px; font-weight: 700;
    letter-spacing: .08em; padding: 6px 10px; border-radius: 5px; margin-bottom: 4px;
  }
  .item { border-radius: 5px; padding: 8px 10px; margin-bottom: 3px; border-left: 3px solid transparent; }
  .item-conf { background: #F0FAF4; border-left-color: #1A6B3C; }
  .item-nc   { background: #FDECEA; border-left-color: #C0392B; }
  .item-na   { background: #F5F4F0; border-left-color: #ccc; opacity: .75; }
  .item-row  { display: flex; align-items: flex-start; gap: 8px; }
  .item-code { font-family: monospace; font-size: 9px; background: rgba(0,0,0,.07); padding: 2px 5px; border-radius: 3px; flex-shrink: 0; margin-top: 1px; }
  .item-text { flex: 1; font-size: 10px; line-height: 1.5; }
  .badge { font-size: 8px; font-weight: 700; padding: 2px 7px; border-radius: 10px; flex-shrink: 0; margin-top: 1px; }
  .badge-conf { background: #1A6B3C; color: #fff; }
  .badge-nc   { background: #C0392B; color: #fff; }
  .badge-na   { background: #ccc; color: #555; }
  .item-obs { font-size: 9px; color: #7A3020; margin-top: 6px; font-style: italic; }
  .photos-label { font-size: 9px; font-weight: 600; color: #C0392B; margin-top: 8px; }
  .photos-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
  .photo-img { width: 90px; height: 90px; object-fit: cover; border-radius: 5px; border: 1px solid #E0DDD6; }
  .sig-section { margin-top: 24px; border: 1.5px solid #E0DDD6; border-radius: 8px; padding: 16px; }
  .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .sig-box { text-align: center; }
  .sig-img-wrap { height: 70px; display: flex; align-items: center; justify-content: center; border: 1px solid #E0DDD6; border-radius: 6px; background: #fafafa; }
  .sig-img { max-height: 64px; max-width: 100%; object-fit: contain; }
  .sig-line { width: 100%; height: 60px; border-bottom: 1.5px solid #1A1916; }
  .footer { margin-top: 20px; border-top: 1px solid #E0DDD6; padding-top: 8px; font-size: 9px; color: #aaa; display: flex; justify-content: space-between; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <h1>Checklist de Conformidade · Relatório ${state.relatorio}</h1>
    <p class="header-meta">Loja: ${lojaLabel} | Estagiária: ${state.nome} | Gerente: ${state.gerente || '—'} | ${dateStr}</p>
  </div>
  <div class="summary">
    <div class="sum-box pct"><div class="sum-val green">${stats.score}%</div><div class="sum-label">Conformidade</div></div>
    <div class="sum-box conf"><div class="sum-val green">${stats.conf}</div><div class="sum-label">Conformes</div></div>
    <div class="sum-box nc"><div class="sum-val red">${stats.nc}</div><div class="sum-label">Não conf.</div></div>
    <div class="sum-box na"><div class="sum-val gray">${stats.na}</div><div class="sum-label">N/A</div></div>
  </div>
  ${sectorsHTML}
  <div class="sig-section">
    <div class="sig-grid">
      <div class="sig-box">
        <p>Estagiária</p>
        <div class="sig-img-wrap">${state.sigData.estagiaria ? `<img src="${state.sigData.estagiaria}" class="sig-img">` : '<div class="sig-line"></div>'}</div>
        <p>${state.nome}</p>
      </div>
      <div class="sig-box">
        <p>Gerente de Loja</p>
        <div class="sig-img-wrap">${state.sigData.gerente ? `<img src="${state.sigData.gerente}" class="sig-img">` : '<div class="sig-line"></div>'}</div>
        <p>${state.gerente || '—'}</p>
      </div>
    </div>
  </div>
  <div class="footer"><span>Checklist Quality Report</span><span>${new Date().toLocaleDateString('pt-BR')}</span></div>
  <div class="no-print" style="margin-top: 20px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #1A6B3C; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Salvar PDF / Imprimir</button>
  </div>
</div>
</body></html>`;
  }
}
