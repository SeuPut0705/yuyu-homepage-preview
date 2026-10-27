/* ═════════ 변형 D. C 겉모습 + B 뼈대 ═════════
   Payload로 되는 것만: 교체한 Nav·header(레일 + 섹션 탭), 대시보드 뷰, 기본 목록 표, 기본 편집 뷰(+라이브 미리보기), 기본 사이드 필드. */
P.D = {}
{
  const { ic, chip, stChip, inqChip, tr, avatar, NEWS, INQ, n } = P
  Object.assign(P.ICONS, {
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
    retry: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
  })

  const dark = () => !!P.state.dark
  const H = (r) => `#D/${r}`

  const TABS = [
    ['site', '할 일', n.inqNew + n.review + n.trNeed, 'warn'],
    ['news', '소식'],
    ['stub:전자공고', '전자공고'],
    ['stub:페이지', '페이지'],
    ['stub:제품', '제품'],
    ['inq', '생산문의', n.inqNew, 'hot'],
    ['stub:미디어', '미디어'],
    ['stub:설정', '설정'],
  ]
  const RAIL = [
    ['dash', 'home', '홈'],
    ['stub:메신저', 'chat', '메신저', 4],
    ['stub:문서', 'doc', '문서'],
    ['stub:결재', 'approval', '결재', 2],
    ['site', 'globe', '홈페이지'],
  ]
  const SITE_SCREENS = ['site', 'news', 'edit', 'inq', 'empty', 'skeleton', 'fail']
  const SITE_STUBS = ['전자공고', '페이지', '제품', '미디어', '설정']
  const isSite = (s) => SITE_SCREENS.includes(s) || SITE_STUBS.some((x) => s === 'stub:' + x)
  const tabOn = (r, s) => r === s || (r === 'news' && s === 'edit') || (r === 'site' && ['empty', 'skeleton', 'fail'].includes(s))

  /* 설명 말풍선: 메인 화면에는 넣지 않고 ⓘ 안에만 */
  const EFF = ['', '바로 됨', '손이 좀 감', '많이 감']
  const tip = (title, rows) => `
  <span class="d-tip ${P.state.tip ? 'open' : ''}">
    <button class="d-tipbtn" data-act="tip" aria-label="Payload 기본 구조 설명">${ic('info', 16)}Payload 기본 구조</button>
    <div class="d-tipbox" role="note"><h4>${title}</h4>${rows
      .map(([t, e, d]) => `<div class="d-tr"><div class="d-trh"><b>${t}</b><span class="d-eff e${e}">${EFF[e]}</span></div><p>${d}</p></div>`)
      .join('')}</div>
  </span>`

  const rail = (s) => `
  <nav class="d-rail" aria-label="앱 전환">
    <a class="lg" href="${H('dash')}" aria-label="홈"><img src="assets/symbol.svg" alt=""></a>
    ${RAIL.map(([r, i, l, b]) => `<a class="${(r === 'site' ? isSite(s) : r === s) ? 'on' : ''}" href="${H(r)}">${ic(i, 20)}<span>${l}</span>${b ? `<i class="bd">${b}</i>` : ''}</a>`).join('')}
    <span class="sp"></span>
    <a href="${H('stub:설정')}">${ic('gear', 20)}<span>설정</span></a>
    ${avatar('스', 32)}
  </nav>`
  const btabs = (s) => `
  <nav class="d-btabs" aria-label="앱 전환">
    ${RAIL.map(([r, i, l, b]) => `<a class="${(r === 'site' ? isSite(s) : r === s) ? 'on' : ''}" href="${H(r)}">${ic(i, 20)}<span>${l}</span>${b ? `<i class="bd">${b}</i>` : ''}</a>`).join('')}
  </nav>`

  /* ⌘K 팔레트 */
  const hi = (t, q) => (q ? t.replace(q, `<mark>${q}</mark>`) : t)
  const palette = () => {
    const q = P.state.palq
    const act = (icon, t, sub, k, on) => `<a class="d-pi ${on ? 'on' : ''}" href="${H(icon.r)}"><span class="pi">${ic(icon.i, 16)}</span><div class="grow"><b>${t}</b><span>${sub}</span></div>${k ? `<span class="k">${k}</span>` : ''}</a>`
    const keys = (a) => a.map((x) => `<kbd>${x}</kbd>`).join('')
    const body = q
      ? `<div class="d-pg"><h5>콘텐츠 · 소식</h5>
          ${act({ r: 'edit', i: 'news' }, hi('유유헬스케어, 2020 횡성 신축공장 준공식 개최 - 연간 500억 생산 규모 건기식 설비 구축', q), '소식 · 공개 · 보도자료 · 2022.11.30', keys(['↵']), true)}
        </div>
        <div class="d-pg"><h5>그 밖의 범위</h5>
          ${act({ r: 'inq', i: 'mail' }, `생산문의에서 “${q}” 검색`, '0건 · 회사명·이름·내용', '', false)}
          ${act({ r: 'news', i: 'search' }, `소식 전체에서 “${q}” 검색`, '제목·본문 · 한국어', keys(['⌘', '↵']), false)}
        </div>`
      : `<div class="d-pg"><h5>빠른 작업</h5>
          ${act({ r: 'edit', i: 'plus' }, '새 소식 쓰기', '홈페이지 관리 · 소식', keys(['N']), true)}
          ${act({ r: 'inq', i: 'mail' }, '문의 열기', `새 생산문의 ${n.inqNew}건 · 담당 미지정`, keys(['G']) + keys(['I']), false)}
          ${act({ r: 'news', i: 'lang' }, '번역 필요 보기', `소식 ${n.trNeed}건 · 영·중 비어 있음`, keys(['G']) + keys(['T']), false)}
        </div>
        <div class="d-pg"><h5>최근 본 항목</h5>
          ${act({ r: 'edit', i: 'edit' }, '유유헬스케어, 2020 횡성 신축공장 준공식 개최 …', '소식 · 오늘 09:12', '', false)}
          ${act({ r: 'inq', i: 'mail' }, '한결웰니스(샘플) · ODM·OEM', '생산문의 No.0031', '', false)}
        </div>`
    return `
  <div class="d-pal-scrim" data-act="pal">
    <div class="d-pal" data-stop role="dialog" aria-label="검색과 빠른 작업">
      <div class="d-pal-in">${ic('search', 20)}<span class="typed ${q ? '' : 'ph'}">${q || '소식·문의·페이지 제목, 회사명 검색'}<i></i></span><kbd>esc</kbd></div>
      <div class="d-pal-sc"><span class="on">전체</span><span>콘텐츠</span><span>문의</span><span>작업</span></div>
      ${body}
      <div class="d-pal-f"><span><kbd>↑</kbd><kbd>↓</kbd>이동</span><span><kbd>↵</kbd>열기</span><span><kbd>esc</kbd>닫기</span><span class="r">어디서나 <kbd>⌘</kbd><kbd>K</kbd> 또는 <kbd>/</kbd></span></div>
    </div>
  </div>`
  }

  const where = (parts) => parts.map((p, i) => (i === parts.length - 1 ? `<b>${p}</b>` : `<span class="m">${p}</span><span class="m sl">/</span>`)).join('')

  const shell = (s, parts, body, o = {}) => `
  <div class="d-shell">
    ${rail(s)}
    <div class="d-main">
      <header class="d-top">
        <div class="d-where">${where(parts)}</div>
        <button class="d-search" data-act="pal">${ic('search', 16)}<span>콘텐츠·문의 검색, 빠른 작업</span><kbd>⌘K</kbd></button>
        <button class="d-icon" data-act="theme" aria-label="${dark() ? '라이트 모드로' : '다크 모드로'}">${ic(dark() ? 'sun' : 'moon', 18)}</button>
        <button class="d-icon hide-m" aria-label="알림">${ic('bell', 18)}</button>
        <span class="hide-m">${avatar('스풋', 32)}</span>
      </header>
      ${
        o.noTabs
          ? ''
          : `<nav class="d-tabs" aria-label="홈페이지 관리 섹션"><div class="lab">${ic('globe', 18)}홈페이지 관리</div>${TABS.map(([r, l, b, k]) => `<a class="t ${tabOn(r, s) ? 'on' : ''}" href="${H(r)}">${l}${b ? `<span class="d-n ${k}">${b}</span>` : ''}</a>`).join('')}</nav>`
      }
      ${o.full ? `<div class="d-body">${body}</div>` : `<div class="d-scroll"><div class="d-page">${body}</div></div>`}
    </div>
    ${btabs(s)}
    ${P.state.pal ? palette() : ''}
  </div>`

  /* ───── 공용 조각 ───── */
  const icon = (i, k = '') => `<span class="d-lead ${k}">${ic(i, 20)}</span>`
  const th = (id) => `<img class="d-th" src="assets/${id}.png" alt="">`
  const item = ({ lead, title, meta, acts }) => `<div class="d-item">${lead}<div class="d-it"><b>${title}</b><div class="d-meta">${meta}</div></div><div class="d-acts">${acts}</div></div>`
  const newNote = '<span class="d-new">새 필드</span>'

  const inqItems = (list) =>
    list
      .map((q) =>
        item({
          lead: icon('mail', 'info'),
          title: q.co,
          meta: `<span>${q.type} · ${q.region}</span><span>${q.interests.join(', ') || '제형 미선택'}</span><span>${q.recv}</span>${chip('neutral', '담당 미지정')}`,
          acts: `<a class="d-btn soft" href="${H('inq')}">열기</a><button class="d-btn" data-act="noop">담당 지정${newNote}</button>`,
        }),
      )
      .join('')

  const missing = (r) => [['en', '영문'], ['zh', '중문']].filter(([l]) => r.tr[l] !== 'ok').map(([l, t], i) => ({ l, t, stale: r.tr[l] === 'stale', first: i === 0 }))
  const trItems = (list) =>
    list
      .map((r) => {
        const m = missing(r)
        const txt = m.map((x) => `${x.l === 'en' ? '영' : '중'} ${x.stale ? '원문 수정 후 미반영' : '비어 있음'}`).join(' · ')
        return item({
          lead: th(r.th),
          title: r.t,
          meta: `<span>${tr(r.tr)}</span><span>${txt}</span>`,
          acts: m.map((x, i) => `<a class="d-btn ${i === 0 ? 'soft' : ''}" href="${H('edit')}" data-act="loc:${x.l}">${x.t} ${x.stale ? '갱신' : '추가'}</a>`).join(''),
        })
      })
      .join('')

  const trList = () => NEWS.filter((r) => r.st === 'publish' && (r.tr.en !== 'ok' || r.tr.zh !== 'ok'))

  const secHead = (rank, title, count, hint, more) => `
    <div class="d-sh"><span class="d-rank ${count === 0 ? 'r0' : 'r' + rank}">${rank}</span><h2>${title}</h2>${count != null ? `<span class="d-n">${count}</span>` : ''}<span class="d-hint">${hint}</span>${more && count !== 0 ? `<a class="d-more" href="${more[0]}">${more[1]}</a>` : ''}</div>`

  const hintsBox = () => `
    <section class="d-aside"><h3>키보드</h3><ul class="d-keys">
      <li><span>검색·빠른 작업</span><span><kbd>⌘</kbd><kbd>K</kbd></span></li>
      <li><span>항목 이동 / 열기</span><span><kbd>J</kbd><kbd>K</kbd><kbd>↵</kbd></span></li>
      <li><span>새 소식</span><span><kbd>N</kbd></span></li>
      <li><span>문의 · 번역 필요로</span><span><kbd>G</kbd><kbd>I</kbd> <kbd>G</kbd><kbd>T</kbd></span></li>
    </ul></section>`

  const recent = (skel) => `
    <section class="d-aside"><h3>최근 수정</h3>${
      skel
        ? [0, 1, 2, 3].map(() => `<div class="d-li"><span class="sk" style="width:8px;height:8px;border-radius:50%"></span><div class="grow"><div class="sk" style="height:16px;width:86%;margin-bottom:8px"></div><div class="sk" style="height:12px;width:52%"></div></div></div>`).join('')
        : `<ul class="d-rec">${[NEWS[6], NEWS[7], NEWS[0], NEWS[2]]
            .map((r) => `<li><a class="d-li" href="${H('edit')}"><span class="d-sd ${r.st === 'draft' ? 'draft' : ''}" title="${r.st === 'draft' ? '초안' : '공개'}"></span><div class="grow"><b class="ell">${r.t}</b><span class="d-m">소식 · ${r.by} · ${r.up}</span></div></a></li>`)
            .join('')}</ul>`
    }</section>`

  /* ① 업무 대시보드 */
  const dash = () =>
    shell(
      'dash',
      ['홈'],
      `
    <div class="d-ph"><div><h1 class="d-h1">안녕하세요, 스풋님</h1><p class="d-sub">2026년 10월 27일 화요일 · 오늘 할 일 6건, 여유 있을 때 1묶음</p></div></div>
    <div class="d-pills"><a class="on">전체 <span>6</span></a><a>결재 <span>2</span></a><a>홈페이지 <span>4</span></a></div>
    <div class="d-cols">
      <div class="d-panel">
        <section class="d-sec">
          ${secHead(1, '먼저 처리', 5, '결재와 새 문의는 기다리는 사람이 있습니다')}
          ${item({ lead: icon('approval'), title: P.APPROVALS[0].t, meta: `<span>${chip('neutral', '결재')}</span><span>${P.APPROVALS[0].by}</span><span>${P.APPROVALS[0].at}</span>`, acts: `<a class="d-btn soft" href="${H('stub:결재')}">검토</a>` })}
          ${item({ lead: icon('approval'), title: P.APPROVALS[2].t, meta: `<span>${chip('neutral', '결재')}</span><span>${P.APPROVALS[2].by}</span><span>${P.APPROVALS[2].at}</span>`, acts: `<a class="d-btn soft" href="${H('stub:결재')}">검토</a>` })}
          ${inqItems(INQ.filter((q) => q.st === 'new'))}
        </section>
        <section class="d-sec">
          ${secHead(2, '여유 있을 때', 2, '공개 일정이 정해지면 처리해도 됩니다')}
          ${item({ lead: th('t7'), title: NEWS[6].t, meta: `<span>${chip('neutral', '홈페이지')}</span><span>${chip('warn', '고객 확인 전')}</span><span>초안 · 스풋 · 오늘 11:05</span>`, acts: `<a class="d-btn soft" href="${H('edit')}">미리보기</a>` })}
          ${item({ lead: icon('lang', 'warn'), title: `번역이 필요한 소식 ${n.trNeed}건`, meta: `<span>${chip('neutral', '홈페이지')}</span><span>영 3건 · 중 4건 비어 있음</span>`, acts: `<a class="d-btn soft" href="${H('site')}">할 일에서 보기</a>` })}
        </section>
      </div>
      <div>
        <section class="d-aside"><h3>메신저</h3><ul class="d-rec">
          ${[['#', '홈페이지-운영', '정하윤: 번역 점검표 올렸어요. 영문 제목부터 봐 주세요.', 3], ['#', '생산-공지', '오지후: 내일 10시 라인 점검 일정 공유드립니다.', 1], ['한', '한도윤', '생산문의 0029 건 회신 초안 확인 부탁드립니다.', 1]]
            .map(([a, t, m, c]) => `<li><a class="d-li" href="${H('stub:메신저')}"><span class="d-sq">${a}</span><div class="grow"><b class="ell">${t}</b><span class="d-m ell">${m}</span></div><span class="d-bd">${c}</span></a></li>`)
            .join('')}</ul></section>
        <section class="d-aside"><h3>최근 문서</h3><ul class="d-rec">
          ${[['홈페이지 번역 점검표(샘플).xlsx', '정하윤 · 오늘 09:30'], ['생산문의 응대 절차(샘플).docx', '오지후 · 어제'], ['10월 주간 보고(샘플).pdf', '한도윤 · 10.23']]
            .map(([t, m]) => `<li><a class="d-li" href="${H('stub:문서')}"><span class="d-sq">${ic('file', 16)}</span><div class="grow"><b class="ell">${t}</b><span class="d-m">${m}</span></div></a></li>`)
            .join('')}</ul></section>
      </div>
    </div>`,
      { noTabs: true },
    )

  /* ② 홈페이지 관리 첫 화면: 오늘 할 일 */
  const site = (o = {}) => {
    const emptyInq = o.empty
    const trl = o.empty ? [] : trList()
    const total = (o.empty ? 0 : n.inqNew) + n.review + trl.length
    const strip = o.skeleton
      ? `<div class="d-strip"><span class="sk" style="width:8px;height:8px;border-radius:50%"></span><span class="sk" style="height:16px;width:320px;max-width:60%"></span><span class="grow"></span><span class="sk" style="height:32px;width:88px"></span></div>`
      : o.fail
        ? `<div class="d-strip fail" role="alert"><span class="d-dot bad"></span><div class="grow"><b>공개 화면 반영 실패 1건</b><span class="d-m"> · 소식 「차:올랑 흑무차 출시」 오늘 10:41 저장 · 저장된 내용은 그대로 있고, 11:00에 자동으로 다시 시도합니다</span></div><button class="d-btn">${ic('retry', 16)}지금 재시도</button></div>`
        : `<div class="d-strip"><span class="d-dot"></span><div class="grow"><b>공개 화면 정상 반영 중</b><span class="d-m"> · 마지막 반영 오늘 09:12 · 소식 「차:올랑 흑무차 출시」 수정</span></div><a class="d-btn ghost" href="${H('news')}">반영 기록</a></div>`
    return shell(
      emptyInq ? 'empty' : o.skeleton ? 'skeleton' : o.fail ? 'fail' : 'site',
      ['홈페이지 관리', '할 일'],
      `
    <div class="d-ph"><div><h1 class="d-h1">오늘 할 일 ${total}가지</h1><p class="d-sub">우선순위 순입니다 · 2026년 10월 27일 화요일</p></div>
      <div class="d-acts"><a class="d-btn lg" href="${H('news')}">공개 화면 열기${ic('ext', 16)}</a><a class="d-btn pri lg" href="${H('edit')}">${ic('plus', 16)}새 소식 <kbd class="inv">N</kbd></a></div></div>
    ${strip}
    <div class="d-cols">
      <div class="d-panel">
        <section class="d-sec">
          ${secHead(1, '새 생산문의', emptyInq ? 0 : n.inqNew, emptyInq ? '' : '담당자가 정해지지 않았습니다', [H('inq'), '문의 전체'])}
          ${emptyInq ? `<div class="d-empty"><span class="ok">${ic('check', 20)}</span><div><b>새 문의를 모두 처리했습니다</b><p>새 문의가 들어오면 이 자리에 먼저 나옵니다.</p></div><a class="d-btn" href="${H('inq')}">종료한 문의 보기</a></div>` : inqItems(INQ.filter((q) => q.st === 'new'))}
        </section>
        <section class="d-sec">
          ${secHead(2, '고객 확인 전 초안', n.review, '확인이 끝나기 전까지 공개하지 않습니다', [H('news'), '초안 전체'])}
          ${item({ lead: th('t7'), title: NEWS[6].t, meta: `<span>초안 · 스풋 · 오늘 11:05</span><span>확인 메모: 고객사 문구 확인 대기(샘플)</span>`, acts: `<a class="d-btn soft" href="${H('edit')}">미리보기</a><button class="d-btn" data-act="copy">${P.state.copied ? ic('check', 16) + '복사됨' : ic('copy', 16) + '고객 확인 요청 문구 복사'}</button>` })}
        </section>
        <section class="d-sec">
          ${secHead(3, '번역이 필요한 소식', trl.length, trl.length ? '제목이 없는 언어에서는 해당 화면에 나오지 않습니다' : '', [H('news'), '번역 필요 5건'])}
          ${trl.length ? trItems(trl.slice(0, 3)) + `<a class="d-moreRow" href="${H('news')}">나머지 ${trl.length - 3}건 보기</a>` : `<div class="d-empty"><span class="ok">${ic('check', 20)}</span><div><b>번역이 필요한 소식이 없습니다</b><p>공개 중인 소식은 한·영·중 제목이 모두 있습니다.</p></div><a class="d-btn" href="${H('news')}">소식 목록</a></div>`}
        </section>
      </div>
      <div>
        ${recent(o.skeleton)}
        ${hintsBox()}
      </div>
    </div>`,
    )
  }

  /* ③ 소식 목록: Payload 기본 목록 + 커스텀 셀 */
  const listTip = () =>
    tip('C의 카드 줄과 다른 점', [
      ['표 형태 목록', 1, 'Payload 기본 목록 뷰 그대로입니다. C의 카드 줄은 목록 뷰를 통째로 교체해야 해서 표로 두었습니다.'],
      ['상태·번역 칩', 2, '셀 컴포넌트 2개(상태, 번역)를 만듭니다. 번역 상태는 언어별 제목 유무에서 계산합니다.'],
      ['위쪽 보기 칩(전체·번역 필요…)', 2, '목록 표 앞에 넣는 커스텀 컴포넌트가 필요하고, 칩은 목록 주소의 where 조건으로 이어집니다. “번역 필요”는 계산 필드가 있어야 걸러집니다.'],
      ['검색·필터·열·정렬', 1, '기본 기능입니다.'],
    ])

  const news = () =>
    shell(
      'news',
      ['홈페이지 관리', '소식'],
      `
    <div class="d-ph"><div><h1 class="d-h2">소식</h1><p class="d-sub">공개 화면의 홍보센터 소식입니다 · 제목이 있는 언어에서만 해당 화면에 나옵니다</p></div>
      <div class="d-acts">${listTip()}<a class="d-btn pri lg" href="${H('edit')}">${ic('plus', 16)}새로 만들기</a></div></div>
    <div class="d-pills"><a class="on">전체 <span>${n.news}</span></a><a>공개 <span>${n.newsPublish}</span></a><a>초안 <span>${n.newsDraft}</span></a><a>번역 필요 <span>${n.trNeed}</span></a><a>고객 확인 전 <span>${n.review}</span></a></div>
    <div class="d-ctl"><label class="d-find">${ic('search', 16)}<input class="d-in" placeholder="제목 검색" aria-label="제목 검색"></label><button class="d-btn lg">${ic('filter', 16)}필터</button><button class="d-btn lg">열</button><button class="d-btn lg">정렬: 게시일 ↓</button></div>
    <div class="d-panel"><div class="d-tblw"><table class="d-tbl"><thead><tr><th class="c"><input type="checkbox" aria-label="전체 선택"></th><th class="c">이미지</th><th>제목</th><th>게시일</th><th>상태</th><th>번역</th><th>최종 수정</th></tr></thead><tbody>
      ${NEWS.map(
        (r) => `<tr><td class="c"><input type="checkbox" aria-label="선택"></td><td class="c">${th(r.th)}</td>
        <td><a class="d-ttl" href="${H('edit')}">${r.t}</a><div class="d-m">${r.cat}</div></td>
        <td class="nw d-m">${r.d}</td><td class="nw">${stChip(r.st)}${r.review ? ' ' + chip('warn', '고객 확인 전') : ''}</td><td class="nw">${tr(r.tr)}</td><td class="nw d-m">${r.by} · ${r.up}</td></tr>`,
      ).join('')}
    </tbody></table></div>
    <div class="d-tf"><span>${n.news}건 중 1–${n.news}</span><span class="d-m">페이지당 10</span></div></div>`,
    )

  /* ④ 소식 편집: 기본 편집 뷰 + 라이브 미리보기 */
  const editTip = () =>
    tip('C의 한 열 편집과 다른 점', [
      ['라이브 미리보기 탭', 1, '`admin.livePreview` 기본 기능입니다. 폼은 왼쪽, 미리보기는 오른쪽으로 갈라집니다.'],
      ['언어 전환', 1, '헤더의 언어 선택이 기본 기능입니다. C의 ko/en/zh 분할 버튼은 쓰지 않았습니다.'],
      ['고정 헤더 + 게시 버튼', 1, '기본 편집 뷰의 헤더입니다. 색·간격만 바꿉니다.'],
      ['공개 전 확인 줄', 2, '`ui` 필드 컴포넌트로 만듭니다. 하단 고정은 CSS입니다.'],
      ['빈 언어 안내 화면', 2, '공개 앱에 미리보기용 안내 화면이 필요합니다. 지금은 번역이 없으면 404입니다.'],
      ['큰 제목 입력(C)', 3, '제목 필드 컴포넌트를 바꿔야 해서 기본 입력으로 돌렸습니다.'],
    ])

  const edit = () => {
    const loc = P.state.loc
    const k = loc === 'ko'
    const pvMode = P.state.pv
    const ph = { en: 'English title', zh: '中文标题' }[loc]
    const pv = `
    <div class="d-pv">
      <div class="d-pvbar"><div class="d-seg"><button class="${pvMode !== 'mob' ? 'on' : ''}" data-act="pv:desk">${ic('monitor', 16)}데스크톱</button><button class="${pvMode === 'mob' ? 'on' : ''}" data-act="pv:mob">${ic('phone', 16)}모바일</button></div>
        <div class="d-url">${ic('lock', 12)}yuyuhc.co.kr${{ ko: '', en: '/en', zh: '/zh' }[loc]}/news/…</div><a class="d-icon sm" href="${H('news')}" aria-label="새 창으로 열기">${ic('ext', 16)}</a></div>
      <div class="d-pvstage ${pvMode === 'mob' ? 'mob' : ''}"><div class="d-pvframe"><img src="assets/${pvMode === 'mob' ? 'preview-post-mob.png' : 'preview-post-desk.png'}" alt="공개 화면 미리보기(샘플 캡처)">
        ${k ? '' : `<div class="d-pvempty"><div>${ic('eye', 24)}<b>${P.LN[loc]} 제목이 없어 이 언어 화면에는 나오지 않습니다</b><span>한국어로 대신 보여 주지 않습니다. 제목을 입력하면 ${P.LN[loc]} 화면이 열립니다.</span></div></div>`}</div></div>
      <div class="d-pvfoot">${ic('clock', 14)}저장하지 않은 변경도 바로 반영됩니다 · 공개 화면 캡처(샘플)</div>
    </div>`
    return shell(
      'edit',
      ['홈페이지 관리', '소식', '편집'],
      `
    <div class="d-doc">
      <div class="d-dochd">
        <div class="d-dh">
          <a class="d-icon" href="${H('news')}" aria-label="목록으로">${ic('back', 18)}</a>
          <div class="grow"><h1 class="d-h2 ell2">${P.POST.title}</h1><div class="d-sub">${stChip('publish')} <span>마지막 수정 10.12 · 스풋</span></div></div>
          <div class="d-dh-acts">${editTip()}<select class="d-select" data-loc aria-label="언어">${['ko', 'en', 'zh'].map((l) => `<option value="${l}" ${l === loc ? 'selected' : ''}>${P.LN[l]}${l === 'ko' ? ' · 입력됨' : ' · 비어 있음'}</option>`).join('')}</select><button class="d-btn lg">초안 저장</button><button class="d-btn pri lg">변경 사항 게시</button></div>
        </div>
        <div class="d-dtabs"><a>편집</a><a class="on">라이브 미리보기</a><a>버전</a><a>API</a></div>
      </div>
      <div class="d-split">
        <div class="d-fcol">
          <div class="d-form">
            ${k ? '' : `<div class="d-note warn">${ic('alert', 18)}<div><b>${P.LN[loc]} 내용이 비어 있습니다.</b> 제목이 있는 언어에서만 해당 화면에 공개됩니다. <button class="d-link" data-act="noop">한국어 내용 복사해서 시작</button></div></div>`}
            <div class="d-f"><label>제목 <i class="req">필수</i><span class="lt">${ic('lang', 14)}${P.LN[loc]}</span></label><input class="d-in" value="${k ? P.POST.title : ''}" placeholder="${k ? '' : ph}"></div>
            <div class="d-fr"><div class="d-f"><label>게시일 <i class="req">필수</i></label><input class="d-in" value="${P.POST.date}"></div><div class="d-f"><label>분류</label><div class="d-in sel">보도자료${ic('chevd', 16)}</div></div></div>
            <div class="d-f"><label>대표 이미지</label><div class="d-upl"><img src="assets/t9.png" alt=""><div class="grow"><b>횡성-준공식.jpg</b><span>1200×800 · 대체 텍스트 입력됨</span></div><button class="d-btn">바꾸기</button></div></div>
            <div class="d-f"><label>본문<span class="lt">${ic('lang', 14)}${P.LN[loc]}</span></label>
              <div class="d-rte"><div class="d-rtebar"><b>B</b><i>I</i><u>U</u><span class="sep"></span><span>H2</span><span>H3</span><span class="sep"></span><span>목록</span><span>링크</span><span>이미지</span></div>
              <div class="d-rtebody">${k ? P.POST.body.map((p, i) => (i === 3 ? `<p><a>${p}</a></p>` : `<p>${p}</p>`)).join('') : `<p class="ph">${loc === 'en' ? 'Write the English body here.' : '请在此输入中文正文。'}</p>`}</div></div></div>
            <div class="d-f"><label>영상 주소</label><input class="d-in" placeholder="영상 소식이면 유튜브 주소"></div>
            <div class="d-f"><label>확인 메모 <span class="lt">편집자에게만 보임</span></label><textarea class="d-in ta" rows="2" placeholder="확인이 끝나기 전까지 공개하지 않는 이유"></textarea></div>
          </div>
          <div class="d-checks"><b>공개 전 확인</b><span class="ok">${ic('check', 16)}한국어</span><span class="no">${ic('alert', 16)}영어 없음</span><span class="no">${ic('alert', 16)}중국어 없음</span><span class="ok">${ic('check', 16)}이미지 설명</span></div>
        </div>
        ${pv}
      </div>
    </div>`,
      { full: true },
    )
  }

  /* ⑤ 생산문의: 표준 편집 뷰 + 사이드 필드 */
  const inqTip = () =>
    tip('C의 3단 접수함과 다른 점', [
      ['표준 편집 뷰', 1, '문의 한 건을 여는 기본 편집 뷰입니다. C의 3단 접수함(목록·상세·속성)은 목록 뷰와 편집 뷰를 한 화면으로 합쳐야 해서 많이 듭니다.'],
      ['오른쪽 사이드 필드', 1, '`admin.position: "sidebar"` 기본 기능입니다. 상태·동의 시각·접수를 둡니다.'],
      ['상태: 한 단계씩만', 1, '이미 있는 저장 전 훅이 지킵니다. 선택 상자에는 다음 단계만 나오게 하면 됩니다.'],
      ['담당자·내부 메모', 2, '새 필드입니다. 컬렉션 변경, 마이그레이션, 업무 시스템 사용자 연결이 필요합니다.'],
      ['첨부 비공개', 1, '지금 있는 비공개 첨부 컬렉션 그대로입니다.'],
    ])

  const inq = () => {
    const q = INQ[0]
    const file = ([f, s]) => `<li class="d-file"><span class="fi">${ic('file', 18)}</span><div class="grow"><b>${f}</b><span>${s}</span></div><button class="d-btn">${ic('download', 16)}받기</button></li>`
    return shell(
      'inq',
      ['홈페이지 관리', '생산문의', `No.${q.no}`],
      `
    <div class="d-doc">
      <div class="d-dochd">
        <div class="d-dh">
          <a class="d-icon" href="${H('inq')}" aria-label="목록으로">${ic('back', 18)}</a>
          <div class="grow"><h1 class="d-h2 ell2">${q.subject}</h1><div class="d-sub">${inqChip(q.st)} <span>${q.region} · ${q.type} · No.${q.no} · ${q.recv} 접수</span></div></div>
          <div class="d-dh-acts">${inqTip()}<button class="d-btn pri lg">저장</button></div>
        </div>
        <div class="d-dtabs"><a class="on">편집</a><a>버전</a><a>API</a></div>
      </div>
      <div class="d-split two">
        <div class="d-main2"><div class="d-form w">
          <div class="d-fr"><div class="d-f"><label>유형</label><div class="d-in sel">ODM · OEM${ic('chevd', 16)}</div></div><div class="d-f"><label>지역</label><div class="d-in sel">${q.region}${ic('chevd', 16)}</div></div></div>
          <div class="d-fr"><div class="d-f"><label>회사</label><input class="d-in" value="${q.co}"></div><div class="d-f"><label>이름 <i class="req">필수</i></label><input class="d-in" value="${q.name}"></div></div>
          <div class="d-fr"><div class="d-f"><label>휴대전화</label><input class="d-in" value="${q.mobile}"></div><div class="d-f"><label>이메일 <i class="req">필수</i></label><input class="d-in" value="${q.email}"></div></div>
          <div class="d-f"><label>제목 <i class="req">필수</i></label><input class="d-in" value="${q.subject}"></div>
          <div class="d-f"><label>문의 내용 <i class="req">필수</i></label><textarea class="d-in ta" rows="5">${q.msg}</textarea></div>
          <div class="d-f"><label>관심 제형</label><div class="d-in tags">${q.interests.map((i) => chip('neutral', i + ' ✕')).join('')}</div></div>
          <div class="d-f"><label>첨부 파일 ${chip('neutral', ic('lock', 12) + '비공개')}</label><ul class="d-files">${q.files.map(file).join('')}</ul><p class="d-help">업무 시스템에 로그인한 직원만 받을 수 있고, 공개 주소로는 열리지 않습니다.</p></div>
        </div></div>
        <aside class="d-sidef">
          <div class="d-f"><label>상태</label><div class="d-in sel">신규${ic('chevd', 16)}</div><div class="d-dots"><i class="on"></i><i></i><i></i></div><p class="d-help">신규 → 처리 중 → 종료 순서로만 바꿀 수 있습니다</p></div>
          <div class="d-f"><label>담당자 ${newNote}</label><div class="d-in sel"><span class="d-m">미지정</span>${ic('chevd', 16)}</div></div>
          <div class="d-f hide-m"><label>내부 메모 ${newNote}</label><textarea class="d-in ta" rows="3" placeholder="고객에게 보이지 않는 메모"></textarea></div>
          <div class="d-f hide-m"><label>개인정보 수집 동의</label><div class="d-in ro">${q.consent}</div></div>
          <div class="d-f hide-m"><label>접수</label><div class="d-in ro">${q.recv} · 공개 화면 문의 폼</div></div>
        </aside>
      </div>
    </div>`,
      { full: true },
    )
  }

  const stub = (name) => shell('stub:' + name, ['홈페이지 관리', name], P.stub(name), { noTabs: ['메신저', '문서', '결재'].includes(name) })

  P.D.screens = {
    dash,
    site: () => site(),
    empty: () => site({ empty: true }),
    skeleton: () => site({ skeleton: true }),
    fail: () => site({ fail: true }),
    news,
    edit,
    inq,
  }
  P.D.stub = stub
}
