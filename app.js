const GEOSEARCH = 'https://geosearch.planninglabs.nyc/v2/search';
const PIP_SERVICE = 'https://services6.arcgis.com/yG5s3afENB5iO9fj/ArcGIS/rest/services/DTM_ETL_DAILY_view/FeatureServer/18/query';
const OPEN_DATA = 'https://data.cityofnewyork.us/resource';
const OLD_CO_DATASET = 'bs8b-p36w';
const NEW_CO_DATASET = 'pkdm-hqz6';
const BBL_SEARCH = 'https://a836-pts-access.nyc.gov/care/search/commonsearch.aspx?mode=persprop';
const NOPV_DATE = '20260116';
const BOROUGHS = { 1: 'Manhattan', 2: 'Bronx', 3: 'Brooklyn', 4: 'Queens', 5: 'Staten Island' };
const COUNTIES = { 1: 'New York County', 2: 'Bronx County', 3: 'Kings County', 4: 'Queens County', 5: 'Richmond County' };
const HPD_DATASETS = ['tesw-yqqr', 'wvxf-dwi5', 'ygpa-z7cr', '59kj-x8nc', 'cp6j-7bjj', 'kj4p-ruqc'];
const labels = {
  address: '官方记录地址', buildingClass: '建筑类别', taxClass: '税务类别',
  buildings: '建筑数量', yearBuilt: '建造年份', floors: '楼层数',
  totalUnits: '总单元数', residentialUnits: '住宅单元', commercialUnits: '商业单元',
  buildingAreaSqFt: '建筑面积（平方英尺）', residentialAreaSqFt: '住宅面积（平方英尺）',
  commercialAreaSqFt: '商业面积（平方英尺）', landAreaSqFt: '土地面积（平方英尺）',
  zoning: '主要分区', style: '建筑风格', constructionType: '结构',
  exteriorWall: '外墙', exteriorCondition: '外部状况', basement: '地下室'
};
const form = document.querySelector('#searchForm');
const input = document.querySelector('#address');
const button = document.querySelector('#searchButton');
const bblForm = document.querySelector('#bblForm');
const bblInput = document.querySelector('#bblInput');
const bblButton = document.querySelector('#bblButton');
const status = document.querySelector('#status');
const result = document.querySelector('#result');

function safe(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function addressKey(value) {
  return String(value || '').split(',')[0].toUpperCase()
    .replace(/\b(\d+)(ST|ND|RD|TH)\b/g, '$1')
    .replace(/\b(WEST|W)\b/g, 'W').replace(/\b(EAST|E)\b/g, 'E')
    .replace(/\b(NORTH|N)\b/g, 'N').replace(/\b(SOUTH|S)\b/g, 'S')
    .replace(/\b(STREET|ST)\b/g, 'ST').replace(/\b(AVENUE|AVE|AV)\b/g, 'AVE')
    .replace(/\b(ROAD|RD)\b/g, 'RD').replace(/\b(PLACE|PL)\b/g, 'PL')
    .replace(/[^A-Z0-9]/g, '');
}
function parseBbl(value) {
  const input = String(value || '').trim();
  if (/^[1-5]\d{9}$/.test(input)) return input;
  const parts = input.match(/^([1-5])\s*[-/ ]\s*(\d{1,5})\s*[-/ ]\s*(\d{1,4})$/);
  return parts ? parts[1] + parts[2].padStart(5, '0') + parts[3].padStart(4, '0') : null;
}
async function json(url) {
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`市府服务返回 HTTP ${response.status}`);
  const value = await response.json();
  if (value.error) throw new Error(value.error.message || '市府服务查询失败');
  return value;
}
async function findAddress(address) {
  if (address.length < 5 || address.length > 180) throw new Error('请输入完整的纽约市物业地址。');
  const geo = await json(`${GEOSEARCH}?${new URLSearchParams({ text: address, size: '10' })}`);
  const zip = address.match(/\b\d{5}\b/)?.[0];
  const matches = (geo.features || []).filter(f =>
    addressKey(f.properties?.label) === addressKey(address) &&
    (!zip || !f.properties?.postalcode || f.properties.postalcode === zip)
  ).map(f => ({
    bbl: parseBbl(f.properties?.addendum?.pad?.bbl || f.properties?.pad_bbl),
    label: f.properties?.label || ''
  })).filter(x => x.bbl);
  const unique = [...new Map(matches.map(x => [x.bbl, x])).values()];
  if (!unique.length) throw new Error('没有找到与门牌、街道和 ZIP Code 匹配的物业。可使用下方 BBL 直接查询。');
  if (unique.length > 1) return { candidates: unique };
  return propertyForBbl(unique[0].bbl, unique[0].label);
}
async function propertyForBbl(bbl, label = '') {
  const query = new URLSearchParams({ where: `PARID='${bbl}'`, outFields: '*', returnGeometry: 'false', f: 'json' });
  let a = null;
  try {
    const pip = await json(`${PIP_SERVICE}?${query}`);
    a = pip.features?.[0]?.attributes || null;
  } catch { /* Keep BBL and official links available during PIP outages. */ }
  const boro = Number(bbl[0]);
  const block = Number(bbl.slice(1, 6));
  const lot = Number(bbl.slice(6));
  const [oldCo, newCo, hpdBuildingId] = await Promise.all([
    coRecords(OLD_CO_DATASET, bbl, 'c_o_issue_date DESC'),
    coRecords(NEW_CO_DATASET, bbl, 'submitted_date DESC'),
    findHpdBuildingId(boro, block, lot)
  ]);
  return {
    address: label || [a?.HOUSENUM, a?.STREET_NAME].filter(Boolean).join(' '),
    bbl, borough: BOROUGHS[boro], county: COUNTIES[boro], boro, block, lot,
    pipUrl: `https://propertyinformationportal.nyc.gov/parcels/parcel/${bbl}`,
    bisUrl: `https://a810-bisweb.nyc.gov/bisweb/PropertyBrowseByBBLServlet?${new URLSearchParams({ allborough: boro, allblock: block, alllot: lot })}`,
    dobNowUrl: 'https://a810-dobnow.nyc.gov/publish/Index.html#!/search',
    hpdSearchUrl: `https://hpdonline.nyc.gov/hpdonline/building/search-results?${new URLSearchParams({ boroId: boro, boro: BOROUGHS[boro], block, lot })}`,
    hpdBuildingId, oldCo, newCo,
    bblSearchUrl: BBL_SEARCH,
    nopvPageUrl: `https://a836-pts-access.nyc.gov/care/datalets/datalet.aspx?UseSearch=no&mode=nopv&pin=${bbl}`,
    nopvPdfUrl: `https://a836-edms.nyc.gov/dctm-rest/repositories/dofedmspts/StatementSearch?${new URLSearchParams({ bbl, stmtDate: NOPV_DATE, stmtType: 'NPV' })}`,
    building: a ? {
      address: [a.HOUSENUM, a.STREET_NAME].filter(Boolean).join(' '),
      buildingClass: a.BLDG_CLASS, taxClass: a.TAX_CLASS, buildings: a.NUM_BLDGS,
      yearBuilt: a.YRBUILT, floors: a.BLD_STORY, totalUnits: a.TOTAL_UNITS,
      residentialUnits: a.RESIDENTIAL_UNITS, commercialUnits: a.COMMERCIAL_UNITS,
      buildingAreaSqFt: a.GROSS_SQFT, residentialAreaSqFt: a.RESIDENTIAL_SQFT,
      commercialAreaSqFt: a.COMMERCIAL_SQFT, landAreaSqFt: a.LAND_AREA,
      zoning: a.ZONING, style: a.STYLE, constructionType: a.CONSTRUCTION_TYPE,
      exteriorWall: a.EXTERIOR_WALL, exteriorCondition: a.EXTERIOR_CONDITION,
      basement: a.BASEMENT_TYPE
    } : null
  };
}
async function coRecords(dataset, bbl, order) {
  try {
    const params = new URLSearchParams({ '$where': `bbl='${bbl}'`, '$limit': '50', '$order': order });
    return await json(`${OPEN_DATA}/${dataset}.json?${params}`);
  } catch { return []; }
}
async function findHpdBuildingId(boro, block, lot) {
  const where = `boroid=${boro} AND block=${block} AND lot=${lot}`;
  const requests = HPD_DATASETS.map(async dataset => {
    const params = new URLSearchParams({ '$select': 'buildingid', '$where': where, '$limit': '1' });
    return (await json(`${OPEN_DATA}/${dataset}.json?${params}`))[0]?.buildingid || null;
  });
  const results = await Promise.allSettled(requests);
  return results.find(x => x.status === 'fulfilled' && x.value)?.value || null;
}
async function search(task) {
  button.disabled = true; bblButton.disabled = true;
  status.className = 'message'; status.textContent = '正在查询市府资料…'; result.style.display = 'none';
  try {
    const data = task.bbl ? await propertyForBbl(parseBbl(task.bbl) || (() => { throw new Error('请输入 10 位 BBL，或例如 3-6264-77。'); })()) : await findAddress(task.address.trim());
    render(data); status.textContent = '查询完成 · 后续查询统一使用 Borough、Block、Lot';
  } catch (error) {
    status.className = 'message error'; status.textContent = error.message || '查询失败';
  } finally { button.disabled = false; bblButton.disabled = false; }
}
function render(data) {
  result.style.display = 'block';
  if (data.candidates) {
    result.innerHTML = '<section class="card"><h2>请选择正确的地块</h2>' + data.candidates.map(c =>
      `<p><button data-bbl="${safe(c.bbl)}">${safe(c.label)} · BBL ${safe(c.bbl)}</button></p>`).join('') + '</section>';
    return;
  }
  const b = data.building;
  const rows = b ? Object.entries(labels).filter(([key]) => b[key] !== null && b[key] !== undefined && b[key] !== '')
    .map(([key, label]) => `<tr><td>${label}</td><td>${safe(b[key])}</td></tr>`).join('') : '';
  const coRows = [
    ...data.newCo.map(x => ({ era: '2021-03-01 以后 · DOB NOW', number: x.c_of_o_number || x.application_number, type: x.c_of_o_filing_type, status: x.c_of_o_status, date: x.c_of_o_issuance_date || x.submitted_date, href: data.dobNowUrl, action: '打开 DOB NOW 打印' })),
    ...data.oldCo.map(x => ({ era: '2021-03-01 以前 · BIS', number: `${x.job_number || ''}${x.item_number ? ` / ${x.item_number}` : ''}`, type: x.issue_type, status: x.application_status_raw, date: x.c_o_issue_date?.slice(0, 10), href: `https://a810-bisweb.nyc.gov/bisweb/COPdfListingServlet?${new URLSearchParams({ bin: x.bin_number || x.bin || '', borough: data.boro, key: x.job_number || '', requestid: '1' })}`, action: '打开并下载 CO PDF' }))
  ];
  const coHtml = coRows.length ? `<div class="co-list">${coRows.map(x => `<article class="record"><p class="small muted">${safe(x.era)}</p><strong>${safe(x.number || 'Certificate of Occupancy')}</strong><p>${safe([x.type, x.status, x.date].filter(Boolean).join(' · '))}</p><a class="primary" href="${safe(x.href)}" target="_blank" rel="noopener noreferrer">${safe(x.action)} ↗</a></article>`).join('')}</div>` : '<p class="message warning">市府开放数据中没有找到该 BBL 的入住许可证。较老建筑可能无需 CO；也可分别打开 BIS 与 DOB NOW 复核。</p>';
  const hpdBase = data.hpdBuildingId ? `https://hpdonline.nyc.gov/hpdonline/building/${data.hpdBuildingId}` : null;
  const hpdLinks = hpdBase ? [
    ['建筑概览', 'overview'], ['Complaints', 'complaints'], ['Violations', 'violations'],
    ['Building Charges / Fees', 'charges'], ['Litigation', 'litigations']
  ].map(([label, path]) => `<a href="${hpdBase}/${path}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join('') : `<a href="${safe(data.hpdSearchUrl)}" target="_blank" rel="noopener noreferrer">打开 HPD 的 BBL 查询结果 ↗</a>`;
  result.innerHTML = `<section class="card"><h2>${safe(data.address || '物业资料')}</h2>
    <p><span class="pill">${safe(data.borough)}</span>　County: ${safe(data.county)} · Block ${data.block} · Lot ${data.lot} · BBL ${safe(data.bbl)}</p>
    <div class="links"><a href="${safe(data.pipUrl)}" target="_blank" rel="noopener noreferrer">Property Information Portal ↗</a>
    <a href="${safe(data.bisUrl)}" target="_blank" rel="noopener noreferrer">DOB Building Information ↗</a>
    <a href="${safe(data.nopvPageUrl)}" target="_blank" rel="noopener noreferrer">财政局 BBL 对应物业页面 ↗</a>
    <a href="${safe(data.bblSearchUrl)}" target="_blank" rel="noopener noreferrer">财政局 BBL Search ↗</a></div></section>
    <div class="grid"><section class="card"><h2>Building Information</h2>${b ? `<table>${rows}</table>` : '<p class="message warning">PIP 楼宇资料暂时不可读取。可打开上方原网站。</p>'}
    <p class="muted small">来源：NYC Property Information Portal 使用的市府地块数据。</p></section>
    <section class="card"><h2>Notice of Property Value</h2><p class="muted small">使用 BBL ${safe(data.bbl)}，无需财政局识别地址。</p>
    <div class="notice"><p><strong>2026–27 年度 NOPV</strong></p>
    <a class="primary" href="${safe(data.nopvPdfUrl)}" target="_blank" rel="noopener noreferrer">打开财政局 PDF ↗</a>
    <p class="muted small">如需最新修订版或历年文件，请打开上方财政局物业页面。</p></div></section></div>
    <section class="card"><h2>Certificate of Occupancy</h2><p class="muted small">两套市府数据均按 BBL ${safe(data.bbl)} 查询。2021-03-01 前由 BIS 提供 PDF；此日期起由 DOB NOW 提供打印文件。</p>${coHtml}<div class="links secondary-links"><a href="${safe(data.bisUrl)}" target="_blank" rel="noopener noreferrer">BIS 物业页 ↗</a><a href="${safe(data.dobNowUrl)}" target="_blank" rel="noopener noreferrer">DOB NOW Public Portal ↗</a></div></section>
    <section class="card"><h2>HPD Building Records</h2><p class="muted small">Complaints、Violations、Building Charges / Fees、Litigation</p><div class="links hpd-links">${hpdLinks}</div>${data.hpdBuildingId ? '' : '<p class="muted small">HPD 开放数据未返回 Building ID；官方链接已预填 Borough、Block、Lot，打开后选择该建筑。</p>'}</section>`;
}
form.addEventListener('submit', event => { event.preventDefault(); search({ address: input.value }); });
bblForm.addEventListener('submit', event => { event.preventDefault(); search({ bbl: bblInput.value }); });
result.addEventListener('click', event => { const bbl = event.target.closest('[data-bbl]')?.dataset.bbl; if (bbl) search({ bbl }); });
const preset = new URLSearchParams(location.search).get('address');
if (preset) { input.value = preset; search({ address: preset }); }
