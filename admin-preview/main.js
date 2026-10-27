P.state = { loc: 'ko', pv: 'desk', drawer: false, pal: false, palq: '', dark: new URLSearchParams(location.search).has('dark'), tip: false, copied: false }

const VARIANTS = {
  A: { key: '1', name: '한 사이드바' },
  B: { key: '2', name: '상단 바 + 전용 사이드바' },
  C: { key: '3', name: '할 일 먼저 + ⌘K' },
  D: { key: '4', name: 'C 겉모습 + B 뼈대' },
}
const SCREENS = [
  ['dash', '① 업무 대시보드'],
  ['site', '② 홈페이지 첫 화면'],
  ['news', '③ 소식 목록'],
  ['edit', '④ 소식 편집'],
  ['inq', '⑤ 문의 상세'],
  ['m', '⑥ 모바일'],
]
const D_EXTRA = [
  ['palette', '⌘K'],
  ['palette-q', '⌘K 검색'],
  ['empty', '빈 상태'],
  ['skeleton', '로딩'],
  ['fail', '반영 실패'],
]
const bare = new URLSearchParams(location.search).has('bare')
document.body.classList.toggle('bare', bare)

const parse = () => {
  const h = decodeURIComponent(location.hash.replace(/^#/, '')) || 'D/site'
  const [v, ...rest] = h.split('/')
  return { v: VARIANTS[v] ? v : 'D', s: rest.join('/') || 'dash' }
}

const devbar = (v, s) => `
  <div class="tag">시안 <small>업무 시스템 + 홈페이지 관리</small></div>
  <nav class="screens">${SCREENS.map(([k, l]) => `<a class="${k === s ? 'on' : ''}" href="#${v}/${k}">${l}</a>`).join('')}${
    v === 'C' ? `<a class="${s === 'palette' ? 'on' : ''}" href="#C/palette">⌘K 팔레트</a>` : ''
  }${v === 'D' ? `<span class="sepv"></span>${D_EXTRA.map(([k, l]) => `<a class="${k === s ? 'on' : ''}" href="#D/${k}">${l}</a>`).join('')}<a href="#D/${s}" data-act="theme" class="${P.state.dark ? 'on' : ''}">${P.state.dark ? '라이트' : '다크'}</a>` : ''}</nav>
  <span class="note" title="인물·업체·상태 수치는 모두 샘플">샘플 데이터</span>
  <div class="vars">${Object.entries(VARIANTS)
    .map(([k, o]) => `<a class="${k === v ? 'on' : ''}" href="#${k}/${s}" title="${k}. ${o.name}"><b>${o.key}</b><span class="nm">${k}. ${o.name}</span></a>`)
    .join('')}</div>`

const mboard = (v) => `
  <div class="mboard">
    <figure><iframe src="index.html?bare=1#${v}/site" title="모바일 ②"></iframe><figcaption>② 홈페이지 관리 첫 화면 (390px)</figcaption></figure>
    <figure><iframe src="index.html?bare=1#${v}/inq" title="모바일 ⑤"></iframe><figcaption>⑤ 생산문의 상세 (390px)</figcaption></figure>
  </div>`

const render = () => {
  let { v, s } = parse()
  if (s === 'palette' || s === 'palette-q') {
    P.state.pal = true
    P.state.palq = s === 'palette-q' ? '횡성' : ''
    s = 'site'
  }
  document.getElementById('devbar').innerHTML = devbar(v, parse().s)
  const stage = document.getElementById('stage')
  let html
  if (s === 'm') html = mboard(v)
  else if (s.startsWith('stub:')) html = P[v].stub(s.slice(5))
  else html = (P[v].screens[s] || P[v].screens.dash)()
  stage.innerHTML = html
  stage.className = 'v' + v + (v === 'D' && P.state.dark ? ' dark' : '')
}

addEventListener('hashchange', () => {
  P.state.drawer = false
  P.state.pal = false
  P.state.tip = false
  P.state.copied = false
  render()
})
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]')
  if (e.target.closest('[data-stop]') && !(el && el.closest('[data-stop]'))) return
  if (!el) return
  const [a, arg] = el.dataset.act.split(':')
  if (a === 'loc') P.state.loc = arg
  else if (a === 'pv') P.state.pv = arg
  else if (a === 'drawer') P.state.drawer = !P.state.drawer
  else if (a === 'theme') P.state.dark = !P.state.dark
  else if (a === 'tip') P.state.tip = !P.state.tip
  else if (a === 'copy') P.state.copied = !P.state.copied
  else if (a === 'pal') {
    if (el.classList.contains('pal-scrim') && e.target.closest('.pal')) return
    P.state.pal = !P.state.pal
    P.state.palq = ''
  } else return
  render()
})
document.addEventListener('keydown', (e) => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')
  const { s } = parse()
  if (!typing && ['1', '2', '3', '4'].includes(e.key)) {
    const v = Object.keys(VARIANTS)[Number(e.key) - 1]
    const keep = ['dash', 'site', 'news', 'edit', 'inq', 'm'].includes(s) || s.startsWith('stub:') ? s : 'site'
    location.hash = `#${v}/${keep}`
  } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    P.state.pal = !P.state.pal
    P.state.palq = ''
    render()
  } else if (!typing && e.key === '/') {
    e.preventDefault()
    P.state.pal = true
    P.state.palq = ''
    render()
  } else if (e.key === 'Escape' && P.state.pal) {
    P.state.pal = false
    render()
  }
})
document.addEventListener('change', (e) => {
  const sel = e.target.closest('select[data-loc]')
  if (!sel) return
  P.state.loc = sel.value
  render()
})
render()
