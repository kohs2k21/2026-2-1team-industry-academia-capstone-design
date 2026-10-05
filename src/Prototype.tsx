import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, UsersIcon, CoinsIcon, CaretRightIcon, BookmarkSimpleIcon, SparkleIcon, ArrowsClockwiseIcon, CaretDownIcon, CaretUpIcon, CheckIcon, DotsThreeVerticalIcon, GearSixIcon, ListIcon, MicrophoneIcon, TriangleIcon, XIcon } from '@phosphor-icons/react';
import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/500.css';
import '@fontsource/noto-sans-kr/700.css';
import '@fontsource/noto-serif-kr/700.css';
import { BottomSheet, KeyboardTextarea, MobileScroll, useKeyboardInsets, useKeyboard, useMobileDevice } from './mobile';

const accountOptions = ['1234-5678 [위탁종합] 김철수', '1234-0000 [종합매매] 김철수'];
const topTabs = ['국내잔고', '미체결', '예수금', '주문가능금액'];
const bottomTabs = ['관심종목', '현재가', '주문', '차트', '계좌', '종합'];
type Sheet = 'account' | 'notice' | 'tools' | 'menu' | 'settings' | 'ranking' | 'overseas' | 'sell' | 'chat' | null;

export default function Prototype() {
  const [landingOpen, setLandingOpen] = useState(false);
  const keyboard = useKeyboard();
  const { device } = useMobileDevice();
  const aiButtonRef = useRef<HTMLButtonElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const hasNavigated = useRef(false);
  useEffect(() => {
    if (landingOpen) backButtonRef.current?.focus({ preventScroll: true });
    else if (hasNavigated.current) aiButtonRef.current?.focus({ preventScroll: true });
  }, [landingOpen]);
  const [topTab, setTopTab] = useState('국내잔고');
  const [balanceTab, setBalanceTab] = useState('키움 잔고');
  const [account, setAccount] = useState(accountOptions[0]);
  const [expanded, setExpanded] = useState(true);
  const [credit, setCredit] = useState('융자별');
  const [rows, setRows] = useState(2);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState('');
  const [sort, setSort] = useState('');
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { bottomInset } = useKeyboardInsets();
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); if (refreshTimer.current) clearTimeout(refreshTimer.current); }, []);
  function notify(message: string) {
    setToast(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2100);
  }
  function refresh() {
    if (refreshing) return;
    setRefreshing(true);
    refreshTimer.current = setTimeout(() => { setRefreshing(false); notify('잔고를 새로고침했습니다.'); }, 650);
  }
  function selectTop(value: string) { setTopTab(value); setSheet(null); }
  const titles: Record<Exclude<Sheet, null>, string> = { account: '계좌 선택', notice: '잔고 조회 유의사항', tools: '투자도구', menu: '전체 메뉴', settings: '잔고 화면 설정', ranking: 'MY랭킹', overseas: '해외 잔고', sell: '일괄매도', chat: '지수 채팅' };
  const indices = [{ name: '나스닥', value: '27,068.72' }, { name: '코스피', value: '2,650.00' }, { name: '코스닥', value: '780.00' }];
  function openLanding() {
    keyboard.hide();
    setSheet(null);
    setToast('');
    hasNavigated.current = true;
    setLandingOpen(true);
  }
  if (landingOpen) return <ConfessionLanding backButtonRef={backButtonRef} onBack={() => { keyboard.hide(); setLandingOpen(false); }} />;
  return (
    <>
    <main className="kiwoom" aria-label="키움증권 국내잔고 목업">
      <header className="main-header">
        <button className="back icon-button" aria-label="이전 화면" onClick={() => { selectTop('국내잔고'); setBalanceTab('키움 잔고'); }}><ArrowLeftIcon size={29} weight="thin" /></button>
        <nav className="top-tabs" aria-label="계좌 메뉴">
          {topTabs.map((label) => <button key={label} className={topTab === label ? 'active' : ''} aria-current={topTab === label ? 'page' : undefined} onClick={() => selectTop(label)}>{label === '국내잔고' && <MicrophoneIcon className="voice-icon" size={12} weight="light" />}{label}</button>)}
        </nav>
        <button className="more icon-button" aria-label="더보기" onClick={() => setSheet('menu')}><DotsThreeVerticalIcon size={29} weight="bold" /></button>
      </header>
      <div className="balance-tabs" role="tablist" aria-label="잔고 구분">
        {['키움 잔고', '타사 잔고'].map(label => <button key={label} role="tab" aria-selected={balanceTab === label} className={balanceTab === label ? 'selected' : ''} onClick={() => setBalanceTab(label)}>{label}</button>)}
      </div>
      <button className="edge-handle" aria-label="빠른 메뉴" onClick={() => setSheet('menu')} />
      <div className="account-toolbar">
        <button className="outline notice" onClick={() => setSheet('notice')}>유의</button>
        <button className="outline account-selector" aria-label={`계좌 선택: ${account}`} onClick={() => setSheet('account')}><span>{account}</span><CaretDownIcon size={13} weight="light" /></button>
        <button className="outline refresh" aria-label="잔고 새로고침" aria-busy={refreshing} onClick={refresh}><ArrowsClockwiseIcon className={refreshing ? 'spinning' : ''} size={26} weight="thin" /></button>
        <button className="outline overseas" onClick={() => setSheet('overseas')}>해외<br />잔고</button>
      </div>
      {topTab === '국내잔고' && balanceTab === '키움 잔고' ? <>
        <section className="balance-card" aria-label="계좌 잔고 요약">
          <button className="profit-row" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}><strong>총 손익</strong><b>0원</b><span>0.00%</span>{expanded ? <CaretUpIcon size={14} weight="light" /> : <CaretDownIcon size={14} weight="light" />}</button>
          {expanded && <div className="balance-details"><div><span>총 매입</span><span>0</span><span>실현손익</span><span>0</span></div><div><span>총 평가</span><span>0</span><button className="estimated" onClick={() => notify('추정자산 0원')}><span>추정자산</span><ArrowsClockwiseIcon size={15} weight="light" /></button><span /></div></div>}
          <button className="ranking" onClick={() => setSheet('ranking')}><span>MY랭킹</span><strong>월 수익률 순위 조회 (키움전체)</strong><ArrowsClockwiseIcon size={16} weight="light" /></button>
        </section>
        <div className="investment-toolbar">
          <button className="outline tools" onClick={() => setSheet('tools')}><img src="/assets/kiwoom/investment-tools.png" alt="" draggable={false} /><strong>투자도구</strong></button>
          <button className="outline sell" onClick={() => setSheet('sell')}>일괄매도</button>
          <div className="credit-toggle" aria-label="융자 표시 방식">{['융자별', '융자합'].map(label => <button key={label} className={credit === label ? 'selected' : ''} aria-pressed={credit === label} onClick={() => setCredit(label)}>{label}</button>)}</div>
          <button className="outline row-toggle" onClick={() => setRows(rows === 2 ? 1 : 2)} aria-label={`${rows}줄 보기, 전환`}>{rows}줄 <span className="row-dots"><span className={rows === 2 ? 'on' : ''} /><span className={rows === 1 ? 'on' : ''} /></span></button>
        </div>
        <div className={`holdings-header ${rows === 1 ? 'single-row' : ''}`} role="table" aria-label="보유종목">
          <button className="table-settings icon-button" aria-label="잔고 화면 설정" onClick={() => setSheet('settings')}><GearSixIcon size={16} weight="fill" /></button>
          <div role="row" className="table-columns">
            {['종목명', rows === 2 ? '매입가|현재가' : '현재가', rows === 2 ? '보유수량|가능수량' : '보유수량', rows === 2 ? '평가손익|수익률' : '평가손익'].map(label => <button role="columnheader" aria-sort={sort === label ? 'ascending' : 'none'} key={label} onClick={() => { setSort(sort === label ? '' : label); notify(`${label.split('|')[0]} 정렬 ${sort === label ? '해제' : '선택'}`); }}>{label.split('|').map((line, i) => <span key={line}>{line}<TriangleIcon size={9} weight="fill" className={`sort-mark ${sort === label ? 'sorted' : ''}`} style={{ bottom: i === 0 && label.includes('|') ? '50%' : 0 }} /></span>)}</button>)}
          </div>
          <button className="next-columns icon-button" aria-label="추가 잔고 항목" onClick={() => setSheet('settings')}><TriangleIcon size={12} weight="fill" /></button>
        </div>
        <MobileScroll className="holdings-scroll"><div className="empty-holdings" aria-label="보유종목 없음" /></MobileScroll>
      </> : <MobileScroll className="alternate-scroll"><section className="alternate-content" aria-label={topTab}>
        {balanceTab === '타사 잔고' ? <><h2>타사 잔고</h2><p>연결된 타사 계좌가 없습니다.</p><button className="sheet-primary" onClick={() => notify('계좌 연결은 시연용 화면에서 제공하지 않습니다.')}>계좌 연결</button></> : topTab === '미체결' ? <><div className="simple-table"><span>종목명</span><span>주문수량</span><span>미체결수량</span></div><p>미체결 내역이 없습니다.</p></> : <><h2>{topTab}</h2>{(topTab === '예수금' ? ['예수금', 'D+1 추정예수금', 'D+2 추정예수금', '출금가능금액'] : ['현금주문가능금액', '증거금 100% 주문가능', '신용주문가능금액']).map(label => <div className="amount-line" key={label}><span>{label}</span><strong>0원</strong></div>)}</>}
      </section></MobileScroll>}
      <footer className="app-footer">
        <div className="market-strip"><button className="index-chat" onClick={() => setSheet('chat')}><b>지수</b><span>채팅</span></button><button className="market-values" aria-label="시장 지수 변경" onClick={() => setIndex((index + 1) % indices.length)}><span>{indices[index].name}</span><span>{indices[index].value}</span><span>0.00</span><span>0.00%</span></button></div>
        <nav className="bottom-nav" aria-label="하단 메뉴"><button className="menu-button" onClick={() => setSheet('menu')}><ListIcon size={29} weight="light" /><strong>메뉴</strong></button>{bottomTabs.map(label => <button key={label} className={label === '계좌' ? 'active' : ''} aria-current={label === '계좌' ? 'page' : undefined} onClick={() => { if (label === '계좌') { selectTop('국내잔고'); setBalanceTab('키움 잔고'); } else { notify(`${label} 화면은 다음 단계에서 연결됩니다.`); } }}>{label}</button>)}</nav>
      </footer>
      {toast && <div className="toast" role="status" style={{ bottom: bottomInset + 118 }}>{toast}</div>}
      <BottomSheet open={sheet !== null} onOpenChange={open => { if (!open) setSheet(null); }} title={sheet ? titles[sheet] : ''} description="시연용 가상 계좌 · 실제 거래 및 데이터 연결 없음" snap={sheet === 'menu' ? 0.66 : 0.49}>
        <div className="kiwoom-sheet"><button className="sheet-close icon-button" aria-label="닫기" onClick={() => setSheet(null)}><XIcon size={21} /></button>
          {sheet === 'account' && accountOptions.map(value => <button className="sheet-option" key={value} onClick={() => { setAccount(value); setSheet(null); }}><span>{value}</span>{account === value && <CheckIcon size={19} />}</button>)}
          {sheet === 'notice' && <><p>잔고 및 평가금액은 조회 시점에 따라 달라질 수 있습니다.</p><p>이 화면의 계좌, 잔고와 지수는 프로토타입 시연용 가상 정보입니다.</p><button className="sheet-primary" onClick={() => setSheet(null)}>확인</button></>}
          {sheet === 'menu' && <><div className="sheet-account">김철수님 <small>1234-5678</small></div>{topTabs.map(label => <button className="sheet-option" key={label} onClick={() => { selectTop(label); setBalanceTab('키움 잔고'); }}><span>{label}</span><CaretDownIcon size={15} className="point-right" /></button>)}</>}
          {sheet === 'settings' && <><div className="setting-line"><span>잔고 표시</span><div>{[1, 2].map(value => <button key={value} aria-pressed={rows === value} className={rows === value ? 'chosen' : ''} onClick={() => setRows(value)}>{value}줄</button>)}</div></div><div className="setting-line"><span>융자 표시</span><div>{['융자별', '융자합'].map(value => <button key={value} aria-pressed={credit === value} className={credit === value ? 'chosen' : ''} onClick={() => setCredit(value)}>{value}</button>)}</div></div><button className="sheet-primary" onClick={() => setSheet(null)}>적용</button></>}
          {sheet === 'tools' && ['수익률 계산기', '관심종목 등록', '잔고 화면 설정'].map(label => <button className="sheet-option" key={label} onClick={() => label === '잔고 화면 설정' ? setSheet('settings') : notify('보유종목이 없어 사용할 수 없습니다.')}><span>{label}</span><CaretDownIcon size={15} className="point-right" /></button>)}
          {sheet === 'ranking' && <><p>월 수익률 순위 조회 (키움전체)</p><div className="sheet-empty">수익률 순위 정보가 없습니다.</div><button className="sheet-primary" onClick={() => setSheet(null)}>확인</button></>}
          {sheet === 'overseas' && <><div className="amount-line"><span>총 평가금액</span><strong>0원</strong></div><div className="sheet-empty">보유 중인 해외 종목이 없습니다.</div><button className="sheet-primary" onClick={() => setSheet(null)}>국내잔고로 돌아가기</button></>}
          {sheet === 'sell' && <><div className="sheet-empty">매도 가능한 보유종목이 없습니다.</div><button className="sheet-primary" onClick={() => setSheet(null)}>확인</button></>}
          {sheet === 'chat' && <><div className="sheet-option"><span>{indices[index].name}</span><strong>{indices[index].value}</strong></div><div className="sheet-empty">표시할 대화가 없습니다.</div><button className="sheet-primary" onClick={() => setSheet(null)}>닫기</button></>}
        </div>
      </BottomSheet>
    </main>
    <button
      ref={aiButtonRef}
      className="ai-launcher"
      aria-label="AI 고해성사 열기"
      // The footer is 8cqw (market strip) + 25.3cqw (navigation).
      style={{ bottom: device.geometry.screen.width * 0.333 + 12 }}
      onClick={openLanding}
    >
      <span className="ai-launcher-icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-message-ai">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M8 9h8" />
          <path d="M8 13h3.5" />
          <path d="M9.994 19.804l-1.994 1.196v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4" />
          <path d="M14 21v-4a2 2 0 1 1 4 0v4" />
          <path d="M14 19h4" />
          <path d="M21 15v6" />
        </svg>
      </span>
    </button>
    </>
  );
}


type ConfessionTopic = 'follow' | 'average';
const confessionTopics = [
  { id: 'follow' as const, label: '매수 타이밍이 고민돼요', lines: ['매수 타이밍이', '고민돼요'], Icon: UsersIcon },
  { id: 'average' as const, label: '추가 매수 기준이 궁금해요', lines: ['추가 매수 기준이', '궁금해요'], Icon: CoinsIcon },
];
const demoTrades = [
  { name: '한빛테크', detail: '9월 30일 · 10주 매수', fact: '당일 12.4% 오른 뒤 매수', topic: 'follow' as const },
  { name: '새봄에너지', detail: '9월 29일 · 5주 추가 매수', fact: '보유 중인 종목을 추가 매수', topic: 'average' as const },
];

// Each visual section owns its markup; Reveal animates the section, never individual letters.
function ConfessionReveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return <div className={`confession-reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>{children}</div>;
}

function ConfessionBackdrop({ onReady }: { onReady: () => void }) {
  return <img className="confession-art" src="/assets/kiwoom/confession-chapel.png" alt="" aria-hidden="true" draggable={false} onLoad={onReady} onError={onReady} />;
}

function ConfessionTitle() {
  return <ConfessionReveal className="confession-heading"><h1>평안이 함께하길,<br /><em>마음을 고백하세요.</em></h1></ConfessionReveal>;
}

function ConfessionDescription() {
  return <ConfessionReveal className="confession-description" delay={120}><p>AI와의 채팅으로 지난 투자를 돌아보고,<br />나만의 투자 기준을 세워보세요.</p></ConfessionReveal>;
}

function ConfessionMascot({ onReady }: { onReady: () => void }) {
  return <ConfessionReveal className="confession-mascot" delay={240}><img src="/assets/kiwoom/confession-angel.png" alt="날개와 후광이 있는 분홍 천사가 두 손을 모으고 미소 짓고 있습니다." draggable={false} onLoad={onReady} onError={onReady} /></ConfessionReveal>;
}

function ConfessionGreeting() {
  return <ConfessionReveal className="confession-greeting" delay={360}><p>선택의 이유를 나누며<br />나만의 기준을 찾아봐요.</p></ConfessionReveal>;
}

function ConfessionTopicPicker({ topic, onSelect }: { topic: ConfessionTopic | null; onSelect: (topic: ConfessionTopic | null) => void }) {
  return <div className="confession-topics" role="group" aria-label="고백 주제 선택">
    {confessionTopics.map(({ id, label, lines, Icon }, index) => <ConfessionReveal key={id} delay={480 + index * 80}>
      <button className={`confession-topic ${topic === id ? 'is-selected' : ''}`} aria-label={label} aria-pressed={topic === id} onClick={() => onSelect(topic === id ? null : id)}>
        <span className="confession-topic-icon"><Icon size={24} weight="fill" /></span>
        <span>{lines[0]}<br />{lines[1]}</span>
        {topic === id ? <CheckIcon size={17} /> : <CaretRightIcon size={17} />}
      </button>
    </ConfessionReveal>)}
  </div>;
}

function ConfessionMotto() {
  return <ConfessionReveal className="confession-motto" delay={620}><p>오늘의 고백이 내일의 다짐이 되기를.</p><span><SparkleIcon size={14} /></span></ConfessionReveal>;
}

function ConfessionActions({ primaryRef, onStart, onRecords, onSaved, hasSaved }: {
  primaryRef: RefObject<HTMLButtonElement | null>; onStart: () => void; onRecords: () => void; onSaved: () => void; hasSaved: boolean;
}) {
  return <div className="confession-actions">
    <ConfessionReveal delay={700}><button ref={primaryRef} className="confession-primary" onClick={onStart}>나의 투자 돌아보기<ArrowRightIcon size={25} weight="light" /></button></ConfessionReveal>
    <ConfessionReveal delay={780}><button className="confession-records" onClick={onRecords}>매매 기록부터 돌아보기</button></ConfessionReveal>
    {hasSaved && <button className="confession-saved-link" onClick={onSaved}><BookmarkSimpleIcon size={15} weight="fill" /> 남겨둔 투자 원칙 보기</button>}
  </div>;
}

function ConfessionLanding({ onBack, backButtonRef }: { onBack: () => void; backButtonRef: RefObject<HTMLButtonElement | null> }) {
  const keyboard = useKeyboard();
  const [topic, setTopic] = useState<ConfessionTopic | null>(null);
  const [panel, setPanel] = useState<'chat' | 'trades' | null>(null);
  const [trade, setTrade] = useState<string | null>(null);
  const [savedPrinciple, setSavedPrinciple] = useState('');
  const [backdropReady, setBackdropReady] = useState(false);
  const [mascotReady, setMascotReady] = useState(false);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const [showSaved, setShowSaved] = useState(false);
  function closePanel() { keyboard.hide(); setPanel(null); }
  const previousPanel = useRef(panel);
  useEffect(() => {
    if (previousPanel.current !== null && panel === null) backButtonRef.current?.focus({ preventScroll: true });
    previousPanel.current = panel;
  }, [panel, backButtonRef]);
  function start(selectedTopic = topic, selectedTrade: string | null = null) {
    keyboard.hide(); setTopic(selectedTopic); setTrade(selectedTrade); setShowSaved(false); setPanel('chat');
  }
  return <>
  <main className="kiwoom ai-landing confession-landing" aria-label="AI 고해성사 랜딩페이지" data-covered={panel === 'chat'} aria-hidden={panel === 'chat'} inert={panel === 'chat'}>
    <MobileScroll className="confession-scroll">
      <div className="confession-scene" data-ready={backdropReady && mascotReady}>
        <ConfessionBackdrop onReady={() => setBackdropReady(true)} />
        <ConfessionTitle />
        <ConfessionDescription />
        <ConfessionMascot onReady={() => setMascotReady(true)} />
        <ConfessionGreeting />
        <ConfessionTopicPicker topic={topic} onSelect={value => { setTopic(value); setTrade(null); }} />
        <ConfessionMotto />
        <ConfessionActions primaryRef={primaryRef} onStart={() => start()}
          onRecords={() => { keyboard.hide(); setPanel('trades'); }}
          onSaved={() => { keyboard.hide(); setShowSaved(true); setPanel('chat'); }} hasSaved={!!savedPrinciple} />
      </div>
    </MobileScroll>
    <header className="confession-header">
      <button ref={backButtonRef} className="icon-button" aria-label="뒤로가기" onClick={onBack}><ArrowLeftIcon size={28} weight="light" /></button>
      <span>투자 고해성사</span>
    </header>
    <BottomSheet open={panel === 'trades'} onOpenChange={open => { if (!open) closePanel(); }} title="마음에 남은 거래가 있나요?" description="시연용 예시 · 실제 매매 데이터 연결 없음" snap={0.75}>
      <div className="confession-sheet">
        <button className="confession-sheet-close" aria-label="닫기" onClick={closePanel}><XIcon size={20} /></button>
        <p className="confession-sheet-intro">마음에 남은 선택을 함께 돌아보겠습니다.<br />그때의 마음을 편안하게 들려주세요.</p>
        {demoTrades.map(item => <button className="confession-trade" key={item.name} onClick={() => start(item.topic, item.name)}><span className="confession-example">예시 거래</span><strong>{item.name}<CaretRightIcon size={18} /></strong><span>{item.detail}</span><small>{item.fact}</small></button>)}
      </div>
    </BottomSheet>
  </main>
  {panel === 'chat' && <ConfessionChat topic={topic} trade={trade} onBack={closePanel}
    initialPrinciple={showSaved ? savedPrinciple : ''} onSave={setSavedPrinciple} />}
  </>;
}

type ConfessionMessage = { id: number; role: 'ai' | 'user'; text: string; principle?: string };

function ConfessionThinking() {
  return <div className="chat-thinking" role="status" aria-live="polite">
    <div className="chat-thinking-orbit" aria-hidden="true"><SparkleIcon size={25} weight="fill" /></div>
    <strong>키움 AI가 생각하는 중<span className="chat-typing-dots" aria-hidden="true"><i /><i /><i /></span></strong>
    <p>이야기 속에서 나만의 투자 기준을 찾고 있어요.</p>
  </div>;
}

function ConfessionChat({ topic, trade, onBack, onSave, initialPrinciple }: {
  topic: ConfessionTopic | null; trade: string | null; onBack: () => void; onSave: (value: string) => void; initialPrinciple: string;
}) {
  const keyboard = useKeyboard();
  const { bottomInset, keyboardDragging } = useKeyboardInsets();
  const { device } = useMobileDevice();
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [saved, setSaved] = useState(initialPrinciple);
  const [messages, setMessages] = useState<ConfessionMessage[]>(() => [{ id: 0, role: 'ai',
    text: initialPrinciple ? '지난 대화에서 남겨둔 투자 원칙이에요. 더 이야기하고 싶은 점이 있나요?'
      : `${trade ? `${trade} 거래를 함께 돌아볼게요.` : topic ? `${topic === 'average' ? '추가 매수 기준' : '매수 타이밍'}에 대해 이야기해 볼까요?` : '안녕하세요. 투자 고해성사에 오신 걸 환영해요.'}\n선택의 이유를 돌아보며 나만의 투자 기준을 함께 정리해 봐요. 최근 매수할 때 어떤 마음이었나요?`,
    principle: initialPrinciple || undefined,
  }]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);
  const nextId = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const suggestions = topic === 'average'
    ? ['처음 세운 계획에 따른 추가 매수였어요', '평균 매수가를 낮추고 싶었어요', '다시 오를 것 같아 급하게 샀어요']
    : ['놓치면 후회할 것 같았어요', '제 기준에 맞는지 먼저 확인했어요', '주변에서 좋다고 해서 샀어요'];
  useEffect(() => {
    backRef.current?.focus({ preventScroll: true });
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);
  useEffect(() => {
    const scroll = endRef.current?.closest('.mobile-scroll');
    scroll?.scrollTo({ top: scroll.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [messages, thinking]);
  function submit() {
    const text = draft.trim();
    if (!text || busy.current) return;
    keyboard.hide(); busy.current = true; setThinking(true); setDraft('');
    setMessages(current => [...current, { id: nextId.current++, role: 'user', text }]);
    // Frontend-only demo latency; cancel on unmount. No real AI request is sent.
    timer.current = setTimeout(() => {
      const principle = /계획|기준/.test(text)
        ? '매수하기 전, 내 기준에 맞는 이유를 한 줄로 남기기.'
        : topic === 'average' || /추가|평균|물타기/.test(text)
          ? '추가 매수 전, 처음 투자한 이유가 여전히 유효한지 확인하기.'
          : '매수하기 전, 내가 사려는 이유와 감당할 수 있는 손실 범위를 적기.';
      setMessages(current => [...current, { id: nextId.current++, role: 'ai',
        text: '이야기해 주셔서 고마워요. 다음 선택 전에 확인할 기준을 하나 정리해 봤어요. 나에게 맞는지 살펴보고, 바꾸고 싶은 점도 이야기해 주세요.', principle }]);
      busy.current = false; setThinking(false); timer.current = null;
    }, 2400);
  }
  return <main className="kiwoom confession-chat" aria-label="투자 고해성사 AI 채팅">
    <header className="chat-header" style={{ paddingTop: device.geometry.safeArea.top }}>
      <button ref={backRef} className="icon-button" aria-label="고해성사 랜딩으로 돌아가기" onClick={() => { keyboard.hide(); onBack(); }}><ArrowLeftIcon size={24} /></button>
      <div><strong>투자 고해성사</strong><span><i />키움 AI와 함께 만드는 나만의 기준</span></div>
    </header>
    <MobileScroll className="chat-scroll">
      <div className="chat-history" style={{ paddingTop: device.geometry.safeArea.top + 84 }}>
        <p className="chat-demo-note">프로토타입 · AI 응답은 시연용 예시입니다</p>
        <div className="chat-messages" role="log" aria-label="AI와의 대화" aria-live="polite" aria-relevant="additions">
          {messages.map(message => <div key={message.id} className={`chat-message chat-message-${message.role}`}>
            {message.role === 'ai' && <span className="chat-author"><SparkleIcon size={16} weight="fill" />키움 AI</span>}
            <div className="chat-bubble"><p>{message.text}</p>
              {message.principle && <div className="chat-principle"><span>나를 위한 투자 기준</span><strong>{message.principle}</strong>
                <button disabled={saved === message.principle} onClick={() => { setSaved(message.principle!); onSave(message.principle!); }}>
                  {saved === message.principle ? <><CheckIcon size={17} />나의 원칙으로 저장했어요</> : <><BookmarkSimpleIcon size={17} />나의 투자 원칙으로 남기기</>}
                </button>
              </div>}
            </div>
          </div>)}
        </div>
        {messages.length === 1 && !initialPrinciple && <div className="chat-suggestions" role="group" aria-label="추천 답변">
          <p>가까운 답변을 고르거나 직접 입력해 주세요</p>
          {suggestions.map(value => <button key={value} aria-pressed={draft === value} className={draft === value ? 'is-selected' : ''} onClick={() => { keyboard.hide(); setDraft(value); }}>{value}{draft === value && <CheckIcon size={16} />}</button>)}
        </div>}
        {thinking && <ConfessionThinking />}
        <div ref={endRef} />
      </div>
    </MobileScroll>
    <form className="chat-composer" style={{ bottom: bottomInset, transition: keyboardDragging ? 'none' : undefined }} onSubmit={event => { event.preventDefault(); submit(); }}>
      <div className="chat-input-wrap"><KeyboardTextarea aria-label="투자 이야기 직접 입력" placeholder="그때의 생각을 자유롭게 적어주세요" rows={2} maxLength={500} value={draft}
        onChange={event => setDraft(event.target.value)} onBlur={() => keyboard.hide()}
        onKeyDown={event => { if (event.key === 'Escape') { keyboard.hide(); return; } if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(); } }} />
      </div>
      <div className="chat-composer-actions"><span>{draft.length}/500</span><button type="submit" onPointerDown={event => { if (event.button === 0) event.preventDefault(); }} disabled={!draft.trim() || thinking}>{thinking ? '생각하는 중…' : messages.length === 1 ? '이 이야기로 돌아보기' : '보내기'}<ArrowRightIcon size={18} /></button></div>
    </form>
  </main>;
}
