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

type PrincipleCategory = 'follow' | 'rush' | 'missing' | 'confidence' | 'recovery' | 'concentration' | 'none' | 'unsure';
const principleCategories: { id: PrincipleCategory; name: string; description: string; principle: string }[] = [
  { id: 'follow', name: '뇌동매매죄', description: '다른 사람의 추천이 내 판단을 대신했던 선택이에요.', principle: '추천을 받아도 내 매수 이유를 먼저 적기.' },
  { id: 'rush', name: '조급매수죄', description: '기회를 놓칠까 하는 조급함이 선택을 앞섰어요.', principle: '매수 전에 선택의 이유를 한 문장으로 정리하기.' },
  { id: 'missing', name: '기준실종죄', description: '매수나 재검토를 위한 나만의 기준이 아직 없었어요.', principle: '매수 전에 투자 이유와 재검토할 조건을 정하기.' },
  { id: 'confidence', name: '확신과잉죄', description: '내 예상과 다른 근거를 충분히 살피지 않았어요.', principle: '결정 전에 내 예상과 반대되는 근거 하나 확인하기.' },
  { id: 'recovery', name: '손실만회죄', description: '이전 손실을 만회하고 싶은 마음이 다음 거래에 영향을 줬어요.', principle: '다음 거래의 이유를 이전 손실과 분리해서 적기.' },
  { id: 'concentration', name: '집중과잉죄', description: '미리 정한 비중보다 한 종목에 더 집중했던 선택이에요.', principle: '추가 매수 전에 현재 비중과 내가 정한 기준 확인하기.' },
  { id: 'none', name: '기준을 지킨 선택', description: '미리 세운 기준과 확인한 근거에 따라 선택했어요. 억지로 죄를 붙이지 않아요.', principle: '매수 전에 세운 기준과 판단 근거를 계속 기록하기.' },
  { id: 'unsure', name: '조금 더 돌아볼 선택', description: '지금 이야기만으로는 선택의 이유를 단정하기 어려워요. 직접 맞는 정리를 골라도 괜찮아요.', principle: '다음 거래 전에 내가 선택하는 이유를 한 줄로 적기.' },
];
function categoryFor(id: PrincipleCategory) { return principleCategories.find(item => item.id === id)!; }
type ReflectionAnswer = { question: string; text: string; hint?: PrincipleCategory };
type ReflectionResult = { category: PrincipleCategory; evidence: string; explanation: string };
type InvestmentPrinciple = { id: string; text: string; category: PrincipleCategory; evidence: string; explanation: string; answers: ReflectionAnswer[]; createdAt: string; updatedAt: string; previousPrinciple?: string };
const principlesStorageKey = 'kiwoom-confession-principles-v1';
function readPrinciples(): InvestmentPrinciple[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(principlesStorageKey) || '[]');
    if (!Array.isArray(data)) return [];
    return data.filter((item): item is InvestmentPrinciple => item && typeof item.id === 'string' && typeof item.text === 'string' && item.text.trim() &&
      principleCategories.some(category => category.id === item.category) && typeof item.evidence === 'string' && typeof item.explanation === 'string' &&
      typeof item.createdAt === 'string' && Number.isFinite(Date.parse(item.createdAt)) && Array.isArray(item.answers) &&
      item.answers.every((answer: ReflectionAnswer) => answer && typeof answer.question === 'string' && typeof answer.text === 'string'));
  } catch { return []; }
}
// Mock interpretation considers the stated reason, never the price movement or P/L.
function summarizeReflection(answers: ReflectionAnswer[]): ReflectionResult {
  const reason = answers[1];
  const criteria = answers[2];
  let category: PrincipleCategory = reason.hint || 'unsure';
  if (!reason.hint) {
    const text = reason.text;
    if (/추천|따라|주변|친구|커뮤니티/.test(text) && !/따르지|따라.*않|추천.*아니/.test(text)) category = 'follow';
    else if (/놓칠|놓치|급하|급하게|조급|늦을|후회/.test(text)) category = 'rush';
    else if (/만회|복구|본전/.test(text)) category = 'recovery';
    else if (/반대.*(무시|안 봤)|무조건|확실|오를 수밖에/.test(text)) category = 'confidence';
    else if (/몰빵|전부|비중.*(넘|초과)|한 종목.*집중/.test(text)) category = 'concentration';
    else if (/근거|분석|계획|기준/.test(text) && !/없|안 |않/.test(text)) category = 'none';
    if (/기준.*(확인|따라)|근거.*확인|분석.*확인|계획대로/.test(text) && !/무시|확인하지|안 |않|없/.test(text)) category = 'none';
  }
  const missingCriteria = criteria.hint === 'missing' || /기준.*없|정하지|계획.*없/.test(criteria.text);
  const checkedCriteria = criteria.hint === 'none' || (/정했|세웠|계획|확인했/.test(criteria.text) && !/없|않|안 |확인하지/.test(criteria.text));
  if (category === 'none' && !checkedCriteria) category = missingCriteria ? 'missing' : 'unsure';
  if (category === 'unsure' && missingCriteria) category = 'missing';
  const evidence = category === 'missing' ? criteria.text : reason.text;
  return { category, evidence, explanation: categoryFor(category).description };
}
function principleDate(value: string) { return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(value)); }

function ConfessionLanding({ onBack, backButtonRef }: { onBack: () => void; backButtonRef: RefObject<HTMLButtonElement | null> }) {
  const keyboard = useKeyboard();
  const [topic, setTopic] = useState<ConfessionTopic | null>(null);
  const [panel, setPanel] = useState<'chat' | 'trades' | 'principles' | null>(null);
  const [trade, setTrade] = useState<string | null>(null);
  const [principles, setPrinciples] = useState(readPrinciples);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [reviewPrinciple, setReviewPrinciple] = useState<InvestmentPrinciple | null>(null);
  const [backdropReady, setBackdropReady] = useState(false);
  const [mascotReady, setMascotReady] = useState(false);
  const primaryRef = useRef<HTMLButtonElement>(null);
  function updatePrinciples(next: InvestmentPrinciple[]) {
    setPrinciples(next);
    try { localStorage.setItem(principlesStorageKey, JSON.stringify(next)); setStorageAvailable(true); }
    catch { setStorageAvailable(false); }
  }
  function closePanel() { keyboard.hide(); setPanel(null); }
  function showPrinciples() { keyboard.hide(); setPanel('principles'); }
  const previousPanel = useRef(panel);
  useEffect(() => {
    if (previousPanel.current !== null && panel === null) backButtonRef.current?.focus({ preventScroll: true });
    previousPanel.current = panel;
  }, [panel, backButtonRef]);
  function start(selectedTopic = topic, selectedTrade: string | null = null, previous = principles[0] || null) {
    keyboard.hide(); setTopic(selectedTopic); setTrade(selectedTrade); setReviewPrinciple(previous); setPanel('chat');
  }
  const covered = panel === 'chat' || panel === 'principles';
  return <>
  <main className="kiwoom ai-landing confession-landing" aria-label="AI 고해성사 랜딩페이지" data-covered={covered} aria-hidden={covered} inert={covered}>
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
          onRecords={() => { keyboard.hide(); setPanel('trades'); }} onSaved={showPrinciples} hasSaved={principles.length > 0} />
      </div>
    </MobileScroll>
    <header className="confession-header">
      <button ref={backButtonRef} className="icon-button" aria-label="뒤로가기" onClick={onBack}><ArrowLeftIcon size={28} weight="light" /></button>
      <span>투자 고해성사</span>
      <button className="principles-entry icon-button" aria-label="나의 투자 원칙 보기" onClick={showPrinciples}><BookmarkSimpleIcon size={24} />{principles.length > 0 && <small>{principles.length}</small>}</button>
    </header>
    <BottomSheet open={panel === 'trades'} onOpenChange={open => { if (!open) closePanel(); }} title="마음에 남은 거래가 있나요?" description="시연용 예시 · 실제 매매 데이터 연결 없음" snap={0.75}>
      <div className="confession-sheet">
        <button className="confession-sheet-close" aria-label="닫기" onClick={closePanel}><XIcon size={20} /></button>
        <p className="confession-sheet-intro">마음에 남은 선택을 함께 돌아보겠습니다.<br />그때의 마음을 편안하게 들려주세요.</p>
        {demoTrades.map(item => <button className="confession-trade" key={item.name} onClick={() => start(item.topic, item.name)}><span className="confession-example">예시 거래</span><strong>{item.name}<CaretRightIcon size={18} /></strong><span>{item.detail}</span><small>{item.fact}</small></button>)}
      </div>
    </BottomSheet>
  </main>
  {panel === 'chat' && <ConfessionChat topic={topic} trade={trade} onBack={closePanel} previous={reviewPrinciple}
    storageAvailable={storageAvailable} onSavedView={showPrinciples} onSave={value => updatePrinciples([value, ...principles])} />}
  {panel === 'principles' && <InvestmentPrinciples principles={principles} storageAvailable={storageAvailable} onBack={closePanel}
    onChange={updatePrinciples} onStart={previous => start(null, null, previous || principles[0] || null)} />}
  </>;
}

type ConfessionMessage = { id: number; role: 'ai' | 'user'; text: string };

function ConfessionThinking() {
  return <div className="chat-thinking" role="status" aria-live="polite">
    <div className="chat-thinking-orbit" aria-hidden="true"><SparkleIcon size={25} weight="fill" /></div>
    <strong>키움 AI가 생각하는 중<span className="chat-typing-dots" aria-hidden="true"><i /><i /><i /></span></strong>
    <p>이야기 속에서 나만의 투자 기준을 찾고 있어요.</p>
  </div>;
}

type ChatStage = 'interview' | 'thinking' | 'review' | 'correct' | 'principle' | 'saved';
const reasonSuggestions: { text: string; hint: PrincipleCategory }[] = [
  { text: '주변의 추천을 따랐고, 직접 확인하지 않았어요', hint: 'follow' },
  { text: '오르는 가격을 보고 기회를 놓칠까 급하게 샀어요', hint: 'rush' },
  { text: '제가 세운 기준과 근거를 확인하고 샀어요', hint: 'none' },
  { text: '앞선 손실을 빨리 만회하고 싶었어요', hint: 'recovery' },
  { text: '반대 근거가 있어도 제 예상이 확실하다고 생각했어요', hint: 'confidence' },
  { text: '정해둔 비중을 넘겨 한 종목에 집중했어요', hint: 'concentration' },
];

function ReflectionCard({ result, onConfirm, onCorrect }: { result: ReflectionResult; onConfirm: () => void; onCorrect: () => void }) {
  return <section className="reflection-card" aria-label="고백 정리 카드">
    <span className="reflection-eyebrow"><SparkleIcon size={15} weight="fill" />고백 정리</span>
    <h2>{categoryFor(result.category).name}</h2>
    <p>{result.explanation}</p>
    <div className="reflection-evidence"><span>이렇게 말씀해 주셨어요</span><blockquote>“{result.evidence}”</blockquote></div>
    <small>수익이나 손실이 아닌 선택의 이유를 돌아보는 시연용 정리예요. 잘못을 단정하는 판단이 아닙니다.</small>
    <h3>이 정리가 내 마음과 맞나요?</h3>
    <div className="reflection-confirm"><button className="flow-primary" onClick={onConfirm}><CheckIcon size={17} />맞아요</button><button className="flow-secondary" onClick={onCorrect}>조금 달라요</button></div>
  </section>;
}

function ConfessionChat({ topic, trade, onBack, onSave, onSavedView, previous, storageAvailable }: {
  topic: ConfessionTopic | null; trade: string | null; onBack: () => void; onSave: (value: InvestmentPrinciple) => void;
  onSavedView: () => void; previous: InvestmentPrinciple | null; storageAvailable: boolean;
}) {
  const keyboard = useKeyboard();
  const { bottomInset, keyboardDragging } = useKeyboardInsets();
  const { device } = useMobileDevice();
  const questions = [
    previous ? '지난번에 남긴 원칙이 이번 선택에 어떻게 도움이 됐나요?' : trade ? `${trade} 거래에서 어떤 선택을 하셨나요?` : '최근 어떤 거래를 돌아보고 싶으세요?',
    '그 선택을 하게 된 가장 큰 이유는 무엇이었나요?',
    '거래 전에 매수나 재검토를 위한 기준을 정해두셨나요?',
  ];
  const [draft, setDraft] = useState('');
  const [hint, setHint] = useState<PrincipleCategory | undefined>();
  const [stage, setStage] = useState<ChatStage>('interview');
  const [answers, setAnswers] = useState<ReflectionAnswer[]>([]);
  const [result, setResult] = useState<ReflectionResult | null>(null);
  const [correctionCategory, setCorrectionCategory] = useState<PrincipleCategory>('unsure');
  const [moreReasons, setMoreReasons] = useState(false);
  const [messages, setMessages] = useState<ConfessionMessage[]>(() => [{ id: 0, role: 'ai', text: `안녕하세요. 선택의 이유를 나누며 나만의 투자 기준을 함께 세워볼게요.\n${questions[0]}` }]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);
  const nextId = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    backRef.current?.focus({ preventScroll: true });
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);
  useEffect(() => {
    const scroll = endRef.current?.closest('.mobile-scroll');
    if (!scroll) return;
    const top = ['review', 'correct', 'principle', 'saved'].includes(stage) && resultRef.current
      ? resultRef.current.offsetTop - device.geometry.safeArea.top - 100 : scroll.scrollHeight;
    scroll.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [messages, stage, moreReasons, device.geometry.safeArea.top]);
  const questionIndex = answers.length;
  const suggestions: { text: string; hint?: PrincipleCategory }[] = questionIndex === 0
    ? (previous ? ['원칙을 확인한 뒤 거래했어요', '원칙을 세웠지만 이번에는 지키지 못했어요', '이번에는 거래하지 않고 기다렸어요']
      : topic === 'average' ? ['보유 중인 종목을 추가 매수했어요', '추가 매수할지 고민하다 기다렸어요', '일부를 매도했어요'] : ['새로운 종목을 매수했어요', '보유 중인 종목을 추가 매수했어요', '매수하지 않고 기다렸어요']).map(text => ({ text }))
    : questionIndex === 1 ? moreReasons ? reasonSuggestions : reasonSuggestions.slice(0, 3)
      : [{ text: '투자 이유와 재검토 조건을 미리 정했어요', hint: 'none' }, { text: '정해둔 기준은 없었어요', hint: 'missing' }, { text: '기준은 있었지만 이번에는 확인하지 않았어요', hint: 'unsure' }];
  function append(role: 'ai' | 'user', text: string) { setMessages(current => [...current, { id: nextId.current++, role, text }]); }
  function confirm() {
    keyboard.hide();
    setDraft(categoryFor(result!.category).principle); setStage('principle');
  }
  function submit() {
    const text = draft.trim();
    if (busy.current || (stage !== 'correct' && !text)) return;
    keyboard.hide();
    if (stage === 'principle') {
      busy.current = true;
      const now = new Date().toISOString();
      onSave({ id: crypto.randomUUID(), text, category: result!.category, evidence: result!.evidence,
        explanation: result!.explanation, answers, createdAt: now, updatedAt: now, previousPrinciple: previous?.text });
      setDraft(''); setStage('saved'); return;
    }
    if (stage === 'correct') {
      if (text) append('user', text);
      setResult({ category: correctionCategory, evidence: text || result!.evidence,
        explanation: categoryFor(correctionCategory).description });
      setDraft(''); setStage('review'); return;
    }
    if (stage !== 'interview') return;
    const next = [...answers, { question: questions[questionIndex], text, hint }];
    setAnswers(next); append('user', text); setDraft(''); setHint(undefined); setMoreReasons(false);
    if (next.length < 3) { append('ai', questions[next.length]); return; }
    busy.current = true; setStage('thinking');
    // Five-second demo latency, cancelled on back/unmount. No AI or network request.
    timer.current = setTimeout(() => {
      setResult(summarizeReflection(next)); busy.current = false; setStage('review'); timer.current = null;
    }, 5000);
  }
  const editable = stage === 'interview' || stage === 'correct' || stage === 'principle';
  const maxLength = stage === 'principle' ? 160 : 500;
  const step = stage === 'interview' || stage === 'thinking' ? 0 : stage === 'review' || stage === 'correct' ? 1 : 2;
  return <main className="kiwoom confession-chat" aria-label="투자 고해성사 AI 채팅">
    <header className="chat-header" style={{ paddingTop: device.geometry.safeArea.top }}>
      <button ref={backRef} className="icon-button" aria-label="고해성사 랜딩으로 돌아가기" onClick={() => { keyboard.hide(); onBack(); }}><ArrowLeftIcon size={24} /></button>
      <div><strong>투자 고해성사</strong><span><i />키움 AI와 함께 만드는 나만의 기준</span></div>
    </header>
    <MobileScroll className="chat-scroll">
      <div className={`chat-history reflection-history ${editable ? '' : 'without-composer'}`} style={{ paddingTop: device.geometry.safeArea.top + 84 }}>
        <div className="reflection-steps" aria-label={`진행 단계 ${step + 1}/3`}>{['이야기 나누기', '고백 정리', '원칙 남기기'].map((label, index) => <span key={label} className={index <= step ? 'active' : ''} aria-current={index === step ? 'step' : undefined}><b>{index < step ? <CheckIcon size={10} /> : index + 1}</b>{label}</span>)}</div>
        <p className="chat-demo-note">프로토타입 · AI 응답과 분류는 시연용입니다</p>
        {previous && <aside className="previous-principle"><span><BookmarkSimpleIcon size={14} />지난번에 남긴 나의 원칙</span><strong>{previous.text}</strong><small>이 기준을 이번 선택에 어떻게 적용했는지 돌아봐요.</small></aside>}
        <div className="chat-messages" role="log" aria-label="AI와의 대화" aria-live="polite" aria-relevant="additions">
          {messages.map(message => <div key={message.id} className={`chat-message chat-message-${message.role}`}>
            {message.role === 'ai' && <span className="chat-author"><SparkleIcon size={16} weight="fill" />키움 AI</span>}
            <div className="chat-bubble"><p>{message.text}</p></div>
          </div>)}
        </div>
        {stage === 'interview' && <div className="chat-suggestions" role="group" aria-label="추천 답변">
          <p>질문 {questionIndex + 1}/3 · 가까운 답변을 고르거나 직접 입력해 주세요</p>
          {suggestions.map(value => <button key={value.text} aria-pressed={draft === value.text} className={draft === value.text ? 'is-selected' : ''} onClick={() => { keyboard.hide(); setDraft(value.text); setHint(value.hint); }}>{value.text}{draft === value.text && <CheckIcon size={16} />}</button>)}
          {questionIndex === 1 && <button className="more-reasons" aria-expanded={moreReasons} onClick={() => setMoreReasons(!moreReasons)}>{moreReasons ? '다른 이유 접기' : '다른 이유도 살펴보기'}<CaretDownIcon size={15} /></button>}
        </div>}
        {stage === 'thinking' && <ConfessionThinking />}
        <div ref={resultRef} className="reflection-result">
          {stage === 'review' && result && <ReflectionCard result={result} onConfirm={confirm} onCorrect={() => { keyboard.hide(); setDraft(''); setCorrectionCategory(result.category); setStage('correct'); }} />}
          {stage === 'correct' && <section className="reflection-card"><span className="reflection-eyebrow">내 마음에 맞게 고치기</span><h2>어떤 정리가 더 가까운가요?</h2><p>분류를 고르고, 다르게 느낀 점을 자유롭게 적어주세요.</p>
            <div className="correction-options" role="group" aria-label="고백 분류 수정">{principleCategories.map(item => <button key={item.id} aria-pressed={correctionCategory === item.id} className={correctionCategory === item.id ? 'selected' : ''} onClick={() => { keyboard.hide(); setCorrectionCategory(item.id); }}>{item.name}{correctionCategory === item.id && <CheckIcon size={14} />}</button>)}</div>
            <p className="correction-description">{categoryFor(correctionCategory).description}</p><button className="flow-text" onClick={() => { keyboard.hide(); setDraft(''); setStage('review'); }}>기존 정리로 돌아가기</button>
          </section>}
          {stage === 'principle' && result && <section className="reflection-card"><span className="reflection-eyebrow"><BookmarkSimpleIcon size={15} />나만의 기준 만들기</span><h2>오늘의 고백을<br />내일의 원칙으로.</h2><p>아래 입력창에서 나의 말로 바꿔보세요.<br />실천할 수 있는 작은 기준 하나면 충분해요.</p>
            <blockquote className="principle-preview">{draft || '나에게 맞는 투자 원칙을 적어주세요.'}</blockquote><small>확인한 정리 · {categoryFor(result.category).name}</small>
            <button className="flow-text" onClick={() => { keyboard.hide(); setDraft(''); setStage('review'); }}>고백 정리 다시 보기</button>
          </section>}
          {stage === 'saved' && <section className="reflection-card saved-card" role="status"><span className="saved-check"><CheckIcon size={30} /></span><h2>나의 원칙으로 남겼어요.</h2><p>다음 선택을 앞두고 다시 꺼내보세요.<br />다음 대화에서도 이 기준을 함께 돌아볼게요.</p><small>{storageAvailable ? '이 브라우저에 저장됩니다. 새로고침해도 유지돼요.' : '브라우저 저장이 제한되어 현재 화면에서만 유지돼요.'}</small><button className="flow-primary" onClick={() => { keyboard.hide(); onSavedView(); }}><BookmarkSimpleIcon size={18} />나의 투자 원칙 보기</button><button className="flow-text" onClick={onBack}>고해성사 홈으로 돌아가기</button></section>}
        </div>
        <div ref={endRef} />
      </div>
    </MobileScroll>
    {editable && <form className="chat-composer" style={{ bottom: bottomInset, transition: keyboardDragging ? 'none' : undefined }} onSubmit={event => { event.preventDefault(); submit(); }}>
      <div className="chat-input-wrap"><KeyboardTextarea aria-label={stage === 'principle' ? '나의 투자 원칙 입력' : stage === 'correct' ? '고백 정리 수정 의견' : '투자 이야기 직접 입력'} placeholder={stage === 'principle' ? '내가 실천할 투자 원칙을 적어주세요' : stage === 'correct' ? '다르게 느낀 점을 적어주세요 (선택)' : '그때의 생각을 자유롭게 적어주세요'} rows={2} maxLength={maxLength} value={draft}
        onChange={event => { setDraft(event.target.value); setHint(undefined); }} onBlur={() => keyboard.hide()}
        onKeyDown={event => { if (event.key === 'Escape') { keyboard.hide(); return; } if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(); } }} />
      </div>
      <div className="chat-composer-actions"><span>{draft.length}/{maxLength}</span><button type="submit" onPointerDown={event => { if (event.button === 0) event.preventDefault(); }} disabled={stage !== 'correct' && !draft.trim()}>{stage === 'principle' ? '나의 투자 원칙으로 남기기' : stage === 'correct' ? '이 정리로 수정하기' : questionIndex === 2 ? '돌아보기' : '보내기'}<ArrowRightIcon size={18} /></button></div>
    </form>}
  </main>;
}

function InvestmentPrinciples({ principles, storageAvailable, onBack, onStart, onChange }: {
  principles: InvestmentPrinciple[]; storageAvailable: boolean; onBack: () => void;
  onStart: (previous?: InvestmentPrinciple) => void; onChange: (next: InvestmentPrinciple[]) => void;
}) {
  const keyboard = useKeyboard();
  const { device } = useMobileDevice();
  const { bottomInset, keyboardDragging } = useKeyboardInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState('');
  const backRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selected = principles.find(item => item.id === selectedId);
  useEffect(() => { backRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    scrollRef.current?.closest('.mobile-scroll')?.scrollTo({ top: 0, behavior: 'instant' });
    backRef.current?.focus({ preventScroll: true });
  }, [selectedId]);
  function closeDetail() { keyboard.hide(); setSelectedId(null); setEditing(false); setDeleting(false); }
  function saveEdit() {
    if (!selected || !draft.trim()) return;
    keyboard.hide(); onChange(principles.map(item => item.id === selected.id ? { ...item, text: draft.trim(), updatedAt: new Date().toISOString() } : item));
    setEditing(false); setNotice('원칙을 수정했어요.');
  }
  return <main className="kiwoom confession-chat principles-page" aria-label="나의 투자 원칙">
    <header className="chat-header" style={{ paddingTop: device.geometry.safeArea.top }}><button ref={backRef} className="icon-button" aria-label={selected ? '투자 원칙 목록으로 돌아가기' : '고해성사 랜딩으로 돌아가기'} onClick={selected ? closeDetail : onBack}><ArrowLeftIcon size={24} /></button><div><strong>{selected ? '원칙 돌아보기' : '나의 투자 원칙'}</strong><span>{selected ? '나의 선택에서 시작된 작은 다짐' : `${principles.length}개의 원칙 · 다음 선택을 위한 나만의 기준`}</span></div></header>
    <MobileScroll className="principles-scroll"><div ref={scrollRef} className="principles-content" style={{ paddingTop: device.geometry.safeArea.top + 92 }}>
      {notice && <p className="principles-notice" role="status">{notice}</p>}
      {!selected && principles.length === 0 && <section className="principles-empty"><div><BookmarkSimpleIcon size={36} weight="duotone" /></div><span>아직 비어 있는 나의 기준</span><h1>첫 번째 투자 원칙을<br />함께 만들어볼까요?</h1><p>AI와 선택의 이유를 돌아보고,<br />다음 거래에 지킬 작은 다짐을 남겨보세요.</p></section>}
      {!selected && principles.length > 0 && <><div className="principles-intro"><span>MY PRINCIPLES</span><h1>흔들리는 순간,<br /><em>나의 기준을 꺼내보세요.</em></h1><p>고백에서 시작된 다짐들을 모았어요.</p></div><div className="principles-list">{principles.map((item, index) => <button className="principle-list-card" key={item.id} aria-label={`투자 원칙 ${index + 1}: ${item.text}`} onClick={() => { keyboard.hide(); setNotice(''); setSelectedId(item.id); }}><span className="principle-card-top"><b>{String(principles.length - index).padStart(2, '0')}</b><small>{principleDate(item.createdAt)}</small><CaretRightIcon size={18} /></span><strong>{item.text}</strong><span className="principle-category">{categoryFor(item.category).name}</span><p>{item.evidence}</p></button>)}</div></>}
      {selected && <article className="principle-detail"><span className="reflection-eyebrow">{principleDate(selected.createdAt)}에 남긴 원칙</span><h1>{selected.text}</h1><span className="principle-category">{categoryFor(selected.category).name}</span>
        {editing && <section className="principle-edit"><label htmlFor="principle-edit">나의 말로 다시 다듬기</label><div className="chat-input-wrap"><KeyboardTextarea id="principle-edit" aria-label="저장한 투자 원칙 수정" rows={3} maxLength={160} value={draft} onChange={event => setDraft(event.target.value)} onBlur={() => keyboard.hide()} onKeyDown={event => { if (event.key === 'Escape') keyboard.hide(); }} /></div><small>{draft.length}/160</small><button className="flow-text" onClick={() => { keyboard.hide(); setEditing(false); }}>수정 취소</button></section>}
        <section className="principle-origin"><h2>이 원칙이 시작된 이야기</h2><blockquote>“{selected.evidence}”</blockquote><p>{selected.explanation}</p>{selected.previousPrinciple && <p className="principle-previous">지난 원칙을 돌아보며 남겼어요<br />{selected.previousPrinciple}</p>}</section>
        <details className="principle-conversation"><summary>함께 나눈 대화 보기</summary>{selected.answers.map((answer, index) => <div key={index}><span>질문 {index + 1}</span><p>{answer.question}</p><blockquote>{answer.text}</blockquote></div>)}</details>
        <div className="principle-manage"><button onClick={() => { keyboard.hide(); setDraft(selected.text); setEditing(true); setDeleting(false); setNotice(''); }}>원칙 수정</button><button onClick={() => { keyboard.hide(); setDeleting(true); setEditing(false); }}>원칙 삭제</button></div>
        {deleting && <section className="principle-delete" role="alert"><p>이 원칙을 삭제할까요?<br />저장된 원칙과 함께 나눈 대화가 삭제돼요.</p><div className="reflection-confirm"><button className="flow-secondary" onClick={() => setDeleting(false)}>취소</button><button className="flow-primary" onClick={() => { onChange(principles.filter(item => item.id !== selected.id)); closeDetail(); setNotice('원칙을 삭제했어요.'); }}>삭제하기</button></div></section>}
      </article>}
      <p className="principles-storage">{storageAvailable ? '이 브라우저에만 저장돼요 · 실제 계좌·AI 연결 없음' : '브라우저 저장이 제한되어 현재 화면에서만 유지돼요'}</p>
    </div></MobileScroll>
    <footer className="principles-footer" style={{ bottom: bottomInset, transition: keyboardDragging ? 'none' : undefined }}><button className="flow-primary" disabled={editing && !draft.trim()} onPointerDown={event => { if (event.button === 0) event.preventDefault(); }} onClick={() => { keyboard.hide(); if (editing) saveEdit(); else onStart(selected); }}>{editing ? '수정한 원칙 저장하기' : selected ? '이 원칙으로 다시 돌아보기' : principles.length > 0 ? '새로운 투자 돌아보기' : '나의 투자 돌아보기'}<ArrowRightIcon size={19} /></button></footer>
  </main>;
}
