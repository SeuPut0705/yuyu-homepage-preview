/* 샘플 데이터와 공용 조각. 인물·업체명·수치 상태는 모두 샘플이다. */
const P = {}
window.P = P

P.ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  approval: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 12l3 3 5-6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  chevd: '<path d="M6 9l6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  news: '<path d="M4 5h13v14H6a2 2 0 0 1-2-2z"/><path d="M17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5"/>',
  notice: '<path d="M3 11v3l12 5V6L3 11z"/><path d="M7 15l1 5h3"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-9 9"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3 3 0 0 1 0 6M18 14c2 .8 3 2.7 3 6"/>',
  clip: '<path d="M20 11l-8.5 8.5a5 5 0 0 1-7-7L13 4a3.3 3.3 0 0 1 4.7 4.7L9.2 17.2a1.7 1.7 0 0 1-2.4-2.4L14 7.6"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 13v6H5V6h6"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4-2v-4z"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 8v4l3 2"/>',
  lang: '<path d="M4 5h9M8.5 3v2M6 5c0 4 3 7 6 8M12 5c0 4-3 7-7 8M13 21l4-10 4 10M14.5 18h5"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  tray: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
}
P.ic = (n, s = 16) =>
  `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P.ICONS[n]}</svg>`

P.chip = (k, t) => `<span class="chip c-${k}">${t}</span>`
P.stChip = (st) => (st === 'publish' ? P.chip('ok', '공개') : P.chip('neutral', '초안'))
P.inqLabel = { new: '신규', 'in-progress': '처리 중', closed: '종료' }
P.inqKind = { new: 'info', 'in-progress': 'warn', closed: 'neutral' }
P.inqChip = (st) => P.chip(P.inqKind[st], P.inqLabel[st])

P.LN = { ko: '한국어', en: 'English', zh: '中文' }
P.TRS = { ok: '완료', empty: '비어 있음', stale: '원문 수정 후 미반영' }
P.tr = (tr) =>
  ['ko', 'en', 'zh']
    .map((l) => `<span class="tr ${tr[l]}" title="${P.LN[l]}: ${P.TRS[tr[l]]}">${{ ko: '한', en: '영', zh: '중' }[l]}</span>`)
    .join('')

P.STAFF = ['스풋', '정하윤', '오지후', '한도윤']
P.avatar = (name, s = 28) =>
  `<span class="av" style="width:${s}px;height:${s}px;font-size:${Math.round(s * 0.42)}px">${name ? name.slice(0, 1) : '?'}</span>`

P.NEWS = [
  { id: 'n1', t: '유유헬스케어 NOW and HERE 인포그래픽 영상 (영문)', d: '2023.09.25', cat: '영상', st: 'publish', tr: { ko: 'ok', en: 'ok', zh: 'ok' }, th: 't1', up: '10.21', by: '정하윤' },
  { id: 'n2', t: '유유헬스케어 홍보 영상 (영문)', d: '2023.09.25', cat: '영상', st: 'publish', tr: { ko: 'ok', en: 'ok', zh: 'ok' }, th: 't2', up: '10.21', by: '정하윤' },
  { id: 'n3', t: '[보도자료] 유유헬스케어, 비타푸드 아시아에서 글로벌 홍보 진행', d: '2023.09.25', cat: '보도자료', st: 'publish', tr: { ko: 'ok', en: 'ok', zh: 'ok' }, th: 't3', up: '10.19', by: '오지후' },
  { id: 'n4', t: '유유헬스케어 차:올랑 흑무차 출시', d: '2022.11.30', cat: '제품', st: 'publish', tr: { ko: 'ok', en: 'ok', zh: 'empty' }, th: 't4', up: '10.14', by: '오지후' },
  { id: 'n5', t: '유유헬스케어 차:올랑 생강차 출시', d: '2022.11.30', cat: '제품', st: 'publish', tr: { ko: 'ok', en: 'ok', zh: 'empty' }, th: 't5', up: '10.14', by: '오지후' },
  { id: 'n6', t: '유유헬스케어 차:올랑 비트차 출시', d: '2022.11.30', cat: '제품', st: 'publish', tr: { ko: 'ok', en: 'empty', zh: 'empty' }, th: 't6', up: '10.14', by: '오지후' },
  { id: 'n7', t: '유유헬스케어 창립 15주년 기념 책자 Life Wave Thinking 발간', d: '2022.11.30', cat: '회사소식', st: 'draft', review: true, tr: { ko: 'ok', en: 'empty', zh: 'empty' }, th: 't7', up: '오늘 11:05', by: '스풋' },
  { id: 'n8', t: '유유헬스케어, 2021 창립 15주년 기념식 진행', d: '2022.11.30', cat: '회사소식', st: 'publish', tr: { ko: 'ok', en: 'stale', zh: 'ok' }, th: 't8', up: '어제', by: '정하윤' },
  { id: 'n9', t: '유유헬스케어, 2020 횡성 신축공장 준공식 개최 - 연간 500억 생산 규모 건기식 설비 구축', d: '2022.11.30', cat: '보도자료', st: 'publish', tr: { ko: 'ok', en: 'empty', zh: 'empty' }, th: 't9', up: '10.12', by: '스풋' },
]

P.INQ = [
  { id: 'q1', no: '0031', type: 'ODM·OEM', region: '국내', co: '한결웰니스(샘플)', name: '박서윤(샘플)', mobile: '010-0000-0000', email: 'sample1@example.com', subject: '[국내 ODM·OEM] 한결웰니스(샘플) / 연질 캡슐', msg: '연질 캡슐 제형으로 신제품 2종을 준비하고 있습니다.\n최소 주문 수량과 개발 기간, 대략의 견적 범위를 알고 싶습니다. 처방 구성은 첨부한 문서에 정리했습니다.', interests: ['연질 캡슐'], files: [['제품기획서_샘플.pdf', '2.4 MB'], ['원료명세_샘플.xlsx', '318 KB']], recv: '오늘 09:42', consent: '2026.10.27 09:41', st: 'new', assignee: null },
  { id: 'q2', no: '0030', type: 'ODM·OEM', region: '해외', co: 'Greenfield Nutra (sample)', name: 'J. Park (sample)', mobile: '+1 000-000-0000', email: 'sample2@example.com', subject: '[해외 ODM·OEM] Greenfield Nutra (sample) / 분말·과립', msg: 'We are looking for a Korean manufacturer for stick-pack powder products. Could you share MOQ and lead time?', interests: ['분말', '과립'], files: [], recv: '오늘 07:18', consent: '2026.10.27 07:17', st: 'new', assignee: null },
  { id: 'q3', no: '0029', type: '파트너십', region: '국내', co: '새봄바이오(샘플)', name: '최민재(샘플)', mobile: '010-0000-0001', email: 'sample3@example.com', subject: '[국내 파트너십] 새봄바이오(샘플) / 기능성 원료 공동 개발', msg: '기능성 원료의 공동 개발과 위탁 생산을 함께 논의하고 싶습니다. 미팅 가능한 일정을 알려 주세요.', interests: [], files: [['소개자료_샘플.pdf', '1.1 MB']], recv: '어제 16:30', consent: '2026.10.26 16:29', st: 'new', assignee: null },
  { id: 'q4', no: '0028', type: 'ODM·OEM', region: '국내', co: '누리헬스랩(샘플)', name: '이도현(샘플)', mobile: '010-0000-0002', email: 'sample4@example.com', subject: '[국내 ODM·OEM] 누리헬스랩(샘플) / 정제, 경질 캡슐', msg: '정제와 경질 캡슐 두 가지 제형으로 견적을 받고 싶습니다.', interests: ['정제', '경질 캡슐'], files: [['견적요청서_샘플.pdf', '860 KB']], recv: '10.24 10:12', consent: '2026.10.24 10:11', st: 'in-progress', assignee: '스풋' },
  { id: 'q5', no: '0027', type: 'ODM·OEM', region: '국내', co: '다온푸드(샘플)', name: '강예린(샘플)', mobile: '010-0000-0003', email: 'sample5@example.com', subject: '[국내 ODM·OEM] 다온푸드(샘플) / 과립', msg: '과립 스틱 제품의 소량 생산이 가능한지 궁금합니다.', interests: ['과립'], files: [], recv: '10.22 15:40', consent: '2026.10.22 15:39', st: 'in-progress', assignee: '정하윤' },
  { id: 'q6', no: '0025', type: '파트너십', region: '해외', co: 'Oriental Herb Co. (sample)', name: 'L. Chen (sample)', mobile: '+86 000-0000-0000', email: 'sample6@example.com', subject: '[해외 파트너십] Oriental Herb Co. (sample) / 원료 공급', msg: 'We would like to discuss raw material supply.', interests: [], files: [], recv: '10.15 11:02', consent: '2026.10.15 11:01', st: 'closed', assignee: '오지후' },
]

P.APPROVALS = [
  { t: '전자공고 게시 요청: 제21기 정기주주총회 소집통지서', by: '정하윤', at: '오늘 10:20', kind: '받은 결재' },
  { t: '소식 게시 요청: 창립 15주년 기념 책자 발간 (고객 확인 전)', by: '스풋', at: '오늘 11:05', kind: '기안' },
  { t: '지출 결의서(샘플): 사무용품 구매', by: '오지후', at: '어제 17:48', kind: '받은 결재' },
]

P.n = {
  news: P.NEWS.length,
  newsPublish: P.NEWS.filter((n) => n.st === 'publish').length,
  newsDraft: P.NEWS.filter((n) => n.st === 'draft').length,
  review: P.NEWS.filter((n) => n.review).length,
  trNeed: P.NEWS.filter((n) => n.st === 'publish' && (n.tr.en !== 'ok' || n.tr.zh !== 'ok')).length,
  inqNew: P.INQ.filter((q) => q.st === 'new').length,
  inqProg: P.INQ.filter((q) => q.st === 'in-progress').length,
  inqAll: P.INQ.length,
}

/* 소식 편집 화면의 본문 샘플(공개 화면 post-2 와 같은 글) */
P.POST = {
  title: '유유헬스케어, 2020 횡성 신축공장 준공식 개최 - 연간 500억 생산 규모 건기식 설비 구축',
  date: '2022-11-30',
  body: ['유유헬스케어, 연간 500억 생산 규모 건기식 설비 구축', '강원도 횡성에 타정기 · 하드캡슐 충전기 등 설치', '기사 원문 보기', 'http://www.medisobizanews.com/news/articleView.html?idxno=70326'],
}

/* 공개 화면 미리보기 틀 */
P.preview = (loc, mode) => {
  const url = `yuyuhc.co.kr${{ ko: '', en: '/en', zh: '/zh' }[loc]}/news/…`
  const empty = loc !== 'ko'
  const img = mode === 'mob' ? 'preview-post-mob.png' : 'preview-post-desk.png'
  return `
  <div class="pv">
    <div class="pv-bar">
      <div class="seg seg-sm">
        <button class="${mode !== 'mob' ? 'on' : ''}" data-act="pv:desk">${P.ic('monitor', 14)}데스크톱</button>
        <button class="${mode === 'mob' ? 'on' : ''}" data-act="pv:mob">${P.ic('phone', 14)}모바일</button>
      </div>
      <div class="pv-url">${P.ic('lock', 12)}${url}</div>
      <button class="btn btn-ghost btn-icon" title="새 창으로 열기">${P.ic('ext', 15)}</button>
    </div>
    <div class="pv-stage ${mode === 'mob' ? 'is-mob' : ''}">
      <div class="pv-frame">
        <img src="assets/${img}" alt="공개 화면 미리보기(샘플 캡처)">
        ${empty ? `<div class="pv-empty"><div>${P.ic('eye', 20)}<b>${P.LN[loc]} 제목이 없어 이 언어 화면에는 나오지 않습니다</b><span>한국어로 대신 보여 주지 않습니다. 제목을 입력하면 이 자리에 ${P.LN[loc]} 화면이 열립니다.</span></div></div>` : ''}
      </div>
    </div>
    <div class="pv-foot">${P.ic('clock', 13)}저장하지 않은 변경도 바로 반영됩니다 · 미리보기 화면은 공개 화면 캡처(샘플)</div>
  </div>`
}

/* 소식 편집 폼 필드(세 변형이 같은 필드를 쓴다. Payload 필드 구성 그대로) */
P.editFields = (loc, opt = {}) => {
  const k = loc === 'ko'
  const ph = { en: 'English title', zh: '中文标题' }[loc]
  return `
  ${
    k
      ? ''
      : `<div class="callout c-warn">${P.ic('alert', 16)}<div><b>${P.LN[loc]} 내용이 비어 있습니다.</b> 제목이 있는 언어에서만 해당 화면에 공개됩니다. <button class="link" data-act="noop">한국어 내용 복사해서 시작</button></div></div>`
  }
  <div class="fld"><label>제목 <i class="req">필수</i><span class="loc-tag">${P.ic('lang', 12)}${P.LN[loc]}</span></label>
    <input class="input" value="${k ? P.POST.title : ''}" placeholder="${k ? '' : ph}" ${k ? '' : 'aria-label="제목"'}></div>
  <div class="fld-row">
    <div class="fld"><label>게시일 <i class="req">필수</i></label><input class="input" value="${P.POST.date}"></div>
    <div class="fld"><label>분류</label><div class="input sel">보도자료${P.ic('chevd', 14)}</div></div>
  </div>
  <div class="fld"><label>대표 이미지</label>
    <div class="upl"><img src="assets/t9.png" alt=""><div><b>횡성-준공식.jpg</b><span>1200×800 · 대체 텍스트 입력됨</span></div><button class="btn btn-sm">바꾸기</button></div></div>
  <div class="fld"><label>본문<span class="loc-tag">${P.ic('lang', 12)}${P.LN[loc]}</span></label>
    <div class="rte">
      <div class="rte-bar"><b>B</b><i>I</i><u>U</u><span class="sep"></span><span>H2</span><span>H3</span><span class="sep"></span>${P.ic('chev', 14)}<span>목록</span><span>링크</span><span>이미지</span></div>
      <div class="rte-body">${k ? P.POST.body.map((p, i) => (i === 3 ? `<p><a>${p}</a></p>` : `<p>${p}</p>`)).join('') : `<p class="ph">${loc === 'en' ? 'Write the English body here.' : '请在此输入中文正文。'}</p>`}</div>
    </div></div>
  ${opt.compact ? '' : `<div class="fld-row"><div class="fld"><label>영상 주소</label><input class="input" placeholder="영상 소식이면 유튜브 주소"></div><div class="fld"><label>원문 주소</label><input class="input" value="http://www.medisobizanews.com/…" readonly></div></div>`}
  `
}

/* 업무 대시보드의 공용 조각 */
P.approvalRows = () =>
  P.APPROVALS.map(
    (a) => `<li class="li"><span class="dotk ${a.kind === '기안' ? 'neu' : 'brand'}"></span><div class="grow"><b>${a.t}</b><span class="sub">${a.by} · ${a.at} · ${a.kind}</span></div>${P.ic('chev', 14)}</li>`,
  ).join('')

P.msgRows = () =>
  [
    ['# 홈페이지-운영', '정하윤', '번역 점검표 올렸어요. 영문 제목부터 봐 주세요.', '3'],
    ['# 생산-공지', '오지후', '내일 10시 라인 점검 일정 공유드립니다.', '1'],
    ['한도윤', '', '생산문의 0029 건 회신 초안 확인 부탁드립니다.', '1'],
  ]
    .map(([c, w, m, n]) => `<li class="li"><span class="av av-sq">${c.startsWith('#') ? '#' : c.slice(0, 1)}</span><div class="grow"><b>${c.replace('# ', '')}</b><span class="sub ell">${w ? w + ': ' : ''}${m}</span></div><span class="badge">${n}</span></li>`)
    .join('')

P.docRows = () =>
  [
    ['홈페이지 번역 점검표(샘플).xlsx', '정하윤 · 오늘 09:30'],
    ['생산문의 응대 절차(샘플).docx', '오지후 · 어제'],
    ['10월 주간 보고(샘플).pdf', '한도윤 · 10.23'],
  ]
    .map(([t, m]) => `<li class="li"><span class="fileic">${P.ic('file', 16)}</span><div class="grow"><b>${t}</b><span class="sub">${m}</span></div></li>`)
    .join('')

/* 빈 화면(시안 범위 밖) */
P.stub = (name) => `
  <div class="stub">${P.ic('layers', 22)}<b>${name}</b><p>이 화면은 시안에서 만들지 않았습니다.<br>소식 목록·편집과 같은 패턴(목록 → 편집, 한/영/중 전환)을 그대로 씁니다.</p></div>`
