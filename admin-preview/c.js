/* ═════════ 변형 C. 할 일 먼저 + ⌘K 팔레트 ═════════ */
P.C = {}
{
  const { ic, chip, stChip, inqChip, tr, avatar, NEWS, INQ, n } = P

  const RAIL = [
    ['dash', 'home', '홈'],
    ['stub:메신저', 'chat', '메신저', 4],
    ['stub:문서', 'doc', '문서'],
    ['stub:결재', 'approval', '결재', 2],
    ['site', 'globe', '홈페이지'],
  ]
  const TABS = [
    ['site', '할 일', n.inqNew + n.review + n.trNeed],
    ['news', '소식'],
    ['stub:전자공고', '전자공고'],
    ['stub:페이지', '페이지'],
    ['stub:제품', '제품'],
    ['inq', '문의', n.inqNew],
    ['stub:미디어', '미디어'],
    ['stub:설정', '설정'],
  ]
  const siteScreens = ['site', 'news', 'edit', 'inq']
  const isSite = (s) => siteScreens.includes(s) || ['제품', '미디어', '설정', '전자공고', '페이지'].some((x) => s === 'stub:' + x)

  const rail = (s) => `
  <nav class="c-rail" aria-label="앱 전환">
    <a class="lg" href="#C/dash" aria-label="홈"><img src="assets/symbol.svg" alt=""></a>
    ${RAIL.map(([r, i, l, b]) => `<a class="${(r === 'site' ? isSite(s) : r === s) ? 'on' : ''}" href="#C/${r}">${ic(i, 20)}${l}${b ? `<span class="dotb">${b}</span>` : ''}</a>`).join('')}
    <span class="sp"></span>
    <a href="#C/stub:설정">${ic('gear', 20)}설정</a>
    ${avatar('스', 32)}
  </nav>`
  const btabs = (s) => `
  <nav class="c-bottomtabs" aria-label="앱 전환">
    ${RAIL.map(([r, i, l, b]) => `<a class="${(r === 'site' ? isSite(s) : r === s) ? 'on' : ''}" href="#C/${r}">${ic(i, 20)}${l}${b ? `<span class="dotb">${b}</span>` : ''}</a>`).join('')}
  </nav>`

  const palette = () => `
  <div class="pal-scrim" data-act="pal">
    <div class="pal" data-stop>
      <div class="pal-in">${ic('search', 18)}<span class="typed">소식<i></i></span><kbd>esc</kbd></div>
      <div class="pal-tabs"><span class="on">전체</span><span>이동</span><span>새로 만들기</span><span>문서</span><span>사람</span></div>
      <div class="pal-g"><h5>새로 만들기</h5>
        <a class="pal-i on" href="#C/edit"><span class="pi">${ic('plus', 16)}</span><div><b>새 소식 쓰기</b><span class="sub">홈페이지 관리 · 소식</span></div><span class="k"><kbd>↵</kbd></span></a>
        <a class="pal-i" href="#C/edit"><span class="pi">${ic('plus', 16)}</span><div><b>새 전자공고 올리기</b><span class="sub">홈페이지 관리 · 전자공고 · PDF 첨부</span></div></a>
      </div>
      <div class="pal-g"><h5>이동</h5>
        <a class="pal-i" href="#C/news"><span class="pi">${ic('news', 16)}</span><div><b>소식 목록</b><span class="sub">홈페이지 관리 · ${n.news}건</span></div></a>
        <a class="pal-i" href="#C/news"><span class="pi">${ic('lang', 16)}</span><div><b>번역이 필요한 소식</b><span class="sub">저장된 보기 · ${n.trNeed}건</span></div></a>
        <a class="pal-i" href="#C/edit"><span class="pi">${ic('edit', 16)}</span><div><b>유유헬스케어, 2020 횡성 신축공장 준공식 개최 …</b><span class="sub">소식 · 최근 수정</span></div></a>
      </div>
      <div class="pal-f"><span><kbd>↑</kbd> <kbd>↓</kbd> 이동</span><span><kbd>↵</kbd> 열기</span><span><kbd>⌘</kbd><kbd>↵</kbd> 새 탭</span><span style="margin-left:auto">언제든 ⌘K 또는 /</span></div>
    </div>
  </div>`

  const shell = (s, where, body, opt = {}) => `
  <div class="c-shell">
    ${rail(s)}
    <div class="c-main">
      <header class="c-top">
        <div class="where">${where}</div>
        <button class="c-pal" data-act="pal">${ic('search', 16)}<span>검색 · 이동 · 새로 만들기</span><kbd>⌘K</kbd></button>
        <button class="btn btn-ghost btn-icon btn-sm hide-m" aria-label="알림">${ic('bell', 18)}</button>
        <span class="hide-m">${avatar('스풋', 28)}</span>
      </header>
      ${
        opt.noSub
          ? ''
          : `<div class="c-sub"><div class="tt">${ic('globe', 17)}홈페이지 관리</div><nav class="tabs">${TABS.map(([r, l, b]) => `<a class="${r === s || (r === 'news' && s === 'edit') ? 'on' : ''}" href="#C/${r}">${l}${b ? `<span class="n ${r === 'inq' ? 'info' : ''}">${b}</span>` : ''}</a>`).join('')}</nav></div>`
      }
      ${opt.full ? `<div class="grow" style="min-height:0">${body}</div>` : `<div class="c-scroll"><div class="c-page">${body}</div></div>`}
    </div>
    ${btabs(s)}
    ${P.state.pal ? palette() : ''}
  </div>`

  /* ① 업무 대시보드: 모든 앱의 할 일을 한 줄로 */
  const dash = () =>
    shell(
      'dash',
      '홈',
      `
    <div class="c-hello"><h1>안녕하세요, 스풋님</h1><p class="sub">오늘 처리할 일 ${2 + n.inqNew + 1}건 · 2026년 10월 27일 화요일</p></div>
    <div class="views"><a class="on">전체 <span class="n">${2 + n.inqNew + 1}</span></a><a>결재 <span class="n">2</span></a><a>홈페이지 <span class="n">${n.inqNew + 1}</span></a><a>메신저 <span class="n">1</span></a></div>
    <div class="grid2" style="grid-template-columns:1.5fr 1fr;gap:16px;align-items:start">
      <div class="cards">
        ${P.APPROVALS.slice(0, 2).map((a) => `<div class="crow"><span class="fileic">${ic('approval', 16)}</span><div class="ct"><b>${a.t}</b><div class="meta"><span>${a.by}</span><span>${a.at}</span>${chip('neutral', '결재')}</div></div><a class="btn btn-sm btn-primary" href="#C/stub:결재">검토</a></div>`).join('')}
        ${INQ.filter((q) => q.st === 'new').map((q) => `<div class="crow"><span class="fileic" style="background:var(--info-bg);color:var(--info)">${ic('mail', 16)}</span><div class="ct"><b>새 생산문의 · ${q.co}</b><div class="meta"><span>${q.type}</span><span>${q.recv}</span>${chip('info', '홈페이지')}</div></div><a class="btn btn-sm" href="#C/inq">열기</a></div>`).join('')}
        <div class="crow"><span class="fileic" style="background:var(--warn-bg);color:var(--warn)">${ic('alert', 16)}</span><div class="ct"><b>고객 확인 전 초안 ${n.review}건이 공개를 기다립니다</b><div class="meta"><span>소식 · 창립 15주년 기념 책자 발간</span>${chip('info', '홈페이지')}</div></div><a class="btn btn-sm" href="#C/edit">열기</a></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card"><div class="card-h">메신저<a class="more" href="#C/stub:메신저">열기</a></div><ul class="list">${P.msgRows()}</ul></div>
        <div class="card"><div class="card-h">최근 문서</div><ul class="list">${P.docRows()}</ul></div>
      </div>
    </div>`,
      { noSub: true },
    )

  /* ② 홈페이지 관리 첫 화면: 할 일이 먼저 */
  const site = () =>
    shell(
      'site',
      '홈페이지 관리',
      `
    <div class="c-hello"><h1>오늘 할 일 3가지</h1><p class="sub">공개 화면은 정상 반영 중입니다 · 마지막 반영 오늘 09:12</p></div>
    <div class="lanes">
      <section class="lane info">
        <div class="lane-h"><div class="big"><b>${n.inqNew}</b><span>새 생산문의</span></div><p class="sub">아직 담당자가 없는 문의입니다.</p></div>
        <ul class="list">${INQ.filter((q) => q.st === 'new').map((q) => `<li class="li"><div class="grow"><b class="ell">${q.co}</b><span class="sub ell">${q.type} · ${q.region} · ${q.recv}</span></div><a class="btn btn-sm" href="#C/inq">열기</a></li>`).join('')}</ul>
        <a class="lane-f" href="#C/inq">문의 전체 보기${ic('chev', 15)}</a>
      </section>
      <section class="lane warn">
        <div class="lane-h"><div class="big"><b>${n.review}</b><span>고객 확인 전 초안</span></div><p class="sub">확인이 끝나기 전까지 공개하지 않습니다.</p></div>
        <ul class="list">${NEWS.filter((r) => r.review).map((r) => `<li class="li"><img class="th" src="assets/${r.th}.png" alt="" style="width:56px;height:38px"><div class="grow"><b>${r.t}</b><span class="sub">확인 메모: 고객사 문구 확인 대기(샘플)</span></div></li>`).join('')}</ul>
        <div class="card-b" style="padding-top:0"><div class="row"><a class="btn btn-sm" href="#C/edit">열기</a><a class="btn btn-sm btn-primary" href="#C/stub:결재">결재 올리기</a></div></div>
        <a class="lane-f" href="#C/news">초안 전체 보기${ic('chev', 15)}</a>
      </section>
      <section class="lane warn">
        <div class="lane-h"><div class="big"><b>${n.trNeed}</b><span>번역이 필요한 소식</span></div><p class="sub">제목이 없는 언어에서는 화면에 나오지 않습니다.</p>
          <div class="prog"><span>한</span><div class="bar"><i style="width:100%"></i></div><em>${n.newsPublish}/${n.newsPublish}</em><span>영</span><div class="bar"><i class="w" style="width:${Math.round((NEWS.filter((r) => r.st === 'publish' && r.tr.en === 'ok').length / n.newsPublish) * 100)}%"></i></div><em>${NEWS.filter((r) => r.st === 'publish' && r.tr.en === 'ok').length}/${n.newsPublish}</em><span>중</span><div class="bar"><i class="w" style="width:${Math.round((NEWS.filter((r) => r.st === 'publish' && r.tr.zh === 'ok').length / n.newsPublish) * 100)}%"></i></div><em>${NEWS.filter((r) => r.st === 'publish' && r.tr.zh === 'ok').length}/${n.newsPublish}</em></div></div>
        <ul class="list">${NEWS.filter((r) => r.st === 'publish' && (r.tr.en !== 'ok' || r.tr.zh !== 'ok'))
          .slice(0, 3)
          .map((r) => `<li class="li"><div class="grow"><b class="ell">${r.t}</b><span class="sub">${tr(r.tr)}</span></div><a class="btn btn-sm" href="#C/edit">번역</a></li>`)
          .join('')}</ul>
        <a class="lane-f" href="#C/news">번역 필요 ${n.trNeed}건 모두 보기${ic('chev', 15)}</a>
      </section>
    </div>
    <div class="c-sec">새로 만들기</div>
    <div class="quick"><a class="btn" href="#C/edit">${ic('plus', 15)}새 소식</a><a class="btn" href="#C/stub:전자공고">${ic('plus', 15)}새 전자공고</a><a class="btn" href="#C/stub:미디어">${ic('image', 15)}사진·파일 올리기</a><a class="btn" href="#C/stub:설정">${ic('file', 15)}회사소개서 교체</a>
      <span class="grow"></span><button class="btn btn-ghost" data-act="pal">${ic('search', 15)}다른 건 ⌘K로 찾기</button></div>`,
    )

  /* ③ 소식 목록(저장된 보기 + 카드 줄) */
  const newsList = () =>
    shell(
      'news',
      '홈페이지 관리 · 소식',
      `
    <div class="pg-h"><div><h1 class="h1">소식</h1></div><div class="acts"><a class="btn btn-primary" href="#C/edit">${ic('plus', 15)}새 소식</a></div></div>
    <div class="views"><a class="on">전체 <span class="n">${n.news}</span></a><a>번역 필요 <span class="n">${n.trNeed}</span></a><a>고객 확인 전 <span class="n">${n.review}</span></a><a>내가 쓴 글 <span class="n">2</span></a><a style="border-style:dashed;color:var(--muted)">${ic('plus', 13)}보기 저장</a></div>
    <div class="tools"><div class="search">${ic('search', 15)}<input class="input" placeholder="제목으로 검색" aria-label="제목으로 검색"></div><div class="input sel" style="width:120px">분류${ic('chevd', 14)}</div><div class="input sel" style="width:120px">상태${ic('chevd', 14)}</div><span class="grow"></span><span class="sub hide-m">한 영 중 = 제목 입력 여부</span></div>
    <div class="cards">
      ${NEWS.map(
        (r) => `<div class="crow"><img class="th" src="assets/${r.th}.png" alt=""><div class="ct"><a href="#C/edit"><b>${r.t}</b></a><div class="meta">${stChip(r.st)}${r.review ? chip('warn', '고객 확인 전') : ''}<span>${r.cat}</span><span>${r.d}</span><span>${r.by} · ${r.up}</span></div></div>
        <div class="trs"><div>${tr(r.tr)}</div>${r.tr.en !== 'ok' || r.tr.zh !== 'ok' ? `<a class="add" href="#C/edit">번역 추가 →</a>` : '<span class="sub" style="font-size:12.5px">번역 완료</span>'}</div></div>`,
      ).join('')}
    </div>`,
    )

  /* ④ 집중 편집: 한 열 + 오른쪽 미리보기 + 공개 전 확인 */
  const edit = () => {
    const loc = P.state.loc
    const seg = ['ko', 'en', 'zh'].map((l) => `<button class="${loc === l ? 'on' : ''}" data-act="loc:${l}"><span class="dot ${l === 'ko' ? '' : 'empty'}"></span>${P.LN[l]}</button>`).join('')
    const k = loc === 'ko'
    return shell(
      'edit',
      '홈페이지 관리 · 소식',
      `<div class="c-edit">
      <div class="c-edit-l">
        <div class="c-edit-bar"><a class="btn btn-ghost btn-icon btn-sm" href="#C/news" aria-label="목록으로">${ic('back', 17)}</a><div class="seg">${seg}</div><span class="grow"></span>${stChip('publish')}<span class="sub hide-m">14:20 자동 저장됨</span><button class="btn">초안으로</button><button class="btn btn-primary">게시</button></div>
        <div class="c-edit-form"><div class="in">
          ${k ? '' : `<div class="callout c-warn">${ic('alert', 16)}<div><b>${P.LN[loc]} 내용이 비어 있습니다.</b> 제목을 입력해야 이 언어 화면에 공개됩니다. <button class="link" data-act="noop">한국어 내용 복사해서 시작</button></div></div>`}
          <textarea class="big-t" rows="2" placeholder="${k ? '' : loc === 'en' ? 'English title' : '中文标题'}" aria-label="제목">${k ? P.POST.title : ''}</textarea>
          <div class="row sub" style="margin:6px 0 14px"><span>${P.POST.date.replace(/-/g, '.')}</span><span>·</span><span>보도자료</span><span>·</span><span>${ic('image', 13)} 대표 이미지 1장</span></div>
          <div class="rte"><div class="rte-bar"><b>B</b><i>I</i><u>U</u><span class="sep"></span><span>H2</span><span>H3</span><span class="sep"></span><span>목록</span><span>링크</span><span>이미지</span></div>
            <div class="rte-body" style="min-height:340px">${k ? P.POST.body.map((p, i) => (i === 3 ? `<p><a>${p}</a></p>` : `<p>${p}</p>`)).join('') : `<p class="ph">${loc === 'en' ? 'Write the English body here.' : '请在此输入中文正文。'}</p>`}</div></div>
        </div></div>
        <div class="c-check"><b>공개 전 확인</b><span class="ci ok">${ic('check', 14)}한국어 제목·본문</span><span class="ci no">${ic('alert', 14)}영어 비어 있음</span><span class="ci no">${ic('alert', 14)}중국어 비어 있음</span><span class="ci ok">${ic('check', 14)}대표 이미지 대체 텍스트</span></div>
      </div>
      ${P.preview(loc, P.state.pv)}
    </div>`,
      { full: true },
    )
  }

  /* ⑤ 문의 접수함: 목록 · 상세 · 속성 */
  const inq = () => {
    const q = INQ[0]
    const done = (i) => ['new', 'in-progress', 'closed'].indexOf(q.st) > i
    return shell(
      'inq',
      '홈페이지 관리 · 문의',
      `<div class="c-inbox">
      <div class="c-ilist">
        <div class="ih"><div class="seg seg-sm"><button class="on">열림 ${n.inqNew + n.inqProg}</button><button>종료 1</button></div><span class="grow"></span><button class="btn btn-ghost btn-icon btn-sm" aria-label="필터">${ic('filter', 15)}</button></div>
        ${INQ.map((r, i) => `<a class="ii ${i === 0 ? 'on' : ''}" href="#C/inq"><div class="l1">${inqChip(r.st)}<span class="t">${r.recv}</span></div><b>${r.co}</b><span class="sub ell">${r.type} · ${r.region} · ${r.interests.join(', ') || '제형 미선택'}</span></a>`).join('')}
      </div>
      <div class="c-idetail"><div class="in">
        <div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:8px">${inqChip(q.st)}${chip('neutral', q.region)}${chip('neutral', q.type)}<span class="sub">No.${q.no} · ${q.recv} 접수</span></div>
        <h1 class="h1" style="margin-bottom:16px">${q.subject}</h1>
        <div class="row" style="gap:10px;margin-bottom:12px">${avatar(q.name, 34)}<div><b>${q.name}</b><div class="sub">${q.co} · ${q.email}</div></div></div>
        <div class="m-only" style="margin-bottom:16px"><div class="steps" style="margin-bottom:10px"><span class="st on new">신규</span><span class="st">처리 중</span><span class="st">종료</span></div><div class="input sel"><span class="sub">담당자: 미지정</span>${ic('chevd', 14)}</div></div>
        <div class="msg" style="margin-bottom:18px">${q.msg}</div>
        <div class="row" style="gap:6px;margin-bottom:16px;flex-wrap:wrap"><span class="sub">관심 제형</span>${q.interests.map((i) => chip('neutral', i)).join('')}</div>
        <h4 style="margin:0 0 8px;font-size:13px">첨부 파일 ${chip('neutral', ic('lock', 12) + '비공개')}</h4>
        <ul class="files">${q.files.map(([f, s]) => `<li><span class="fileic">${ic('file', 16)}</span><div class="grow"><b>${f}</b><span class="sub">${s}</span></div><button class="btn btn-sm">${ic('download', 14)}받기</button></li>`).join('')}</ul>
        <h4 style="margin:18px 0 8px;font-size:13px">메모</h4>
        <textarea class="input" rows="3" placeholder="내부 메모 · 고객에게 보이지 않습니다"></textarea>
        <div class="m-sticky" style="margin-top:16px"><button class="btn btn-primary">처리 시작</button><button class="btn">담당자 지정</button></div>
      </div></div>
      <aside class="c-iprops">
        <section><h4>상태</h4><div class="steps"><span class="st ${q.st === 'new' ? 'on new' : 'done'}">신규</span><span class="st ${q.st === 'in-progress' ? 'on' : done(1) ? 'done' : ''}">처리 중</span><span class="st">종료</span></div>
          <button class="btn btn-primary" style="width:100%;margin-top:10px">처리 시작</button><p class="sub" style="margin-top:6px">한 단계씩만 앞으로 바뀝니다.</p></section>
        <section><h4>담당자</h4><div class="input sel"><span class="sub">미지정</span>${ic('chevd', 14)}</div></section>
        <section><h4>연락처</h4><dl class="kv" style="grid-template-columns:62px 1fr"><dt>휴대전화</dt><dd>${q.mobile}</dd><dt>이메일</dt><dd>${q.email}</dd></dl></section>
        <section><h4>활동</h4><ul class="tl"><li class="now">접수 · 확인 메일 발송<span>${q.recv}</span></li><li>개인정보 수집 동의<span>${q.consent}</span></li></ul></section>
      </aside>
    </div>`,
      { full: true },
    )
  }

  const stub = (name) => shell('stub:' + name, name, P.stub(name), { noSub: ['메신저', '문서', '결재'].includes(name) })

  P.C.screens = { dash, site, news: newsList, edit, inq }
  P.C.stub = stub
}
