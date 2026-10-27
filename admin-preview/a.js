/* ═════════ 변형 A. 한 사이드바 ═════════ */
P.A = {}
{
  const { ic, chip, stChip, inqChip, tr, avatar, NEWS, INQ, n } = P

  const SITE = [
    ['site', 'grid', '개요'],
    ['news', 'news', '소식'],
    ['stub:전자공고', 'notice', '전자공고'],
    ['stub:페이지', 'layout', '페이지'],
    ['stub:제형 카탈로그', 'cube', '제형 카탈로그'],
    ['inq', 'mail', '생산문의', n.inqNew],
    ['stub:미디어', 'image', '미디어'],
    ['stub:홈페이지 설정', 'gear', '설정'],
    ['stub:기타 콘텐츠', 'layers', '기타 콘텐츠'],
  ]
  const inSite = (s) => ['site', 'news', 'edit', 'inq'].includes(s) || s.startsWith('stub')

  const side = (s) => `
  <aside class="a-side">
    <div class="a-brand"><img src="assets/symbol.svg" alt=""><div><b>유유헬스케어</b><span>업무 시스템</span></div></div>
    <button class="a-search" data-act="noop">${ic('search', 15)}<span>검색</span><kbd>⌘K</kbd></button>
    <nav class="a-nav" aria-label="주 메뉴">
      <a class="it ${s === 'dash' ? 'on' : ''}" href="#A/dash">${ic('home', 17)}대시보드</a>
      <a class="it" href="#A/stub:메신저">${ic('chat', 17)}메신저<span class="badge">4</span></a>
      <a class="it" href="#A/stub:문서">${ic('doc', 17)}문서</a>
      <a class="it" href="#A/stub:결재">${ic('approval', 17)}결재<span class="badge">2</span></a>
      <div class="lbl">업무</div>
      <div class="grp open">
        <a class="it head" href="#A/site">${ic('globe', 17)}홈페이지 관리<span class="car">${ic('chevd', 14)}</span></a>
        <div class="sub-l">
          ${SITE.map(([r, i, l, b]) => {
            const on = r === s || (r === 'news' && s === 'edit') || r === s.replace(/^stub:/, 'stub:')
            return `<a class="it ${on ? 'on' : ''}" href="#A/${r}">${ic(i, 16)}${l}${b ? `<span class="badge">${b}</span>` : ''}</a>`
          }).join('')}
        </div>
      </div>
      <a class="it" href="#A/stub:설정">${ic('gear', 17)}설정</a>
      <a class="it" href="#A/stub:관리">${ic('users', 17)}관리<span class="car">${ic('chev', 14)}</span></a>
    </nav>
    <div class="a-user">${avatar('스풋', 32)}<div><b>스풋</b><span>관리자 · 2단계 인증 켜짐</span></div></div>
  </aside>`

  const top = (crumbs) => `
  <header class="a-top">
    <button class="btn btn-ghost btn-icon a-burger" data-act="drawer" aria-label="메뉴 열기">${ic('menu', 20)}</button>
    <div class="crumbs">${crumbs.map((c, i) => (i === crumbs.length - 1 ? `<b>${c}</b>` : `<span class="${i < crumbs.length - 1 && crumbs.length > 2 ? 'hide-m' : ''}">${c}</span>${ic('chev', 13)}`)).join('')}</div>
    <span class="grow"></span>
    <a class="btn btn-sm hide-m" href="#A/site">${ic('ext', 14)}공개 화면 열기</a>
    <button class="btn btn-ghost btn-icon btn-sm" aria-label="알림">${ic('bell', 18)}</button>
    ${avatar('스풋', 28)}
  </header>`

  const shell = (s, crumbs, body, full) => `
  <div class="a-shell ${P.state.drawer ? 'drawer' : ''}">
    ${side(s)}
    <div class="a-scrim" data-act="drawer"></div>
    <div class="a-main">
      ${top(crumbs)}
      ${full ? `<div class="grow" style="min-height:0">${body}</div>` : `<div class="a-scroll"><div class="a-page">${body}</div></div>`}
    </div>
  </div>`

  /* ① 업무 대시보드 */
  const dash = () =>
    shell(
      'dash',
      ['대시보드'],
      `
    <div class="pg-h"><div><h1 class="h1">안녕하세요, 스풋님</h1><p class="sub">2026년 10월 27일 화요일 · 오늘 처리할 일 ${2 + n.inqNew + 1}건</p></div></div>
    <div class="kpis">
      <a class="kpi" href="#A/stub:결재"><div class="t">${ic('approval', 15)}결재 대기</div><div class="v">2<small>건</small></div></a>
      <a class="kpi" href="#A/stub:메신저"><div class="t">${ic('chat', 15)}읽지 않은 메시지</div><div class="v">5<small>개</small></div></a>
      <a class="kpi hot" href="#A/inq"><div class="t">${ic('mail', 15)}새 생산문의 <span class="chip c-info" style="margin-left:auto">홈페이지</span></div><div class="v">${n.inqNew}<small>건</small></div></a>
      <a class="kpi" href="#A/news"><div class="t">${ic('lang', 15)}번역이 필요한 소식 <span class="chip c-info" style="margin-left:auto">홈페이지</span></div><div class="v">${n.trNeed}<small>건</small></div></a>
    </div>
    <div class="grid2">
      <div class="card"><div class="card-h">결재<a class="more" href="#A/stub:결재">모두 보기</a></div><ul class="list">${P.approvalRows()}</ul></div>
      <div class="card"><div class="card-h">메신저<a class="more" href="#A/stub:메신저">열기</a></div><ul class="list">${P.msgRows()}</ul></div>
      <div class="card"><div class="card-h">최근 문서<a class="more" href="#A/stub:문서">모두 보기</a></div><ul class="list">${P.docRows()}</ul></div>
      <div class="card"><div class="card-h">홈페이지 관리<a class="more" href="#A/site">열기</a></div>
        <ul class="list">
          ${INQ.filter((q) => q.st === 'new')
            .map((q) => `<li class="li"><span class="fileic">${ic('mail', 15)}</span><div class="grow"><b class="ell">${q.co} · ${q.type}</b><span class="sub">${q.recv} 접수</span></div>${chip('info', '신규')}</li>`)
            .join('')}
        </ul></div>
    </div>`,
    )

  /* ② 홈페이지 관리 첫 화면 */
  const site = () =>
    shell(
      'site',
      ['홈페이지 관리', '개요'],
      `
    <div class="pg-h"><div><h1 class="h1">홈페이지 관리</h1><p class="sub">공개 화면의 글·사진·제품을 고치고, 생산문의를 받습니다.</p></div>
      <div class="acts"><a class="btn" href="#A/site">${ic('ext', 15)}공개 화면 열기</a><a class="btn btn-primary" href="#A/edit">${ic('plus', 15)}새 소식</a></div></div>
    <div class="card statusbar"><span class="pulse"></span><div class="grow"><b>공개 화면에 정상 반영 중</b><div class="sub">마지막 반영 오늘 09:12 · 소식 「차:올랑 흑무차 출시」 수정</div></div><button class="btn btn-sm">반영 기록</button></div>
    <div class="tiles">
      <a class="tile" href="#A/news"><span class="ti">${ic('news', 17)}</span><span class="n">${n.news}</span><b>소식</b><span class="sub">보도자료·제품·영상 소식</span></a>
      <a class="tile" href="#A/stub:전자공고"><span class="ti">${ic('notice', 17)}</span><b>전자공고</b><span class="sub">PDF 첨부 공고 게시판</span></a>
      <a class="tile" href="#A/stub:페이지"><span class="ti">${ic('layout', 17)}</span><span class="n">12</span><b>페이지</b><span class="sub">고정 화면 12개 문구·이미지</span></a>
      <a class="tile" href="#A/stub:제형 카탈로그"><span class="ti">${ic('cube', 17)}</span><span class="n">10</span><b>제형 카탈로그</b><span class="sub">제형 10종 · 포장 · 기능성 원료</span></a>
      <a class="tile" href="#A/inq"><span class="ti">${ic('mail', 17)}</span><span class="n new">새 ${n.inqNew}</span><b>생산문의</b><span class="sub">접수함 · 첨부는 비공개</span></a>
      <a class="tile" href="#A/stub:미디어"><span class="ti">${ic('image', 17)}</span><b>미디어</b><span class="sub">사진·영상·문서 파일</span></a>
      <a class="tile" href="#A/stub:기타 콘텐츠"><span class="ti">${ic('layers', 17)}</span><b>기타 콘텐츠</b><span class="sub">자료실 · FAQ · 연혁 · 인증 · 고객사 · 사업장</span></a>
      <a class="tile" href="#A/stub:홈페이지 설정"><span class="ti">${ic('gear', 17)}</span><b>설정</b><span class="sub">메뉴 · 연락처 · 확인 수치 · 회사소개서</span></a>
    </div>
    <div class="card">
      <div class="card-h">최근 수정<a class="more" href="#A/news">소식 전체 보기</a></div>
      <table class="tbl"><thead><tr><th>제목</th><th>종류</th><th>상태</th><th>번역</th><th>수정</th></tr></thead><tbody>
        ${[NEWS[6], NEWS[7], NEWS[0], NEWS[3]]
          .map((r) => `<tr><td><a class="ttl" href="#A/edit">${r.t}</a></td><td class="m">소식</td><td>${stChip(r.st)}${r.review ? ' ' + chip('warn', '고객 확인 전') : ''}</td><td>${tr(r.tr)}</td><td class="m">${r.by} · ${r.up}</td></tr>`)
          .join('')}
      </tbody></table>
    </div>`,
    )

  /* ③ 소식 목록 */
  const news = () =>
    shell(
      'news',
      ['홈페이지 관리', '소식'],
      `
    <div class="pg-h"><div><h1 class="h1">소식</h1><p class="sub">공개 화면의 홍보센터 소식입니다. 제목이 있는 언어에서만 해당 화면에 나옵니다.</p></div>
      <div class="acts"><a class="btn btn-primary" href="#A/edit">${ic('plus', 15)}새 소식</a></div></div>
    <div class="tabs-u"><a class="on">전체<span class="n">${n.news}</span></a><a>공개<span class="n">${n.newsPublish}</span></a><a>초안<span class="n">${n.newsDraft}</span></a><a>고객 확인 전<span class="n">${n.review}</span></a></div>
    <div class="tools">
      <div class="search">${ic('search', 15)}<input class="input" placeholder="제목으로 검색" aria-label="제목으로 검색"></div>
      <div class="input sel" style="width:130px">분류: 전체${ic('chevd', 14)}</div>
      <label class="tgl"><input type="checkbox" class="ck">번역 필요만</label>
      <span class="grow"></span><span class="sub hide-m">한 · 영 · 중 = 제목 입력 여부</span>
    </div>
    <div class="tblwrap"><table class="tbl dense"><thead><tr><th style="width:36px"><input type="checkbox" aria-label="전체 선택"></th><th style="width:84px">이미지</th><th>제목</th><th>상태</th><th>번역</th><th>게시일</th><th>수정</th><th style="width:36px"></th></tr></thead><tbody>
      ${NEWS.map(
        (r) => `<tr><td><input type="checkbox" aria-label="선택"></td><td><img class="th" src="assets/${r.th}.png" alt=""></td>
        <td><a class="ttl" href="#A/edit" style="display:block;max-width:440px">${r.t}</a><span class="m">${r.cat}</span></td>
        <td>${stChip(r.st)}${r.review ? '<div style="margin-top:4px">' + chip('warn', '고객 확인 전') + '</div>' : ''}</td><td style="white-space:nowrap">${tr(r.tr)}</td><td class="m" style="white-space:nowrap">${r.d}</td><td class="m" style="white-space:nowrap">${r.by}<br>${r.up}</td><td>${ic('more', 18)}</td></tr>`,
      ).join('')}
    </tbody></table>
    <div class="tblfoot"><span>${n.news}건 중 1–${n.news}</span><span class="row"><button class="btn btn-sm" disabled>이전</button><button class="btn btn-sm" disabled>다음</button></span></div></div>`,
    )

  /* ④ 소식 편집(오른쪽 실시간 미리보기) */
  const edit = () => {
    const loc = P.state.loc
    const seg = ['ko', 'en', 'zh']
      .map((l) => `<button class="${loc === l ? 'on' : ''}" data-act="loc:${l}"><span class="dot ${{ ko: 'ok', en: 'empty', zh: 'empty' }[l] === 'ok' ? '' : 'empty'}"></span>${P.LN[l]}</button>`)
      .join('')
    return shell(
      'edit',
      ['홈페이지 관리', '소식', '편집'],
      `<div class="a-edit">
      <div class="a-edit-l">
        <div class="a-edit-h">
          <div class="t1"><a class="btn btn-ghost btn-icon btn-sm" href="#A/news" aria-label="목록으로">${ic('back', 17)}</a><h1 class="h1" style="font-size:18px">소식 편집</h1>${stChip('publish')}<span class="sub">마지막 수정 10.12 · 스풋</span></div>
          <div class="row" style="flex-wrap:wrap"><div class="seg">${seg}</div><span class="sub">언어별로 따로 저장됩니다 · 영·중은 아직 비어 있음</span></div>
        </div>
        <div class="a-edit-form">${P.editFields(loc)}</div>
        <div class="a-edit-foot"><span class="sub grow">${ic('check', 14)} 14:20 자동 저장됨</span><button class="btn">초안으로 저장</button><button class="btn btn-primary">게시</button></div>
      </div>
      ${P.preview(loc, P.state.pv)}
    </div>`,
      true,
    )
  }

  /* ⑤ 생산문의 상세 */
  const inq = () => {
    const q = INQ[0]
    const done = (i) => ['new', 'in-progress', 'closed'].indexOf(q.st) > i
    return shell(
      'inq',
      ['홈페이지 관리', '생산문의', `No.${q.no}`],
      `
    <div class="pg-h"><div><a class="link" href="#A/inq" style="text-decoration:none;font-weight:600;color:var(--muted)">← 생산문의</a>
        <h1 class="h1" style="margin-top:6px">${q.subject}</h1>
        <p class="sub" style="margin-top:6px"><span class="row" style="gap:6px;flex-wrap:wrap">${inqChip(q.st)}${chip('neutral', q.region)}${chip('neutral', q.type)}<span>No.${q.no} · ${q.recv} 접수</span></span></p></div></div>
    <div class="side-2">
      <div class="stack">
        <div class="card"><div class="card-h">문의 내용</div><div class="card-b">
          <dl class="kv" style="margin-bottom:16px"><dt>회사</dt><dd>${q.co}</dd><dt>이름</dt><dd>${q.name}</dd><dt>휴대전화</dt><dd>${q.mobile}</dd><dt>이메일</dt><dd>${q.email}</dd><dt>관심 제형</dt><dd>${q.interests.map((i) => chip('neutral', i)).join(' ')}</dd></dl>
          <div class="msg">${q.msg}</div></div></div>
        <div class="card"><div class="card-h">첨부 파일<span class="chip c-neutral" style="margin-left:6px">${ic('lock', 12)}비공개</span></div><div class="card-b">
          <ul class="files">${q.files.map(([f, s]) => `<li><span class="fileic">${ic('file', 16)}</span><div class="grow"><b>${f}</b><span class="sub">${s}</span></div><button class="btn btn-sm">${ic('download', 14)}받기</button></li>`).join('')}</ul>
          <p class="sub">업무 시스템에 로그인한 직원만 받을 수 있고, 공개 주소로는 열리지 않습니다.</p></div></div>
      </div>
      <div class="stack">
        <div class="card"><div class="card-h">처리</div><div class="card-b">
          <div class="steps" style="margin-bottom:12px"><span class="st ${q.st === 'new' ? 'on new' : 'done'}">신규</span><span class="st ${q.st === 'in-progress' ? 'on' : done(1) ? 'done' : ''}">처리 중</span><span class="st ${q.st === 'closed' ? 'done' : ''}">종료</span></div>
          <button class="btn btn-primary" style="width:100%;height:38px">처리 시작 (신규 → 처리 중)</button>
          <p class="sub" style="margin-top:8px">상태는 한 단계씩 앞으로만 바뀝니다.</p>
          <div class="fld" style="margin:16px 0 0"><label>담당자</label><div class="input sel"><span class="sub">미지정</span>${ic('chevd', 14)}</div></div></div></div>
        <div class="card"><div class="card-h">내부 메모</div><div class="card-b"><textarea class="input" rows="3" placeholder="고객에게 보이지 않는 메모"></textarea></div></div>
        <div class="card"><div class="card-h">활동 기록</div><div class="card-b"><ul class="tl"><li class="now">접수 완료 · 확인 메일 발송<span>${q.recv}</span></li><li>개인정보 수집 동의<span>${q.consent}</span></li></ul></div></div>
      </div>
    </div>
    <div class="m-sticky"><button class="btn btn-primary">처리 시작</button><button class="btn">담당자 지정</button></div>`,
    )
  }

  const stub = (name) => shell('stub:' + name, [name], P.stub(name))

  P.A.screens = { dash, site, news, edit, inq }
  P.A.stub = stub
}
