// 정적 미리보기 사본(GitHub Pages)에서 서버가 없는 동작을 막고 안내만 띄운다. snapshot.mjs가 모든 화면의 <head> 맨 앞에 넣는다.
// 화면 모양·탭·시트·다크 모드·메뉴 같은 브라우저 안 동작은 그대로 돌고, 서버로 가는 저장·제출(서버 액션·API)만 여기서 받는다.
// 메신저는 실시간 서버가 없어서, 사본을 만들 때 실제 서버에서 받아 둔 대화(`messenger-data.json`)를 가짜 소켓이 읽기 전용으로 돌려준다.
;(() => {
  const me = document.currentScript
  const base = me.dataset.base || ''
  const NOTICE = '미리보기에서는 저장되지 않습니다'
  const QUERY_NOTICE = '미리보기에서는 검색·필터·탭·정렬·쪽이 바뀌지 않습니다'
  const realFetch = window.fetch.bind(window)

  // 정적 호스트는 디렉터리 주소에 끝 슬래시를 붙여 보낸다. 서버가 그린 주소(슬래시 없음)와 다르면 화면 코드가 경로를 다르게 읽어 하이드레이션이 어긋난다(동료 인정·공지·결재의 탭 줄이 사라진다).
  if (location.pathname.length > 1 && location.pathname.endsWith('/')) history.replaceState(history.state, '', location.pathname.replace(/\/+$/, '') + location.search + location.hash)

  // 인사 값이 보이는 화면은 확인 시간(재인증) 끝 시각이 사본을 만들 때 정해진다. 시계가 흐르면 곧 끝나 값이 지워지고 서버 새로 그리기가 되풀이되므로, 사본을 만든 시각에 시계를 고정한다.
  if (me.dataset.frozenAt) {
    const frozen = Date.parse(me.dataset.frozenAt)
    window.Date = new Proxy(Date, {
      construct: (target, args, newTarget) => Reflect.construct(target, args.length ? args : [frozen], newTarget),
      get: (target, key, receiver) => (key === 'now' ? () => frozen : Reflect.get(target, key, receiver)),
    })
  }

  // 쿼리 사본(`…/__q/…/`)은 서버가 그린 주소(쿼리 있는 주소)로 주소창을 맞춘 뒤 하이드레이션한다. 주소가 다르면 화면 코드가 다른 값을 읽어 어긋난다.
  if (me.dataset.canonical) history.replaceState(history.state, '', base + me.dataset.canonical)

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
    // 화면 이동(RSC) 요청은 정적 호스트에 없다. 네트워크를 타지 않고 바로 실패시키면 Next가 일반 이동으로 바꾼다(링크마다 하던 미리 받기가 화면 전체를 내려받지 않는다).
    if (headers.get('rsc') === '1' || url.searchParams.has('_rsc')) return Promise.resolve(new Response(null, { status: 404 }))
    const path = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname
    if (path === '/api/members/search' && method === 'GET') {
      const q = (url.searchParams.get('q') ?? '').trim().toLowerCase()
      return loadMembers().then((all) => json({ members: q ? all.filter((m) => `${m.name} ${m.sub}`.toLowerCase().includes(q)).slice(0, 8) : [] }))
    }
    if (path === '/api/auth/get-session') return Promise.resolve(json(null))
    if (path.startsWith('/api/push/subscriptions') && method === 'GET') return Promise.resolve(json({ subscriptions: [] }))
    // 메신저 알림 목록은 5초마다 다시 받는다. 서버가 없으니 화면에 이미 있는 목록을 그대로 둔다(응답이 실패면 화면이 바꾸지 않는다).
    if (path === '/messenger/notices' && method === 'GET') return Promise.resolve(json({ error: 'preview' }, 503))
    if (path.startsWith('/api/') || path.startsWith('/site/api/') || path.startsWith('/messenger/') || method !== 'GET') {
      if (method !== 'GET') show()
      return Promise.resolve(json({ error: 'preview' }, 503))
    }
    return realFetch(input, init)
  }

  // ── 메신저: 받아 둔 대화를 읽기 전용으로 돌려주는 가짜 소켓 ─────────────────────
  // 프레임 모양은 서버와 같다(@moda/messenger의 clientFrames·serverFrames). 보내기·반응·채널 만들기·들어가기·나가기는 저장되지 않는다.
  let messengerData
  const loadMessenger = () => (messengerData ??= realFetch(`${base}/messenger-data.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null))
  const WRITES = new Set(['send', 'createChannel', 'join', 'invite', 'remove', 'leave', 'openDirect', 'createGroup'])
  const REACTIONS = new Set(['react', 'unreact'])
  const SEARCH_PAGE = 20

  class PreviewSocket {
    static CONNECTING = 0
    static OPEN = 1
    static CLOSING = 2
    static CLOSED = 3
    CONNECTING = 0
    OPEN = 1
    CLOSING = 2
    CLOSED = 3
    readyState = 0
    onopen = null
    onmessage = null
    onclose = null
    onerror = null
    constructor(url) {
      this.url = url
      this.listeners = {}
      this.data = null
      loadMessenger().then((data) => {
        setTimeout(() => {
          if (this.readyState === 3) return
          if (!data) {
            this.readyState = 3
            this.emit('error', new Event('error'))
            this.emit('close', Object.assign(new Event('close'), { code: 1006 }))
            return
          }
          this.data = structuredClone(data)
          this.readyState = 1
          this.emit('open', new Event('open'))
          this.reply({ type: 'ready', userId: data.ready.userId, channels: this.data.ready.channels })
        }, 30)
      })
    }
    addEventListener(type, listener) {
      ;(this.listeners[type] ??= new Set()).add(listener)
    }
    removeEventListener(type, listener) {
      this.listeners[type]?.delete(listener)
    }
    emit(type, event) {
      this[`on${type}`]?.(event)
      for (const listener of this.listeners[type] ?? []) listener(event)
    }
    reply(frame) {
      setTimeout(() => this.readyState === 1 && this.emit('message', new MessageEvent('message', { data: JSON.stringify(frame) })), 20)
    }
    close() {
      if (this.readyState === 3) return
      this.readyState = 3
      setTimeout(() => this.emit('close', Object.assign(new Event('close'), { code: 1000 })), 0)
    }
    send(raw) {
      let frame
      try {
        frame = JSON.parse(raw)
      } catch {
        return
      }
      const data = this.data
      if (!data) return
      if (frame.type === 'ping') return this.reply({ type: 'pong' })
      if (WRITES.has(frame.type)) {
        show()
        return this.reply({ type: 'error', code: 'unavailable', clientId: frame.clientId })
      }
      if (REACTIONS.has(frame.type)) {
        show()
        return this.reply({ type: 'done', clientId: frame.clientId })
      }
      if (frame.type === 'loadHistory') return this.reply({ type: 'history', channelId: frame.channelId, messages: data.history[frame.channelId] ?? [], aroundId: frame.aroundId })
      if (frame.type === 'loadThread') {
        const thread = data.threads[`${frame.channelId}:${frame.rootId}`]
        const root = thread?.root ?? (data.history[frame.channelId] ?? []).find((m) => m.id === frame.rootId)
        if (!root) return this.reply({ type: 'error', code: 'invalid_thread' })
        return this.reply({ type: 'thread', channelId: frame.channelId, root, replies: thread?.replies ?? [] })
      }
      if (frame.type === 'loadMembers') return this.reply({ type: 'members', channelId: frame.channelId, members: data.members[frame.channelId] ?? [] })
      if (frame.type === 'browse') return this.reply({ type: 'browsed', channels: data.browsed })
      if (frame.type === 'markRead') {
        for (const channel of data.ready.channels) if (channel.id === frame.channelId) channel.unread = 0
        return this.reply({ type: 'channels', channels: data.ready.channels })
      }
      if (frame.type === 'search') return this.reply(this.search(frame))
    }
    search(frame) {
      const data = this.data
      const plain = (m) => m.body.replace(/<@([\w.-]+)>/g, (_, id) => `@${m.mentions.find((p) => p.userId === id)?.name ?? id}`)
      const terms = frame.query.toLowerCase().split(/\s+/).filter(Boolean)
      const everyone = new Map()
      for (const list of Object.values(data.history)) for (const m of list) everyone.set(m.id, m)
      for (const thread of Object.values(data.threads)) for (const m of [thread.root, ...thread.replies]) everyone.set(m.id, m)
      const found = [...everyone.values()]
        .filter((m) => (frame.beforeId === undefined || m.id < frame.beforeId) && terms.every((t) => `${plain(m)} ${(m.attachments ?? []).map((f) => f.fileName).join(' ')}`.toLowerCase().includes(t)))
        .sort((a, b) => b.id - a.id)
      const page = found.slice(0, SEARCH_PAGE)
      const hits = page.map((m) => {
        const text = plain(m)
        const at = Math.max(0, text.toLowerCase().indexOf(terms[0] ?? ''))
        return {
          messageId: m.id,
          channelId: m.channelId,
          ...(m.threadRootId === undefined ? {} : { threadRootId: m.threadRootId }),
          authorName: m.authorName,
          createdAt: m.createdAt,
          snippet: text.slice(Math.max(0, at - 30), at + 90),
          files: (m.attachments ?? []).map((f) => f.fileName).filter((n) => terms.some((t) => n.toLowerCase().includes(t))).slice(0, 3),
        }
      })
      return { type: 'searchResult', clientId: frame.clientId, query: frame.query, hits, ...(found.length > SEARCH_PAGE ? { nextBeforeId: page.at(-1).id } : {}) }
    }
  }
  window.WebSocket = PreviewSocket

  // ── 링크 ─────────────────────────────────────────────────────────
  // 쿼리가 화면을 정하는 주소(결재 양식 고르기 등)는 쿼리마다 따로 저장해 뒀다. 정적 호스트는 쿼리를 구분하지 못하므로 그 사본으로 보낸다.
  // 내려받기 경로(snapshot.mjs의 DOWNLOAD와 같다): 서버가 파일을 만들어 주는 길이라 사본에는 없다.
  const DOWNLOAD = /\/(file|pdf|export)$/
  let variants = { queries: {}, pages: {} }
  realFetch(`${base}/_preview/variants.json`).then((r) => (r.ok ? r.json() : variants)).then((v) => (variants = v)).catch(() => {})
  /** 링크가 저장해 둔 쿼리 사본을 가리키면 그 사본의 주소(기본 경로 포함), 아니면 null. */
  const variantHref = (a) => {
    const u = new URL(a.href, location.href)
    const rel = u.pathname.startsWith(base) ? u.pathname.slice(base.length) : u.pathname
    const keys = variants.queries[rel.replace(/\/$/, '')]
    if (!keys) return null
    const params = new URLSearchParams(keys.filter((key) => u.searchParams.get(key)).map((key) => [key, u.searchParams.get(key)]))
    const page = params.size ? variants.pages[`${rel.replace(/\/$/, '')}?${params}`] : undefined
    return page ? base + page : null
  }
  // 사본에 저장한 주소. 목록에 없는 화면은 사본에 담기지 않은 화면이라 링크를 눌러도 안내만 띄운다.
  let savedPages = null
  realFetch(`${base}/_preview/pages.json`).then((r) => (r.ok ? r.json() : null)).then((list) => (savedPages = list ? new Set(list) : null)).catch(() => {})
  const isMissing = (raw) => {
    if (!savedPages || !raw.startsWith('/') || raw.startsWith('//')) return false
    const rel = raw.split(/[?#]/)[0].replace(/\/$/, '')
    const own = rel === base || rel.startsWith(`${base}/`) ? rel.slice(base.length) : rel
    return own !== '' && !own.startsWith('/messenger/files/') && !own.startsWith('/_next/') && !savedPages.has(own)
  }
  // basePath가 없는 일반 링크(<a href="/site"> 등)는 이 미리보기 안의 주소로 바꾼다. 홈페이지 관리(/site)도 같은 사본 안의 한 구역이다.
  document.addEventListener(
    'click',
    (event) => {
      const a = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!a || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
      const raw = a.getAttribute('href') || ''
      const stop = () => (event.preventDefault(), event.stopImmediatePropagation())
      if (DOWNLOAD.test(raw.split('?')[0])) {
        stop()
        show('미리보기에서는 내려받을 수 없습니다')
        return
      }
      // 홈페이지 관리의 API 주소(편집 화면의 "API" 보기 링크)는 사본에 없다. 그림(/site/api/media/file)만 담았다.
      if (/\/site\/api\/(?!media\/file\/)/.test(raw.split('?')[0])) {
        stop()
        show('미리보기에서는 관리 API를 열 수 없습니다')
        return
      }
      const variant = variantHref(a)
      if (variant) {
        stop()
        location.assign(variant)
        return
      }
      const own = raw === base || raw.startsWith(`${base}/`)
      // 같은 화면에서 쿼리만 바꾸는 링크(탭·정렬·쪽)는 정적 호스트가 쿼리를 구분하지 못해 첫 모습이 다시 열릴 뿐이다. 이동하지 않고 이유를 알린다.
      const samePage = raw.startsWith('?') || (raw.startsWith('/') && !raw.startsWith('//') && raw.split('#')[0].includes('?') && (own ? raw : base + raw).split(/[?#]/)[0].replace(/\/+$/, '') === location.pathname.replace(/\/+$/, ''))
      if (samePage) {
        stop()
        show(QUERY_NOTICE)
        return
      }
      if (!raw.startsWith('/') || raw.startsWith('//')) return
      if (isMissing(raw)) {
        stop()
        show('이 화면은 미리보기에 담기지 않았습니다')
        return
      }
      if (own) return
      stop()
      location.assign(base + raw)
    },
    true,
  )

  // 서버가 처리하는 폼은 정적 호스트로 보내면 이 미리보기 밖(없는 주소·405)으로 나간다: 검색·필터(GET)와 승인·읽음 처리 같은 대체 경로(POST). 보내지 않고 안내만 띄운다.
  // 서버 액션 폼(주소가 없거나 javascript:)은 화면 코드가 서버 액션 요청으로 처리하므로 위의 fetch가 받는다.
  document.addEventListener(
    'submit',
    (event) => {
      const form = event.target
      const action = form?.getAttribute?.('action')
      if (!action || action.startsWith('javascript:')) return
      event.preventDefault()
      event.stopImmediatePropagation()
      show(String(form.getAttribute('method') || 'get').toLowerCase() === 'get' ? QUERY_NOTICE : NOTICE)
    },
    true,
  )

  // 화면 코드가 기본 경로 없이 쓴 그림 주소(메신저 첨부 미리보기 `/messenger/files/…`)는 이 미리보기 안의 주소로 바꾼다. 나중에 그려지는 그림도 같다.
  const fixImage = (img) => {
    const src = img.getAttribute('src') || ''
    if (src.startsWith('/') && !src.startsWith('//') && src !== base && !src.startsWith(`${base}/`)) img.setAttribute('src', base + src)
  }
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'attributes' && record.target instanceof HTMLImageElement) fixImage(record.target)
      for (const node of record.addedNodes) {
        if (node instanceof HTMLImageElement) fixImage(node)
        else if (node instanceof Element) node.querySelectorAll('img').forEach(fixImage)
      }
    }
  }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] })

  // 메신저는 읽기 전용이라는 안내를 제목 아래에 둔다. 하이드레이션이 끝난 뒤에 넣는다.
  const messengerNote = () => {
    const heading = document.querySelector('main h1')
    if (!heading || document.querySelector('[data-preview-messenger-note]')) return
    const note = document.createElement('p')
    note.className = 'notice'
    note.setAttribute('role', 'note')
    note.setAttribute('data-preview-messenger-note', '')
    note.textContent = '미리보기에서는 저장해 둔 대화를 읽기만 할 수 있습니다. 보내기·반응·새 대화·파일 올리기·결재 알림의 승인은 저장되지 않습니다.'
    heading.after(note)
  }

  // 서버 렌더링 시각(오늘 날짜 등)은 그대로 두고, 안내 띠만 붙인다. 하이드레이션이 끝난 뒤에 넣어 화면 구조를 건드리지 않는다.
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (/^\/messenger\/?$/.test(location.pathname.slice(base.length))) messengerNote()
      if (document.querySelector('[data-preview-banner]')) return
      const bar = document.createElement('div')
      bar.setAttribute('data-preview-banner', '')
      bar.style.cssText =
        `position:fixed;${matchMedia('(max-width:820px)').matches ? 'left:12px;bottom:76px' : 'right:12px;bottom:12px'};z-index:2147483646;display:flex;gap:8px;align-items:center;padding:6px 10px;border-radius:999px;background:rgba(31,35,41,.92);color:#fff;font:600 12px/1.2 system-ui,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.25)`
      const commit = document.querySelector('meta[name="yuyu-source-commit"]')?.getAttribute('content')?.slice(0, 7)
      bar.innerHTML = `<span>모의 데이터 · ${commit ? `${commit} 기준 · ` : ''}미리보기</span>`
      document.body.append(bar)
    }, 1200)
  })
})()
