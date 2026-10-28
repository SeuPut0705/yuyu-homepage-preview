// 정적 미리보기 사본(GitHub Pages)에서 서버가 없는 동작을 막고 안내만 띄운다. snapshot.mjs가 모든 화면의 <head> 맨 앞에 넣는다.
// 화면 모양·탭·시트·다크 모드·메뉴 같은 브라우저 안 동작은 그대로 돌고, 서버로 가는 저장·제출(서버 액션·API)만 여기서 받는다.
;(() => {
  const me = document.currentScript
  const base = me.dataset.base || ''
  const NOTICE = '미리보기에서는 저장되지 않습니다'
  const realFetch = window.fetch.bind(window)

  let toast
  let timer
  const show = (message = NOTICE) => {
    const mount = () => {
      if (!toast) {
        toast = document.createElement('div')
        toast.setAttribute('role', 'status')
        toast.setAttribute('data-preview-toast', '')
        toast.style.cssText =
          'position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:2147483647;max-width:calc(100vw - 32px);padding:12px 18px;border-radius:10px;background:#1f2329;color:#fff;font:600 14px/1.4 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.28);pointer-events:none'
        document.body.append(toast)
      }
      toast.textContent = message
      toast.style.display = 'block'
      clearTimeout(timer)
      timer = setTimeout(() => (toast.style.display = 'none'), 2600)
    }
    if (document.body) mount()
    else document.addEventListener('DOMContentLoaded', mount, { once: true })
  }

  const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
  let members
  const loadMembers = () => (members ??= realFetch(`${base}/members-search.json`).then((r) => r.json()).catch(() => []))

  window.fetch = (input, init) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? String(input) : input.url, location.href)
    if (url.origin !== location.origin) return realFetch(input, init)
    const request = typeof input === 'object' && !(input instanceof URL) ? input : null
    const headers = new Headers(init?.headers ?? request?.headers)
    const method = String(init?.method ?? request?.method ?? 'GET').toUpperCase()
    // 서버 액션(폼 저장·제출·로그아웃 등). 끝나지 않는 응답으로 두고 안내 뒤 화면을 처음 상태로 되돌린다.
    if (headers.has('next-action')) {
      show()
      setTimeout(() => location.reload(), 2400)
      return new Promise(() => {})
    }
    // 화면 이동 때 받는 서버 컴포넌트 응답은 정적 호스트에 없다. 그대로 두면 Next가 일반 이동으로 바꾼다.
    if (headers.get('rsc') === '1' || url.searchParams.has('_rsc')) return realFetch(input, init)
    const path = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname
    if (path === '/api/members/search' && method === 'GET') {
      const q = (url.searchParams.get('q') ?? '').trim().toLowerCase()
      return loadMembers().then((all) => json({ members: q ? all.filter((m) => `${m.name} ${m.sub}`.toLowerCase().includes(q)).slice(0, 8) : [] }))
    }
    if (path === '/api/auth/get-session') return Promise.resolve(json(null))
    if (path.startsWith('/api/push/subscriptions') && method === 'GET') return Promise.resolve(json({ subscriptions: [] }))
    if (path.startsWith('/api/') || path.startsWith('/site/api/') || method !== 'GET') {
      if (method !== 'GET') show()
      return Promise.resolve(json({ error: 'preview' }, 503))
    }
    return realFetch(input, init)
  }

  // 메신저 같은 실시간 연결은 열지 않는다.
  window.WebSocket = class {
    static CONNECTING = 0
    static OPEN = 1
    static CLOSING = 2
    static CLOSED = 3
    readyState = 3
    constructor() {
      setTimeout(() => {
        this.onerror?.(new Event('error'))
        this.onclose?.(new Event('close'))
      }, 50)
    }
    send() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
  }

  // basePath가 없는 일반 링크(<a href="/site"> 등)는 이 미리보기 안의 주소로 바꾼다. 홈페이지 관리는 관리 화면 미리보기로 간다.
  const site = me.dataset.site || ''
  document.addEventListener(
    'click',
    (event) => {
      const a = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!a || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
      const raw = a.getAttribute('href') || ''
      if (!raw.startsWith('/') || raw.startsWith('//') || raw === base || raw.startsWith(`${base}/`)) return
      event.preventDefault()
      event.stopImmediatePropagation()
      // 관리 화면 사본에서 /site 밖으로 나가는 링크(업무 시스템으로 돌아가기 등)는 업무 미리보기 첫 화면으로 간다.
      const toSite = raw === '/site' || raw.startsWith('/site/')
      location.assign(me.dataset.mode === 'admin' ? (toSite ? base + raw : me.dataset.work || site) : toSite ? site : base + raw)
    },
    true,
  )

  // 서버 렌더링 시각(오늘 날짜 등)은 그대로 두고, 안내 띠만 붙인다. 하이드레이션이 끝난 뒤에 넣어 화면 구조를 건드리지 않는다.
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (document.querySelector('[data-preview-banner]')) return
      const bar = document.createElement('div')
      bar.setAttribute('data-preview-banner', '')
      bar.style.cssText =
        `position:fixed;${matchMedia('(max-width:820px)').matches ? 'left:12px;bottom:76px' : 'right:12px;bottom:12px'};z-index:2147483646;display:flex;gap:8px;align-items:center;padding:6px 10px;border-radius:999px;background:rgba(31,35,41,.92);color:#fff;font:600 12px/1.2 system-ui,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.25)`
      const home = me.dataset.home || ''
      bar.innerHTML = `<span>모의 데이터 · 2026-10-29 test 기준 · 미리보기</span>${home ? `<a href="${home}" style="color:#9fe3b4;text-decoration:underline">역할 바꾸기</a>` : ''}`
      bar.querySelector('a')?.addEventListener('click', (e) => e.stopPropagation())
      document.body.append(bar)
    }, 1200)
  })
})()
