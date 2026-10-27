/* ═════════ 변형 B. 업무 상단 바 + Payload 홈페이지 사이드바 ═════════ */
P.B = {}
{
  const { ic, chip, stChip, inqChip, tr, avatar, NEWS, INQ, n } = P

  const GROUPS = [
    ['콘텐츠', [['stub:페이지', 'layout', '페이지'], ['stub:미디어', 'image', '미디어'], ['stub:연혁', 'history', '연혁'], ['stub:인증', 'check', '인증'], ['stub:고객사', 'users', '고객사'], ['stub:FAQ', 'chat', 'FAQ']]],
    ['홍보센터', [['news', 'news', '소식'], ['stub:전자공고', 'notice', '전자공고'], ['stub:자료실', 'file', '자료실']]],
    ['제품', [['stub:제형 카탈로그', 'cube', '제형 카탈로그']]],
    ['문의', [['inq', 'mail', '생산문의', n.inqNew], ['stub:문의 첨부', 'lock', '문의 첨부 파일']]],
    ['설정', [['stub:사이트 설정', 'gear', '사이트 설정']]],
  ]

  const apps = (cur) => {
    const A = [
      ['dash', 'home', '홈'],
      ['stub:메신저', 'chat', '메신저', 4],
      ['stub:문서', 'doc', '문서'],
      ['stub:결재', 'approval', '결재', 2],
      ['site', 'globe', '홈페이지 관리'],
    ]
    const isSite = cur !== 'dash' && !cur.startsWith('stub:메신저') && !cur.startsWith('stub:문서') && !cur.startsWith('stub:결재')
    return A.map(([r, i, l, b]) => `<a class="${(r === 'site' ? isSite : r === cur) ? 'on' : ''}" href="#B/${r}">${ic(i, 16)}${l}${b ? `<span class="badge">${b}</span>` : ''}</a>`).join('')
  }

  const topbar = (cur) => {
    const label = cur === 'dash' ? '홈' : '홈페이지 관리'
    return `
  <header class="b-top">
    <div class="b-brand"><img src="assets/symbol.svg" alt=""><span>유유헬스케어 업무</span></div>
    <nav class="b-apps" aria-label="앱 전환">${apps(cur)}</nav>
    <span class="b-appsel" style="display:none;align-items:center;gap:6px;font-weight:700;margin-left:2px">${label}${ic('chevd', 15)}</span>
    <div class="right"><span class="pill">${ic('search', 14)}검색<kbd>⌘K</kbd></span><button class="btn btn-ghost btn-icon btn-sm" aria-label="알림">${ic('bell', 18)}</button>${avatar('스풋', 28)}</div>
  </header>`
  }

  const nav = (cur) => `
  <aside class="b-nav" aria-label="홈페이지 관리 메뉴">
    <div class="tt">${ic('globe', 17)}홈페이지 관리</div>
    <a class="it ${cur === 'site' ? 'on' : ''}" href="#B/site">${ic('grid', 16)}대시보드</a>
    ${GROUPS.map(
      ([g, items]) => `<div class="gh">${g}${ic('chevd', 14)}</div>${items
        .map(([r, i, l, b]) => `<a class="it ${r === cur || (r === 'news' && cur === 'edit') ? 'on' : ''}" href="#B/${r}">${ic(i, 16)}${l}${b ? `<span class="badge">${b}</span>` : ''}</a>`)
        .join('')}`,
    ).join('')}
  </aside>`

  const navbtn = `<button class="btn btn-sm b-navbtn" style="display:none;margin:10px 14px 0;align-self:flex-start" data-act="noop">${ic('menu', 15)}콘텐츠 메뉴</button>`

  const wrap = (cur, inner, opt = {}) => `
  <div class="b-shell">
    ${topbar(cur)}
    <div class="b-body">
      ${opt.noNav ? '' : nav(cur)}
      <main class="b-main ${opt.gray ? 'gray' : ''}">${opt.noNav ? '' : navbtn}${inner}</main>
    </div>
  </div>`

  const head = (crumbs, right = '') => `<div class="b-head">${crumbs.map((c, i) => (i === crumbs.length - 1 ? `<b>${c}</b>` : `<span>${c}</span>${ic('chev', 13)}`)).join('')}<span class="grow"></span>${right}</div>`

  /* ① 업무 대시보드 */
  const dash = () =>
    wrap(
      'dash',
      `<div class="b-scroll"><div class="b-dash">
    <div class="pg-h"><div><h1 class="h1">안녕하세요, 스풋님</h1><p class="sub">2026년 10월 27일 화요일</p></div></div>
    <div class="kpis">
      <a class="kpi" href="#B/stub:결재"><div class="t">${ic('approval', 15)}결재 대기</div><div class="v">2<small>건</small></div></a>
      <a class="kpi" href="#B/stub:메신저"><div class="t">${ic('chat', 15)}읽지 않은 메시지</div><div class="v">5<small>개</small></div></a>
      <a class="kpi hot" href="#B/inq"><div class="t">${ic('mail', 15)}새 생산문의</div><div class="v">${n.inqNew}<small>건</small></div></a>
      <a class="kpi" href="#B/news"><div class="t">${ic('lang', 15)}번역이 필요한 소식</div><div class="v">${n.trNeed}<small>건</small></div></a>
    </div>
    <div class="grid2" style="grid-template-columns:1.1fr 1fr">
      <div class="stack">
        <div class="card"><div class="card-h">결재<a class="more" href="#B/stub:결재">모두 보기</a></div><ul class="list">${P.approvalRows()}</ul></div>
        <div class="card"><div class="card-h">최근 문서<a class="more" href="#B/stub:문서">모두 보기</a></div><ul class="list">${P.docRows()}</ul></div>
      </div>
      <div class="stack">
        <div class="card"><div class="card-h">메신저<a class="more" href="#B/stub:메신저">열기</a></div><ul class="list">${P.msgRows()}</ul></div>
        <div class="card"><div class="card-h">${ic('globe', 16)}홈페이지 관리<a class="more" href="#B/site">열기</a></div><div class="card-b">
          <div class="row" style="gap:10px;margin-bottom:10px"><span class="dotk brand" style="box-shadow:0 0 0 4px rgb(19 150 84/.18)"></span><b>공개 화면 정상 반영 중</b></div>
          <p class="sub">새 생산문의 ${n.inqNew}건 · 고객 확인 전 초안 ${n.review}건</p></div></div>
      </div>
    </div></div></div>`,
      { noNav: true, gray: true },
    )

  /* ② Payload 대시보드 + beforeDashboard 배너 */
  const site = () =>
    wrap(
      'site',
      `${head(['홈페이지 관리'], `<a class="btn btn-sm" href="#B/site">${ic('ext', 14)}공개 화면 열기</a>`)}
    <div class="b-scroll"><div class="b-pad">
      <div class="bdb"><span class="ico">${ic('bolt', 18)}</span><div><b>오늘 확인할 일이 있습니다</b><span class="sub">새 생산문의 ${n.inqNew}건 · 고객 확인 전 초안 ${n.review}건 · 번역이 필요한 소식 ${n.trNeed}건</span></div>
        <div class="chip-row"><a class="btn btn-sm btn-primary" href="#B/inq">문의 보기</a><a class="btn btn-sm" href="#B/news">소식 보기</a></div></div>
      ${GROUPS.map(([g, items]) => `<section class="pgroup"><h3>${g}</h3><div class="pcards">${items.map(([r, i, l, b]) => `<a class="pcard" href="#B/${r}"><span class="row" style="gap:10px">${l}${b ? `<span class="badge">새 ${b}</span>` : ''}</span><span class="pl">${ic('plus', 15)}</span></a>`).join('')}</div></section>`).join('')}
    </div></div>`,
    )

  /* ③ Payload 목록 + 커스텀 셀 */
  const newsList = () =>
    wrap(
      'news',
      `${head(['홈페이지 관리', '소식'])}
    <div class="b-scroll"><div class="b-pad wide" style="max-width:1200px">
      <div class="plist-h"><h1>소식</h1><a class="btn btn-primary" href="#B/edit">${ic('plus', 15)}새로 만들기</a></div>
      <div class="ptab"><a class="on">전체<span class="n">${n.news}</span></a><a>공개<span class="n">${n.newsPublish}</span></a><a>초안<span class="n">${n.newsDraft}</span></a><a>번역 필요<span class="n">${n.trNeed}</span></a></div>
      <div class="pctl"><div class="search" style="max-width:340px">${ic('search', 15)}<input class="input" placeholder="제목 검색" aria-label="제목 검색"></div><button class="btn">${ic('filter', 14)}필터</button><button class="btn">열</button><button class="btn">정렬: 게시일 ↓</button></div>
      <div class="tblwrap"><table class="tbl dense"><thead><tr><th style="width:36px"><input type="checkbox" aria-label="전체 선택"></th><th style="width:84px">대표 이미지</th><th>제목</th><th>게시일</th><th>상태</th><th>번역</th><th>최종 수정</th></tr></thead><tbody>
        ${NEWS.map((r) => `<tr><td><input type="checkbox" aria-label="선택"></td><td><img class="th" src="assets/${r.th}.png" alt=""></td><td><a class="ttl" href="#B/edit" style="display:block;max-width:460px">${r.t}</a></td><td class="m" style="white-space:nowrap">${r.d}</td><td>${stChip(r.st)}</td><td style="white-space:nowrap">${tr(r.tr)}</td><td class="m" style="white-space:nowrap">${r.up}</td></tr>`).join('')}
      </tbody></table>
      <div class="tblfoot"><span>1–${n.news} / ${n.news}</span><span class="row"><span>페이지당 10</span></span></div></div>
    </div></div>`,
    )

  /* ④ Payload 편집: 라이브 미리보기 탭(왼쪽 필드 · 오른쪽 미리보기) */
  const edit = () => {
    const loc = P.state.loc
    const pv = P.state.pv
    return wrap(
      'edit',
      `${head(['홈페이지 관리', '소식', '편집'])}
    <div class="b-docbar">
      <h1 class="h1 grow ell" style="font-size:18px">${P.POST.title}</h1>
      ${stChip('publish')}
      <select class="input" data-loc aria-label="언어" style="width:128px;height:32px;flex:none">${['ko', 'en', 'zh'].map((l) => `<option value="${l}" ${l === loc ? 'selected' : ''}>${P.LN[l]}</option>`).join('')}</select>
      <button class="btn">초안 저장</button><button class="btn btn-primary">변경 사항 게시</button>
    </div>
    <div class="b-doctabs"><a>편집</a><a class="on">라이브 미리보기</a><a>버전</a><a>API</a></div>
    <div class="b-split">
      <div class="b-split-l">
        ${P.editFields(loc, { compact: true })}
        <h3 class="fg">사이드 필드</h3>
        <div class="fld"><label>확인 메모 <span class="loc-tag">편집자에게만 보임</span></label><textarea class="input" rows="2" placeholder="확인이 끝나기 전까지 공개하지 않는 이유"></textarea></div>
      </div>
      ${P.preview(loc, pv)}
    </div>`,
    )
  }

  /* ⑤ Payload 편집: 생산문의(읽기 위주 필드 + 오른쪽 사이드) */
  const inq = () => {
    const q = INQ[0]
    return wrap(
      'inq',
      `${head(['홈페이지 관리', '생산문의', `No.${q.no}`])}
    <div class="b-docbar"><h1 class="h1 grow ell" style="font-size:18px">${q.subject}</h1>${inqChip(q.st)}<button class="btn btn-primary">저장</button></div>
    <div class="b-doctabs"><a class="on">편집</a><a>버전</a><a>API</a></div>
    <div class="b-edit">
      <div class="b-edit-l">
        <div class="fld-row"><div class="fld"><label>유형</label><div class="input sel">ODM · OEM${ic('chevd', 14)}</div></div><div class="fld"><label>지역</label><div class="input sel">${q.region}${ic('chevd', 14)}</div></div></div>
        <div class="fld-row"><div class="fld"><label>회사</label><input class="input" value="${q.co}"></div><div class="fld"><label>이름 <i class="req">필수</i></label><input class="input" value="${q.name}"></div></div>
        <div class="fld-row"><div class="fld"><label>휴대전화</label><input class="input" value="${q.mobile}"></div><div class="fld"><label>이메일 <i class="req">필수</i></label><input class="input" value="${q.email}"></div></div>
        <div class="fld"><label>제목 <i class="req">필수</i></label><input class="input" value="${q.subject}"></div>
        <div class="fld"><label>문의 내용 <i class="req">필수</i></label><textarea class="input" rows="5">${q.msg}</textarea></div>
        <div class="fld"><label>관심 제형</label><div class="input" style="height:auto;padding:6px 8px;gap:6px;justify-content:flex-start;flex-wrap:wrap">${q.interests.map((i) => chip('neutral', i + ' ✕')).join('')}</div></div>
        <div class="fld"><label>첨부 파일<span class="chip c-neutral">${ic('lock', 12)}비공개</span></label><ul class="files">${q.files.map(([f, s]) => `<li><span class="fileic">${ic('file', 16)}</span><div class="grow"><b>${f}</b><span class="sub">${s}</span></div><button class="btn btn-sm">${ic('download', 14)}받기</button></li>`).join('')}</ul></div>
      </div>
      <aside class="b-edit-r">
        <h3 class="fg">상태</h3>
        <div class="input sel" style="margin-bottom:6px">신규${ic('chevd', 14)}</div>
        <p class="sub" style="margin-bottom:18px">신규 → 처리 중 → 종료 순서로만 바꿀 수 있습니다.</p>
        <h3 class="fg">담당자 <span class="chip c-info" style="margin-left:4px">새 필드</span></h3>
        <div class="input sel" style="margin-bottom:18px"><span class="sub">미지정</span>${ic('chevd', 14)}</div>
        <h3 class="fg">개인정보 수집 동의</h3>
        <div class="input" style="margin-bottom:18px;background:#f3f5f4">${q.consent}</div>
        <h3 class="fg">접수</h3><p class="sub">${q.recv} · 공개 화면 문의 폼</p>
      </aside>
    </div>`,
    )
  }

  P.B.screens = { dash, site, news: newsList, edit, inq }
  P.B.stub = (name) => {
    const work = ['메신저', '문서', '결재'].includes(name)
    return wrap('stub:' + name, `${work ? '' : head(['홈페이지 관리', name])}<div class="b-scroll">${P.stub(name)}</div>`, { noNav: work, gray: work })
  }
}
