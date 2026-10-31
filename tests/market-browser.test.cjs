const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { JSDOM } = require('jsdom');
const root = join(__dirname, '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const app = readFileSync(join(root, 'app.js'), 'utf8');
const csv = readFileSync(join(root, 'alert-csv.js'), 'utf8');
const tick = () => new Promise(resolve => setTimeout(resolve, 15));

function market(slug, question = slug, outcomes = ['Yes', 'No']) {
  return { id: slug, slug, question, active: true, closed: false, enableOrderBook: true,
    spread: 0.01, outcomes, clobTokenIds: outcomes.map((_, i) => `${slug}-${i}`), outcomePrices: outcomes.map(() => 1 / outcomes.length) };
}
function fixtures() {
  return {
    alpha: { id: 'a', slug: 'alpha', title: 'Event Alpha', description: 'Alpha rules', markets: [market('a1', 'Alpha first?'), market('a2', 'Alpha second?')] },
    beta: { id: 'b', slug: 'beta', title: 'Event Beta', description: 'Beta rules', markets: [market('b1', 'Beta first?'), market('b2', 'Beta second?')] },
    large: { id: 'c', slug: 'large', title: 'Long event ' + '名称'.repeat(80), description: 'Very long rules '.repeat(150), markets: Array.from({length: 100}, (_, i) => market(`large-${i}`, `Question ${i}: ` + 'LongMarketName'.repeat(20), ['Home', 'Draw', 'Away'])) }
  };
}
async function boot(t, { mobile = false, saved, events = fixtures() } = {}) {
  const dom = new JSDOM(html, { url: 'https://test.example/', runScripts: 'outside-only', pretendToBeVisual: true });
  t.after(() => dom.window.close());
  const w = dom.window, d = w.document;
  const errors = [], requests = [], gates = new Map(), failures = new Set(), sockets = [];
  w.addEventListener('error', e => errors.push(e.error));
  w.matchMedia = () => ({ matches: mobile });
  w.CSS = { escape: value => String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&") };
  w.setInterval = () => 1;
  w.clearInterval = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { if (!this.open) return; this.open = false; this.dispatchEvent(new w.Event('close')); };
  w.AudioContext = class {
    state = 'running'; currentTime = 0; destination = {};
    createGain() { return { gain: {setValueAtTime(){}, exponentialRampToValueAtTime(){}}, connect(){}, disconnect(){} }; }
    createOscillator() { return { frequency: {}, connect(){}, start(){}, stop(){}, disconnect(){} }; }
  };
  w.WebSocket = class {
    static OPEN = 1; readyState = 1;
    constructor(url) { this.url = url; sockets.push(this); Promise.resolve().then(() => this.onopen?.()); }
    send(data) { this.sent = data; }
    close() { this.readyState = 3; }
  };
  w.fetch = async (input) => {
    const url = new URL(input, w.location.href); requests.push(url.href);
    if (url.pathname === '/public-search') return { ok: true, json: async () => ({ events: url.searchParams.get('q') === 'empty' ? [] : Object.values(events).map(({markets, ...e}) => e) }) };
    const slug = decodeURIComponent(url.pathname.split('/events/slug/')[1] || '');
    if (gates.has(slug)) await gates.get(slug).promise;
    if (!events[slug] || failures.has(slug)) return { ok: false, status: 503 };
    return { ok: true, json: async () => structuredClone(events[slug]) };
  };
  if (saved) w.localStorage.setItem('goal_pulse_state_v1', JSON.stringify(saved));
  w.eval(csv); w.eval(app); await tick();
  const click = selector => { assert.ok(d.querySelector(selector), `Missing ${selector}`); d.querySelector(selector).focus(); d.querySelector(selector).click(); };
  const selectEvent = async (index) => { click(`[data-event-index="${index}"]`); await tick(); };
  const input = (selector, value) => { const el = d.querySelector(selector); el.value = value; el.dispatchEvent(new w.Event('input', {bubbles:true})); };
  const select = slug => click(`[data-select-market="${slug}"]`);
  const hold = slug => { let release; const promise = new Promise(r => release = r); gates.set(slug, {promise, release}); return () => { gates.delete(slug); release(); }; };
  return {w,d,click,selectEvent,input,select,hold,failures,sockets,requests,errors,events};
}

test('startup exposes a clear entry and renders events without technical slugs', async t => {
  const {d,click,errors} = await boot(t);
  assert.equal(d.querySelector('#marketBrowser').open, false);
  assert.match(d.querySelector('#watchCount').textContent, /0 markets/);
  click('#emptyAddBtn');
  assert.equal(d.querySelector('#marketBrowser').open, true);
  assert.equal(d.querySelectorAll('[data-event-index]').length, 3);
  assert.equal(d.querySelector('.result-item .meta').textContent.includes('alpha'), false);
  assert.match(d.querySelector('#browserHelp').textContent, /Choose an event/);
  assert.deepEqual(errors, []);
});

test('cross-event batch retains correct event identity and prevents duplicate monitors', async t => {
  const {d,w,click,selectEvent,select} = await boot(t);
  click('#openBrowserBtn'); await selectEvent(0); select('a1'); select('a2');
  await selectEvent(1); select('b1');
  assert.match(d.querySelector('#addSelectedBtn').textContent, /3/);
  click('#addSelectedBtn'); await tick();
  const saved = JSON.parse(w.localStorage.getItem('goal_pulse_state_v1'));
  assert.deepEqual(saved.watches.map(x => x.eventTitle), ['Event Alpha', 'Event Alpha', 'Event Beta']);
  assert.equal(saved.watches.length, 3);
  assert.ok(d.querySelector('[data-select-market="b1"]').disabled);
  click('#selectVisibleBtn');
  assert.match(d.querySelector('#addSelectedBtn').textContent, /1/);
  click('#addSelectedBtn');
  assert.equal(d.querySelectorAll('.watch-card').length, 4);
  assert.ok(d.querySelector('#addSelectedBtn').disabled);
});

test('mobile history returns one step, keeps filter and selections, and closes to board', async t => {
  const {d,w,click,selectEvent,select,input,requests} = await boot(t, {mobile:true});
  click('#openBrowserBtn'); await selectEvent(0); select('a1'); input('#marketSearchInput', 'first');
  const before = requests.length;
  click('#backToEventsBtn'); await tick();
  assert.equal(d.querySelector('#browserBody').classList.contains('show-markets'), false);
  await selectEvent(0);
  assert.equal(d.querySelector('#marketSearchInput').value, 'first');
  assert.equal(requests.length, before, 'same event should not reload and lose its context');
  assert.match(d.querySelector('#selectionStatus').textContent, /1 market/);
  click('#closeBrowserBtn'); await tick();
  assert.equal(d.querySelector('#marketBrowser').open, false);
  assert.equal(d.activeElement.id, 'openBrowserBtn');
  click('#openBrowserBtn');
  assert.match(d.querySelector('#selectionStatus').textContent, /1 market/);
  w.history.back(); await tick();
  assert.equal(d.querySelector('#browserBody').classList.contains('show-markets'), false);
  w.history.back(); await tick();
  assert.equal(d.querySelector('#marketBrowser').open, false);
});

test('a slow prior event cannot overwrite a newer event', async t => {
  const {d,click,selectEvent,hold} = await boot(t);
  click('#openBrowserBtn'); const release = hold('alpha');
  click('[data-event-index="0"]'); await selectEvent(1);
  assert.match(d.querySelector('#selectedEvent').textContent, /Event Beta/);
  release(); await tick();
  assert.match(d.querySelector('#selectedEvent').textContent, /Event Beta/);
  assert.equal(d.querySelectorAll('[data-select-market]').length, 2);
  assert.ok(d.querySelector('[data-select-market="b1"]'));
});

test('event failure removes stale controls and retry recovers', async t => {
  const {d,click,selectEvent,failures} = await boot(t);
  click('#openBrowserBtn'); await selectEvent(0);
  failures.add('beta'); await selectEvent(1);
  assert.equal(d.querySelectorAll('[data-select-market]').length, 0);
  assert.equal(d.querySelector('#marketTools').hidden, true);
  assert.ok(d.querySelector('#retryEventBtn'));
  failures.delete('beta'); click('#retryEventBtn'); await tick();
  assert.match(d.querySelector('#selectedEvent').textContent, /Event Beta/);
  assert.ok(d.querySelector('[data-select-market="b1"]'));
});

test('filter empty state, 100 markets, and three-outcome batches work', async t => {
  const {d,click,selectEvent,input,w} = await boot(t);
  click('#openBrowserBtn'); await selectEvent(2);
  assert.equal(d.querySelectorAll('[data-select-market]').length, 100);
  assert.equal(d.querySelector('.market-outcomes').children.length, 3);
  input('#marketSearchInput', 'not-a-result');
  assert.equal(d.querySelectorAll('[data-select-market]').length, 0);
  assert.ok(d.querySelector('#selectVisibleBtn').disabled);
  input('#marketSearchInput', 'Question 99:'); click('#selectVisibleBtn');
  assert.match(d.querySelector('#selectionStatus').textContent, /1 market/);
  click('#addSelectedBtn');
  assert.equal(JSON.parse(w.localStorage.getItem('goal_pulse_state_v1')).watches[0].outcomes.length, 3);
});

test('alert interrupts discovery and resumes with pending selections intact', async t => {
  const {d,click,selectEvent,select} = await boot(t);
  click('#openBrowserBtn'); await selectEvent(0); select('a1');
  click('#testAlertBtn');
  assert.equal(d.querySelector('#marketBrowser').open, false);
  assert.equal(d.querySelector('#alertOverlay').classList.contains('show'), true);
  assert.equal(d.activeElement.id, 'alertClose');
  click('#alertClose');
  assert.equal(d.querySelector('#marketBrowser').open, true);
  assert.equal(d.querySelector('#alertOverlay').classList.contains('show'), false);
  assert.match(d.querySelector('#selectionStatus').textContent, /1 market/);
});

test('restored monitors survive startup and language changes cover discovery', async t => {
  const saved = { watches: [{id:'a1',marketSlug:'a1',eventSlug:'alpha',eventTitle:'Event Alpha',marketQuestion:'Alpha first?',tokenIds:['a1-0','a1-1'],outcomes:['Yes','No'],lastPrices:[.5,.5]}] };
  const {d,w,click,selectEvent} = await boot(t, {saved});
  assert.equal(d.querySelectorAll('.watch-card').length, 1);
  const lang = d.querySelector('#langSelect'); lang.value = 'zh'; lang.dispatchEvent(new w.Event('change'));
  click('#openBrowserBtn'); await selectEvent(0);
  assert.equal(d.querySelector('#browserTitle').textContent, '添加监听');
  assert.match(d.querySelector('#marketTools').textContent, /包含全部结果/);
  assert.match(d.querySelector('#watchCount').textContent, /1 个盘口/);
  assert.equal(d.querySelector('[data-select-market="a1"]').textContent, '已监听');
});

test('untrusted event and market labels remain text', async t => {
  const events = fixtures(); events.alpha.title = '<img src=x onerror=alert(1)>'; events.alpha.markets[0].question = '<script>alert(1)</script>';
  const {d,click,selectEvent} = await boot(t, {events});
  click('#openBrowserBtn'); await selectEvent(0);
  assert.equal(d.querySelector('#results img'), null);
  assert.equal(d.querySelector('#markets script'), null);
  assert.match(d.querySelector('#selectedEvent').textContent, /<img/);
});

test('sports 1X2 combined monitor remains available only for matching events', async t => {
  const events = { sport: { id:'s', slug:'sport', title:'Alpha vs. Beta', markets: [
    market('home', 'Will Alpha win on 2026-11-02?'),
    market('draw', 'Will Alpha vs. Beta end in a draw?'),
    market('away', 'Will Beta win on 2026-11-02?')
  ]}};
  const {d,w,click,selectEvent} = await boot(t, {events});
  click('#openBrowserBtn'); await selectEvent(0);
  assert.ok(d.querySelector('[data-add-match-strip]'));
  click('[data-add-match-strip]');
  const saved = JSON.parse(w.localStorage.getItem('goal_pulse_state_v1'));
  assert.equal(saved.watches[0].type, 'match-strip');
  assert.deepEqual(saved.watches[0].outcomes, ['Alpha','Draw','Beta']);
  assert.equal(d.querySelector('[data-add-match-strip]'), null);
});

test('search no-results and network failure leave a usable retry entry', async t => {
  const {d,w,click} = await boot(t);
  click('#openBrowserBtn');
  d.querySelector('#searchInput').value = 'empty';
  d.querySelector('#eventSearchForm').dispatchEvent(new w.Event('submit', {bubbles:true,cancelable:true}));
  await tick();
  assert.equal(d.querySelectorAll('[data-event-index]').length, 0);
  assert.match(d.querySelector('#results').textContent, /No events found/);
  w.fetch = async () => { throw new Error('offline'); };
  d.querySelector('#searchInput').value = 'anything';
  d.querySelector('#eventSearchForm').dispatchEvent(new w.Event('submit', {bubbles:true,cancelable:true}));
  await tick();
  assert.match(d.querySelector('#results').textContent, /Search failed/);
  assert.equal(d.querySelector('#searchBtn').disabled, false);
  assert.equal(d.querySelector('#results').getAttribute('aria-busy'), 'false');
});

test('reopening a failed event cannot expose the prior event markets', async t => {
  const {d,click,selectEvent,failures} = await boot(t);
  click('#openBrowserBtn'); await selectEvent(0);
  failures.add('beta'); await selectEvent(1);
  click('#closeBrowserBtn'); await tick(); click('#openBrowserBtn');
  assert.ok(d.querySelector('#retryEventBtn'));
  assert.equal(d.querySelectorAll('[data-select-market]').length, 0);
  await selectEvent(0);
  assert.match(d.querySelector('#selectedEvent').textContent, /Event Alpha/);
  assert.ok(d.querySelector('[data-select-market="a1"]'));
});

test('refresh calibration restores event identity from each source rather than the browsed event', async t => {
  const events = fixtures();
  const watch = (slug, eventSlug) => ({ id:slug,marketSlug:slug,eventSlug,eventTitle:'Incorrect old title',marketQuestion:slug,tokenIds:[`${slug}-0`,`${slug}-1`],outcomes:['Yes','No'],lastPrices:[.5,.5] });
  const saved = { selectedEvent: events.beta, watches: [watch('a1','alpha'), watch('b1','beta')] };
  const {d,w} = await boot(t,{events,saved});
  const titles = [...d.querySelectorAll('.watch-name')].map(el => el.textContent);
  assert.deepEqual(titles, ['Event Alpha','Event Beta']);
  assert.deepEqual(JSON.parse(w.localStorage.getItem('goal_pulse_state_v1')).watches.map(x=>x.eventTitle), titles);
  assert.equal(d.querySelector('#headline').textContent, 'Your watchlist');
});
