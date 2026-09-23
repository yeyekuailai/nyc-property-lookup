const GEOSEARCH = 'https://geosearch.planninglabs.nyc/v2/search';
const PIP_SERVICE = 'https://services6.arcgis.com/yG5s3afENB5iO9fj/ArcGIS/rest/services/DTM_ETL_DAILY_view/FeatureServer/18/query';
const OPEN_DATA = 'https://data.cityofnewyork.us/resource';
const OLD_CO_DATASET = 'bs8b-p36w';
const NEW_CO_DATASET = 'pkdm-hqz6';
const NASSAU_GEOCODER = 'https://legacygis.nassaucountyny.gov/arcgis/rest/services/NassauAddressSearch/GeocodeServer/findAddressCandidates';
const NASSAU_PARCELS = 'https://legacygis.nassaucountyny.gov/arcgis/rest/services/Akanda/MapServer/1/query';
const NASSAU_LRV = 'https://lrv.nassaucountyny.gov/';
const NOPV_DATE = '20260116';
const BOROUGHS = { 1: 'Manhattan', 2: 'Bronx', 3: 'Brooklyn', 4: 'Queens', 5: 'Staten Island' };
const COUNTIES = { 1: 'New York County', 2: 'Bronx County', 3: 'Kings County', 4: 'Queens County', 5: 'Richmond County' };
const BUILDING_FIELDS = ['address', 'buildingClass', 'taxClass', 'buildings', 'yearBuilt', 'floors', 'totalUnits', 'residentialUnits', 'commercialUnits', 'buildingAreaSqFt', 'residentialAreaSqFt', 'commercialAreaSqFt', 'landAreaSqFt', 'zoning', 'style', 'constructionType', 'exteriorWall', 'exteriorCondition', 'basement'];
const I18N = {
  en: {
    addressLabel: 'Step 1: Find the property by address', addressPlaceholder: 'Example: 133-57 41st Rd, Flushing, NY 11355', searchButton: 'Search Property',
    addressHelp: 'Searches NYC and Nassau County official property services. NYC results use Borough, Block, and Lot; Nassau results use Section, Block, and Lot.',
    bblLabel: 'Already have a BBL? Search directly', bblPlaceholder: 'Example: 3-6264-77 or 3062640077', bblButton: 'Search by BBL',
    searching: 'Searching official property records…', complete: 'Search complete · Downstream searches use Borough, Block, and Lot', completeNassau: 'Search complete · Nassau County parcel found', failed: 'Search failed',
    badAddress: 'Enter a complete New York City property address.', noMatch: 'No property matched the house number, street, and ZIP Code. You can search by BBL below.', badBbl: 'Enter a 10-digit BBL or a value such as 3-6264-77.', cityHttp: 'NYC service returned HTTP', cityFailed: 'NYC service lookup failed',
    chooseLot: 'Choose the correct tax lot', property: 'Property information', pip: 'Property Information Portal', dobBuilding: 'DOB Building Information', dofProperty: 'DOF property page',
    buildingInfo: 'Building Information', buildingUnavailable: 'PIP building information is temporarily unavailable. Open the official portal above.', buildingSource: 'Source: NYC public parcel data used by the Property Information Portal.',
    nopv: 'Notice of Property Value', nopvHelp: 'Uses BBL {bbl}; no address matching by the Department of Finance is required.', nopvAnnual: '2026–27 Annual NOPV', openDofPdf: 'Open DOF PDF', nopvHistory: 'For revisions or prior years, open the DOF property page above.',
    co: 'Certificate of Occupancy', coHelp: 'Both NYC datasets are searched with BBL {bbl}. BIS provides PDFs for requests before March 1, 2021; DOB NOW provides printable records from that date forward.',
    coNew: 'On or after 2021-03-01 · DOB NOW', coOld: 'Before 2021-03-01 · BIS', openDobNow: 'Open DOB NOW to print', openCoPdf: 'Open and download CO PDF', noCo: 'No Certificate of Occupancy was found for this BBL in NYC Open Data. Some older buildings do not require a CO; check BIS and DOB NOW below.', bisProperty: 'BIS property page', dobNowPortal: 'DOB NOW Public Portal',
    hpd: 'HPD', openHpd: 'Open HPD property records', languageButton: '中文',
    nassauProperty: 'Nassau County Property Information', section: 'Section', parcel: 'Parcel (SBL)', parcelKey: 'Parcel Key', nassauHelp: 'Use the Section, Block, and Lot shown here in the official Land Records Viewer for assessment rolls, tax maps, exemptions, prior taxes, and comparable sales.', openNassau: 'Open Nassau County Land Records Viewer',
    labels: { address: 'Official record address', buildingClass: 'Building class', taxClass: 'Tax class', buildings: 'Number of buildings', yearBuilt: 'Year built', floors: 'Floors', totalUnits: 'Total units', residentialUnits: 'Residential units', commercialUnits: 'Commercial units', buildingAreaSqFt: 'Building area (sq ft)', residentialAreaSqFt: 'Residential area (sq ft)', commercialAreaSqFt: 'Commercial area (sq ft)', landAreaSqFt: 'Land area (sq ft)', zoning: 'Primary zoning', style: 'Building style', constructionType: 'Construction type', exteriorWall: 'Exterior wall', exteriorCondition: 'Exterior condition', basement: 'Basement' }
  },
  zh: {
    addressLabel: '第一步：用地址定位地块', addressPlaceholder: '例如 133-57 41st Rd, Flushing, NY 11355', searchButton: '查询物业',
    addressHelp: '同时查询纽约市与 Nassau County 官方物业服务。纽约市使用 Borough、Block、Lot；Nassau 使用 Section、Block、Lot。',
    bblLabel: '已有 BBL？直接查询', bblPlaceholder: '例如 3-6264-77 或 3062640077', bblButton: '用 BBL 查询',
    searching: '正在查询官方物业资料…', complete: '查询完成 · 后续查询统一使用 Borough、Block、Lot', completeNassau: '查询完成 · 已找到 Nassau County 地块', failed: '查询失败',
    badAddress: '请输入完整的纽约市物业地址。', noMatch: '没有找到与门牌、街道和 ZIP Code 匹配的物业。可使用下方 BBL 直接查询。', badBbl: '请输入 10 位 BBL，或例如 3-6264-77。', cityHttp: '市府服务返回 HTTP', cityFailed: '市府服务查询失败',
    chooseLot: '请选择正确的地块', property: '物业资料', pip: 'Property Information Portal', dobBuilding: 'DOB Building Information', dofProperty: '财政局 BBL 对应物业页面',
    buildingInfo: 'Building Information', buildingUnavailable: 'PIP 楼宇资料暂时不可读取。可打开上方原网站。', buildingSource: '来源：NYC Property Information Portal 使用的市府地块数据。',
    nopv: 'Notice of Property Value', nopvHelp: '使用 BBL {bbl}，无需财政局识别地址。', nopvAnnual: '2026–27 年度 NOPV', openDofPdf: '打开财政局 PDF', nopvHistory: '如需最新修订版或历年文件，请打开上方财政局物业页面。',
    co: 'Certificate of Occupancy', coHelp: '两套市府数据均按 BBL {bbl} 查询。2021-03-01 前由 BIS 提供 PDF；此日期起由 DOB NOW 提供打印文件。',
    coNew: '2021-03-01 以后 · DOB NOW', coOld: '2021-03-01 以前 · BIS', openDobNow: '打开 DOB NOW 打印', openCoPdf: '打开并下载 CO PDF', noCo: '市府开放数据中没有找到该 BBL 的入住许可证。较老建筑可能无需 CO；也可分别打开 BIS 与 DOB NOW 复核。', bisProperty: 'BIS 物业页', dobNowPortal: 'DOB NOW Public Portal',
    hpd: 'HPD', openHpd: '打开 HPD 物业记录', languageButton: 'English',
    nassauProperty: 'Nassau County 物业资料', section: 'Section', parcel: '地块（SBL）', parcelKey: 'Parcel Key', nassauHelp: '使用这里显示的 Section、Block、Lot，在官方 Land Records Viewer 查看评估记录、税务地图、减免、历年税款和可比销售。', openNassau: '打开 Nassau County Land Records Viewer',
    labels: { address: '官方记录地址', buildingClass: '建筑类别', taxClass: '税务类别', buildings: '建筑数量', yearBuilt: '建造年份', floors: '楼层数', totalUnits: '总单元数', residentialUnits: '住宅单元', commercialUnits: '商业单元', buildingAreaSqFt: '建筑面积（平方英尺）', residentialAreaSqFt: '住宅面积（平方英尺）', commercialAreaSqFt: '商业面积（平方英尺）', landAreaSqFt: '土地面积（平方英尺）', zoning: '主要分区', style: '建筑风格', constructionType: '结构', exteriorWall: '外墙', exteriorCondition: '外部状况', basement: '地下室' }
  }
};
const form = document.querySelector('#searchForm');
const input = document.querySelector('#address');
const button = document.querySelector('#searchButton');
const bblForm = document.querySelector('#bblForm');
const bblInput = document.querySelector('#bblInput');
const bblButton = document.querySelector('#bblButton');
const status = document.querySelector('#status');
const result = document.querySelector('#result');
const languageToggle = document.querySelector('#languageToggle');
let language = localStorage.getItem('nyc-property-language') || 'en';
let currentData = null;
let statusState = '';
function t(key, values = {}) { let text = I18N[language][key] || key; for (const [name, value] of Object.entries(values)) text = text.replace(`{${name}}`, value); return text; }
function applyLanguage() {
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  document.querySelector('#addressLabel').textContent = t('addressLabel'); input.placeholder = t('addressPlaceholder'); button.textContent = t('searchButton');
  document.querySelector('#addressHelp').textContent = t('addressHelp'); document.querySelector('#bblLabel').textContent = t('bblLabel'); bblInput.placeholder = t('bblPlaceholder'); bblButton.textContent = t('bblButton'); languageToggle.textContent = t('languageButton');
  if (statusState) status.textContent = t(statusState); if (currentData) render(currentData);
}
function safe(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function addressKey(value) { return String(value || '').split(',')[0].toUpperCase().replace(/\b(\d+)(ST|ND|RD|TH)\b/g, '$1').replace(/\b(WEST|W)\b/g, 'W').replace(/\b(EAST|E)\b/g, 'E').replace(/\b(NORTH|N)\b/g, 'N').replace(/\b(SOUTH|S)\b/g, 'S').replace(/\b(STREET|ST)\b/g, 'ST').replace(/\b(AVENUE|AVE|AV)\b/g, 'AVE').replace(/\b(ROAD|RD)\b/g, 'RD').replace(/\b(PLACE|PL)\b/g, 'PL').replace(/[^A-Z0-9]/g, ''); }
function parseBbl(value) { const raw = String(value || '').trim(); if (/^[1-5]\d{9}$/.test(raw)) return raw; const parts = raw.match(/^([1-5])\s*[-/ ]\s*(\d{1,5})\s*[-/ ]\s*(\d{1,4})$/); return parts ? parts[1] + parts[2].padStart(5, '0') + parts[3].padStart(4, '0') : null; }
async function json(url) { const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(12000) }); if (!response.ok) throw new Error(`${t('cityHttp')} ${response.status}`); const value = await response.json(); if (value.error) throw new Error(value.error.message || t('cityFailed')); return value; }
async function findAddress(address) {
  if (address.length < 5 || address.length > 180) throw new Error(t('badAddress'));
  const geo = await json(`${GEOSEARCH}?${new URLSearchParams({ text: address, size: '10' })}`); const zip = address.match(/\b\d{5}\b/)?.[0];
  const matches = (geo.features || []).filter(f => addressKey(f.properties?.label) === addressKey(address) && (!zip || !f.properties?.postalcode || f.properties.postalcode === zip)).map(f => ({ bbl: parseBbl(f.properties?.addendum?.pad?.bbl || f.properties?.pad_bbl), label: f.properties?.label || '' })).filter(x => x.bbl);
  const unique = [...new Map(matches.map(x => [x.bbl, x])).values()];
  if (!unique.length) return findNassauAddress(address);
  if (unique.length > 1) return { candidates: unique };
  return propertyForBbl(unique[0].bbl, unique[0].label);
}
async function findNassauAddress(address) {
  const params = new URLSearchParams({ SingleLine: address, outFields: '*', maxLocations: '10', f: 'json' });
  const geocoded = await json(`${NASSAU_GEOCODER}?${params}`);
  const zip = address.match(/\b\d{5}\b/)?.[0];
  const candidate = (geocoded.candidates || []).find(item => item.score >= 90 && (!zip || item.attributes?.ZIP === zip));
  if (!candidate?.location) throw new Error(t('noMatch'));
  const geometry = JSON.stringify({ ...candidate.location, spatialReference: geocoded.spatialReference || { wkid: 102718 } });
  const parcelParams = new URLSearchParams({ geometry, geometryType: 'esriGeometryPoint', inSR: String(geocoded.spatialReference?.wkid || 102718), spatialRel: 'esriSpatialRelIntersects', outFields: '*', returnGeometry: 'false', f: 'json' });
  const parcelResponse = await json(`${NASSAU_PARCELS}?${parcelParams}`);
  const parcel = parcelResponse.features?.[0]?.attributes;
  if (!parcel) throw new Error(t('noMatch'));
  const parts = String(parcel.PARCEL || parcel.FIRST_SBL || '').trim().split(/\s+/);
  return { jurisdiction: 'nassau', address: candidate.address, county: 'Nassau County', section: parts[0] || parcel.SECTION, block: parts[1] || parcel.BLOCK, lot: parts[2] || '', parcel: parcel.PARCEL || parcel.FIRST_SBL, parcelKey: parcel.PARCELKEY, nassauUrl: NASSAU_LRV };
}
async function propertyForBbl(bbl, label = '') {
  const query = new URLSearchParams({ where: `PARID='${bbl}'`, outFields: '*', returnGeometry: 'false', f: 'json' }); let a = null;
  try { a = (await json(`${PIP_SERVICE}?${query}`)).features?.[0]?.attributes || null; } catch { /* Keep official links available during PIP outages. */ }
  const boro = Number(bbl[0]), block = Number(bbl.slice(1, 6)), lot = Number(bbl.slice(6));
  const [oldCo, newCo] = await Promise.all([coRecords(OLD_CO_DATASET, bbl, BOROUGHS[boro], block, lot, 'c_o_issue_date DESC'), coRecords(NEW_CO_DATASET, bbl, BOROUGHS[boro], block, lot, 'submitted_date DESC')]);
  return { address: label || [a?.HOUSENUM, a?.STREET_NAME].filter(Boolean).join(' '), bbl, borough: BOROUGHS[boro], county: COUNTIES[boro], boro, block, lot,
    pipUrl: `https://propertyinformationportal.nyc.gov/parcels/parcel/${bbl}`, bisUrl: `https://a810-bisweb.nyc.gov/bisweb/PropertyBrowseByBBLServlet?${new URLSearchParams({ allborough: boro, allblock: block, alllot: lot })}`, dobNowUrl: 'https://a810-dobnow.nyc.gov/publish/Index.html#!/search', hpdSearchUrl: `https://hpdonline.nyc.gov/hpdonline/building/search-results?${new URLSearchParams({ boroId: boro, boro: BOROUGHS[boro], block, lot })}`, oldCo, newCo,
    nopvPageUrl: `https://a836-pts-access.nyc.gov/care/datalets/datalet.aspx?UseSearch=no&mode=nopv&pin=${bbl}`, nopvPdfUrl: `https://a836-edms.nyc.gov/dctm-rest/repositories/dofedmspts/StatementSearch?${new URLSearchParams({ bbl, stmtDate: NOPV_DATE, stmtType: 'NPV' })}`,
    building: a ? { address: [a.HOUSENUM, a.STREET_NAME].filter(Boolean).join(' '), buildingClass: a.BLDG_CLASS, taxClass: a.TAX_CLASS, buildings: a.NUM_BLDGS, yearBuilt: a.YRBUILT, floors: a.BLD_STORY, totalUnits: a.TOTAL_UNITS, residentialUnits: a.RESIDENTIAL_UNITS, commercialUnits: a.COMMERCIAL_UNITS, buildingAreaSqFt: a.GROSS_SQFT, residentialAreaSqFt: a.RESIDENTIAL_SQFT, commercialAreaSqFt: a.COMMERCIAL_SQFT, landAreaSqFt: a.LAND_AREA, zoning: a.ZONING, style: a.STYLE, constructionType: a.CONSTRUCTION_TYPE, exteriorWall: a.EXTERIOR_WALL, exteriorCondition: a.EXTERIOR_CONDITION, basement: a.BASEMENT_TYPE } : null };
}
async function coRecords(dataset, bbl, borough, block, lot, order) { try { const blockValues = [...new Set([String(block), String(block).padStart(5, '0')])], lotValues = [...new Set([String(lot), String(lot).padStart(4, '0'), String(lot).padStart(5, '0')])], quoted = values => values.map(value => `'${value}'`).join(','), where = `bbl='${bbl}' OR (borough='${borough}' AND block IN(${quoted(blockValues)}) AND lot IN(${quoted(lotValues)}))`; return await json(`${OPEN_DATA}/${dataset}.json?${new URLSearchParams({ '$where': where, '$limit': '50', '$order': order })}`); } catch { return []; } }
async function search(task) {
  button.disabled = true; bblButton.disabled = true; statusState = 'searching'; status.className = 'message'; status.textContent = t('searching'); result.style.display = 'none';
  try { const data = task.bbl ? await propertyForBbl(parseBbl(task.bbl) || (() => { throw new Error(t('badBbl')); })()) : await findAddress(task.address.trim()); currentData = data; render(data); statusState = data.jurisdiction === 'nassau' ? 'completeNassau' : 'complete'; status.textContent = t(statusState); }
  catch (error) { statusState = ''; status.className = 'message error'; status.textContent = error.message || t('failed'); }
  finally { button.disabled = false; bblButton.disabled = false; }
}
function render(data) {
  result.style.display = 'block';
  if (data.jurisdiction === 'nassau') {
    result.innerHTML = `<section class="card"><h2>${safe(data.address)}</h2><p><span class="pill">Nassau</span>　${safe(data.county)} · ${t('section')} ${safe(data.section)} · Block ${safe(data.block)} · Lot ${safe(data.lot)}</p></section>
      <section class="card"><h2>${t('nassauProperty')}</h2><table><tr><td>${t('parcel')}</td><td>${safe(data.parcel)}</td></tr><tr><td>${t('section')}</td><td>${safe(data.section)}</td></tr><tr><td>Block</td><td>${safe(data.block)}</td></tr><tr><td>Lot</td><td>${safe(data.lot)}</td></tr><tr><td>${t('parcelKey')}</td><td>${safe(data.parcelKey)}</td></tr></table><p class="muted small">${t('nassauHelp')}</p><a class="primary" href="${safe(data.nassauUrl)}" target="_blank" rel="noopener noreferrer">${t('openNassau')} ↗</a></section>`;
    return;
  }
  if (data.candidates) { result.innerHTML = `<section class="card"><h2>${t('chooseLot')}</h2>${data.candidates.map(c => `<p><button data-bbl="${safe(c.bbl)}">${safe(c.label)} · BBL ${safe(c.bbl)}</button></p>`).join('')}</section>`; return; }
  const b = data.building;
  const rows = b ? BUILDING_FIELDS.filter(key => b[key] !== null && b[key] !== undefined && b[key] !== '').map(key => `<tr><td>${safe(I18N[language].labels[key])}</td><td>${safe(b[key])}</td></tr>`).join('') : '';
  const coRows = [...data.newCo.map(x => ({ era: t('coNew'), number: x.c_of_o_number || x.application_number, type: x.c_of_o_filing_type, status: x.c_of_o_status, date: x.c_of_o_issuance_date || x.submitted_date, href: data.dobNowUrl, action: t('openDobNow') })), ...data.oldCo.map(x => ({ era: t('coOld'), number: `${x.job_number || ''}${x.item_number ? ` / ${x.item_number}` : ''}`, type: x.issue_type, status: x.application_status_raw, date: x.c_o_issue_date?.slice(0, 10), href: `https://a810-bisweb.nyc.gov/bisweb/COPdfListingServlet?${new URLSearchParams({ bin: x.bin_number || x.bin || '', borough: data.boro, key: x.job_number || '', requestid: '1' })}`, action: t('openCoPdf') }))];
  const coHtml = coRows.length ? `<div class="co-list">${coRows.map(x => `<article class="record"><p class="small muted">${safe(x.era)}</p><strong>${safe(x.number || t('co'))}</strong><p>${safe([x.type, x.status, x.date].filter(Boolean).join(' · '))}</p><a class="primary" href="${safe(x.href)}" target="_blank" rel="noopener noreferrer">${safe(x.action)} ↗</a></article>`).join('')}</div>` : `<p class="message warning">${t('noCo')}</p>`;
  result.innerHTML = `<section class="card"><h2>${safe(data.address || t('property'))}</h2><p><span class="pill">${safe(data.borough)}</span>　${safe(data.county)} · Block ${data.block} · Lot ${data.lot} · BBL ${safe(data.bbl)}</p><div class="links"><a href="${safe(data.pipUrl)}" target="_blank" rel="noopener noreferrer">${t('pip')} ↗</a><a href="${safe(data.bisUrl)}" target="_blank" rel="noopener noreferrer">${t('dobBuilding')} ↗</a><a href="${safe(data.nopvPageUrl)}" target="_blank" rel="noopener noreferrer">${t('dofProperty')} ↗</a></div></section>
    <div class="grid"><section class="card"><h2>${t('buildingInfo')}</h2>${b ? `<table>${rows}</table>` : `<p class="message warning">${t('buildingUnavailable')}</p>`}<p class="muted small">${t('buildingSource')}</p></section><section class="card"><h2>${t('nopv')}</h2><p class="muted small">${t('nopvHelp', { bbl: safe(data.bbl) })}</p><div class="notice"><p><strong>${t('nopvAnnual')}</strong></p><a class="primary" href="${safe(data.nopvPdfUrl)}" target="_blank" rel="noopener noreferrer">${t('openDofPdf')} ↗</a><p class="muted small">${t('nopvHistory')}</p></div></section></div>
    <section class="card"><h2>${t('co')}</h2><p class="muted small">${t('coHelp', { bbl: safe(data.bbl) })}</p>${coHtml}<div class="links secondary-links"><a href="${safe(data.bisUrl)}" target="_blank" rel="noopener noreferrer">${t('bisProperty')} ↗</a><a href="${safe(data.dobNowUrl)}" target="_blank" rel="noopener noreferrer">${t('dobNowPortal')} ↗</a></div></section><section class="card"><h2>${t('hpd')}</h2><a class="primary" href="${safe(data.hpdSearchUrl)}" target="_blank" rel="noopener noreferrer">${t('openHpd')} ↗</a></section>`;
}
languageToggle.addEventListener('click', () => { language = language === 'en' ? 'zh' : 'en'; localStorage.setItem('nyc-property-language', language); applyLanguage(); });
form.addEventListener('submit', event => { event.preventDefault(); search({ address: input.value }); });
bblForm.addEventListener('submit', event => { event.preventDefault(); search({ bbl: bblInput.value }); });
result.addEventListener('click', event => { const bbl = event.target.closest('[data-bbl]')?.dataset.bbl; if (bbl) search({ bbl }); });
applyLanguage();
const preset = new URLSearchParams(location.search).get('address');
if (preset) { input.value = preset; search({ address: preset }); }
