import { useState, useMemo, useEffect } from 'react';
import {
  korean,
  english,
  japanese,
  chinese,
  taiwaneseMandarin,
} from '@neosapience/typecast-autotag';
import {
  Icons,
  categoryIconsKo,
  categoryIconsEn,
  categoryIconsJa,
  categoryIconsZh,
  categoryIconsZhTw,
} from './Icons';
import {
  examplesKo,
  examplesEn,
  examplesJa,
  examplesZh,
  examplesZhTw,
  aiccExamplesKo,
  aiccExamplesEn,
  aiccExamplesJa,
  aiccExamplesZh,
  aiccExamplesZhTw,
} from './examples';
import { useScrollAnimation } from './useScrollAnimation';

type Language = 'ko' | 'en' | 'ja' | 'zh' | 'zh-TW';

const languageModules = {
  ko: korean,
  en: english,
  ja: japanese,
  zh: chinese,
  'zh-TW': taiwaneseMandarin,
};
const exampleSets = {
  ko: examplesKo,
  en: examplesEn,
  ja: examplesJa,
  zh: examplesZh,
  'zh-TW': examplesZhTw,
};
const aiccExampleSets = {
  ko: aiccExamplesKo,
  en: aiccExamplesEn,
  ja: aiccExamplesJa,
  zh: aiccExamplesZh,
  'zh-TW': aiccExamplesZhTw,
};
const categoryIconSets = {
  ko: categoryIconsKo,
  en: categoryIconsEn,
  ja: categoryIconsJa,
  zh: categoryIconsZh,
  'zh-TW': categoryIconsZhTw,
};
const manualTagInputs = {
  ko: 'name(홍길동)님의 전화번호는 phone(010-1234-5678)입니다.\n금액은 money(50000)원이고, 날짜는 date(2024-12-25)입니다.',
  en: "name(John)'s phone number is phone(555-1234).\nThe amount is money($100) and the date is date(2024-12-25).",
  ja: 'name(佐藤)様の電話番号はphone(090-1234-5678)です。\n金額はmoney(5000円)、日付はdate(2026-07-14)です。',
  zh: 'name(王伟)的电话是phone(138-0013-8000)。\n金额是money(5000元)，日期是date(2026-07-14)。',
  'zh-TW':
    'name(王偉)的電話是phone(0912-345-678)。\n金額是money(5000新臺幣)，日期是date(2026-07-14)。',
};

function App() {
  const [language, setLanguage] = useState<Language>('ko');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const singleSectionAnim = useScrollAnimation<HTMLElement>();
  const aiccSectionAnim = useScrollAnimation<HTMLElement>();
  const manualTagSectionAnim = useScrollAnimation<HTMLElement>();
  const infoSectionAnim = useScrollAnimation<HTMLElement>();

  const examples = exampleSets[language];
  const aiccExamples = aiccExampleSets[language];
  const categoryIcons = categoryIconSets[language];
  const languageModule = languageModules[language];
  const categories = useMemo(() => [...new Set(examples.map((e) => e.category))], [examples]);

  const [selectedAICCId, setSelectedAICCId] = useState(aiccExamples[0].id);
  const [editableText, setEditableText] = useState(aiccExamples[0].input);
  const [manualTagInput, setManualTagInput] = useState(manualTagInputs[language]);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedCategory(null);
    setSelectedAICCId(aiccExamples[0].id);
    setEditableText(aiccExamples[0].input);
    setManualTagInput(manualTagInputs[language]);
  }, [language, aiccExamples]);

  const filteredExamples = useMemo(() => {
    if (!selectedCategory) return examples;
    return examples.filter((e) => e.category === selectedCategory);
  }, [selectedCategory, examples]);

  const currentExample = filteredExamples[currentIndex] || filteredExamples[0];

  const applyAutoTag = (text: string) => {
    return languageModule.autoTag(text);
  };

  const applyManualTag = (text: string) => {
    return languageModule.manualTag(text);
  };

  const applyAutoTagWithManual = (text: string) => {
    return languageModule.autoTagWithManual(text);
  };

  const result = useMemo(() => {
    if (!currentExample) return { auto: '', manual: '', combined: '' };
    const auto = applyAutoTag(currentExample.original);
    const manual = currentExample.hasManualTag
      ? applyManualTag(currentExample.original)
      : currentExample.original;
    const combined = currentExample.hasManualTag
      ? applyAutoTagWithManual(currentExample.original)
      : auto;
    return { auto, manual, combined };
  }, [currentExample, language]);

  const aiccResult = useMemo(() => applyAutoTag(editableText), [editableText, language]);

  const manualTagResult = useMemo(() => {
    return applyManualTag(manualTagInput);
  }, [manualTagInput, language]);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredExamples.length - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev < filteredExamples.length - 1 ? prev + 1 : 0));
  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
  };
  const handleAICCSelect = (id: string) => {
    setSelectedAICCId(id);
    const example = aiccExamples.find((e) => e.id === id);
    if (example) setEditableText(example.input);
  };

  const selectedAICC = aiccExamples.find((e) => e.id === selectedAICCId);

  const t = (ko: string, en: string, ja: string, zh: string, zhTw = zh): string =>
    language === 'ko'
      ? ko
      : language === 'ja'
        ? ja
        : language === 'zh'
          ? zh
          : language === 'zh-TW'
            ? zhTw
            : en;
  const zhText = (simplified: string, traditional: string): string =>
    language === 'zh-TW' ? traditional : simplified;
  const ui = {
    subtitle: t(
      'TTS를 위한 텍스트 전처리 데모',
      'Text Preprocessing Demo for TTS',
      'TTS向けテキスト前処理デモ',
      '面向TTS的文本预处理演示',
      'TTS文字預處理示範'
    ),
    singleExample: t('단일 예시', 'Single Examples', '単一例', '单项示例', '單項範例'),
    all: t('전체', 'All', 'すべて', '全部', '全部'),
    before: t('Before (원본)', 'Before (Original)', 'Before（原文）', 'Before（原文）'),
    after: t(
      'After (오토태깅)',
      'After (Auto-tagged)',
      'After（自動タグ）',
      'After（自动标注）',
      'After（自動標註）'
    ),
    manualResult: t(
      '수동 태깅 결과',
      'Manual Tag Result',
      '手動タグ結果',
      '手动标注结果',
      '手動標註結果'
    ),
    combinedResult: t(
      '자동 + 수동 태깅 결과',
      'Auto + Manual Tag Result',
      '自動＋手動タグ結果',
      '自动＋手动标注结果',
      '自動＋手動標註結果'
    ),
    prev: t('이전', 'Prev', '前へ', '上一个', '上一個'),
    next: t('다음', 'Next', '次へ', '下一个', '下一個'),
    longExample: t(
      '장문 예시 (AICC 시나리오)',
      'Long Text (AICC Scenarios)',
      '長文例（AICCシナリオ）',
      '长文本（AICC场景）',
      '長文字（AICC情境）'
    ),
    selectScenario: t('시나리오 선택', 'Select Scenario', 'シナリオ選択', '选择场景', '選擇情境'),
    inputEditable: t(
      '입력 (수정 가능)',
      'Input (Editable)',
      '入力（編集可能）',
      '输入（可编辑）',
      '輸入（可編輯）'
    ),
    autoTagResult: t(
      '오토태깅 결과',
      'Auto-tagged Result',
      '自動タグ結果',
      '自动标注结果',
      '自動標註結果'
    ),
    manualTagExperiment: t(
      '수동 태그 실험',
      'Manual Tag Experiment',
      '手動タグを試す',
      '手动标注试验',
      '手動標註測試'
    ),
    manualTagInput: t(
      '수동 태그 입력',
      'Manual Tag Input',
      '手動タグ入力',
      '手动标注输入',
      '手動標註輸入'
    ),
    manualTagResult: t(
      '수동 태그 처리 결과',
      'Manual Tag Result',
      '手動タグ処理結果',
      '手动标注结果',
      '手動標註結果'
    ),
    manualTagDesc: t(
      '괄호를 사용하여 수동으로 태그를 지정할 수 있습니다. 예: name(홍길동), phone(010-1234-5678)',
      'You can manually tag text using parentheses. Example: name(John), phone(555-1234)',
      '括弧で手動タグを指定できます。例: name(佐藤), phone(090-1234-5678)',
      '可使用括号手动指定标注。例如：name(王伟)、phone(138-0013-8000)',
      '可使用括號手動指定標註。例如：name(王偉)、phone(0912-345-678)'
    ),
    availableTags: t(
      '사용 가능한 태그',
      'Available Tags',
      '利用可能なタグ',
      '可用标注',
      '可用標註'
    ),
    autoTagTitle: t('자동 태깅', 'Auto Tagging', '自動タグ', '自动标注', '自動標註'),
    autoTagDesc: t(
      '전화번호, 날짜, 시간, 금액 등 패턴을 자동으로 인식하여 TTS에 적합한 형태로 변환합니다.',
      'Automatically recognizes patterns like phone numbers, dates, times, and amounts for TTS.',
      '電話番号、日付、時刻、金額などを認識し、TTS向けの読み方に変換します。',
      '自动识别电话号码、日期、时间和金额等模式，并转换为适合TTS的读法。',
      '自動辨識電話號碼、日期、時間和金額等格式，並轉換為適合TTS的讀法。'
    ),
    manualTagTitle: t('수동 태깅', 'Manual Tagging', '手動タグ', '手动标注', '手動標註'),
    combinedTagTitle: t('복합 태깅', 'Combined Tagging', '複合タグ', '组合标注', '組合標註'),
    combinedTagDesc: t(
      '수동 태그가 먼저 처리된 후, 나머지 텍스트에 자동 태깅이 적용됩니다.',
      'Manual tags are processed first, then auto-tagging is applied.',
      '手動タグを先に処理し、残りのテキストに自動タグを適用します。',
      '先处理手动标注，再对其余文本应用自动标注。',
      '先處理手動標註，再對其餘文字套用自動標註。'
    ),
    madeFor: 'Made for',
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">{Icons.mic}</span>
            <h1>Typecast Autotag</h1>
          </div>
          <p className="subtitle">{ui.subtitle}</p>
          <div className="language-selector">
            <button
              className={`lang-btn ${language === 'ko' ? 'active' : ''}`}
              onClick={() => setLanguage('ko')}
            >
              <span className="lang-icon">{Icons.globe}</span>한국어
            </button>
            <button
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              <span className="lang-icon">{Icons.globe}</span>English
            </button>
            <button
              className={`lang-btn ${language === 'ja' ? 'active' : ''}`}
              onClick={() => setLanguage('ja')}
            >
              <span className="lang-icon">{Icons.globe}</span>日本語
            </button>
            <button
              className={`lang-btn ${language === 'zh' ? 'active' : ''}`}
              onClick={() => setLanguage('zh')}
            >
              <span className="lang-icon">{Icons.globe}</span>简体中文
            </button>
            <button
              className={`lang-btn ${language === 'zh-TW' ? 'active' : ''}`}
              onClick={() => setLanguage('zh-TW')}
            >
              <span className="lang-icon">{Icons.globe}</span>繁體中文（台灣）
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <section
          ref={singleSectionAnim.ref}
          className={`section fade-in-section ${singleSectionAnim.isVisible ? 'visible' : ''}`}
        >
          <h2 className="section-title">
            <span className="section-icon">{Icons.zap}</span>
            {ui.singleExample}
          </h2>

          <div className="category-filter">
            <button
              className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => handleCategoryClick(null)}
            >
              {ui.all}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                <span className="category-icon">{categoryIcons[cat]}</span>
                {cat}
              </button>
            ))}
          </div>

          <div className="example-card">
            <div className="card-header">
              <div className="category-badge">
                <span className="badge-icon">{categoryIcons[currentExample.category]}</span>
                {currentExample.category}
              </div>
              <span className="example-number">
                {currentIndex + 1} / {filteredExamples.length}
              </span>
            </div>
            <h3 className="example-description">{currentExample.description}</h3>
            <div className="comparison">
              <div className="comparison-item before">
                <div className="comparison-label">
                  <span className="dot before-dot"></span>
                  {ui.before}
                </div>
                <div className="comparison-content">{currentExample.original}</div>
              </div>
              <div className="arrow">{Icons.arrowRight}</div>
              <div className="comparison-item after">
                <div className="comparison-label">
                  <span className="dot after-dot"></span>
                  {ui.after}
                </div>
                <div className="comparison-content highlight">{result.auto}</div>
              </div>
            </div>
            {currentExample.hasManualTag && (
              <div className="manual-section">
                <div className="comparison-item manual">
                  <div className="comparison-label">
                    <span className="dot manual-dot"></span>
                    {ui.manualResult}
                  </div>
                  <div className="comparison-content">{result.manual}</div>
                </div>
                <div className="comparison-item combined">
                  <div className="comparison-label">
                    <span className="dot combined-dot"></span>
                    {ui.combinedResult}
                  </div>
                  <div className="comparison-content highlight">{result.combined}</div>
                </div>
              </div>
            )}
            <div className="navigation">
              <button className="nav-btn" onClick={handlePrev}>
                {Icons.chevronLeft}
                {ui.prev}
              </button>
              <div className="progress-dots">
                {filteredExamples.map((_, idx) => (
                  <button
                    key={idx}
                    className={`progress-dot ${idx === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                  />
                ))}
              </div>
              <button className="nav-btn" onClick={handleNext}>
                {ui.next}
                {Icons.chevronRight}
              </button>
            </div>
          </div>
        </section>

        <section
          ref={aiccSectionAnim.ref}
          className={`section fade-in-section ${aiccSectionAnim.isVisible ? 'visible' : ''}`}
        >
          <h2 className="section-title">
            <span className="section-icon">{Icons.edit}</span>
            {ui.longExample}
          </h2>
          <div className="aicc-selector">
            <label htmlFor="aicc-select" className="select-label">
              {ui.selectScenario}
            </label>
            <div className="select-wrapper">
              <select
                id="aicc-select"
                value={selectedAICCId}
                onChange={(e) => handleAICCSelect(e.target.value)}
                className="select-input"
              >
                {aiccExamples.map((example) => (
                  <option key={example.id} value={example.id}>
                    [{example.category}] {example.title}
                  </option>
                ))}
              </select>
              <span className="select-arrow">{Icons.chevronDown}</span>
            </div>
          </div>
          <div className="aicc-card">
            <div className="aicc-header">
              <span className="aicc-category">{selectedAICC?.category}</span>
              <h3 className="aicc-title">{selectedAICC?.title}</h3>
            </div>
            <div className="aicc-content">
              <div className="aicc-panel">
                <div className="panel-header">
                  <span className="panel-dot before-dot"></span>
                  <span className="panel-label">{ui.inputEditable}</span>
                </div>
                <textarea
                  className="aicc-textarea"
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  spellCheck={false}
                />
              </div>
              <div className="aicc-panel">
                <div className="panel-header">
                  <span className="panel-dot after-dot"></span>
                  <span className="panel-label">{ui.autoTagResult}</span>
                </div>
                <div className="aicc-result">{aiccResult}</div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={manualTagSectionAnim.ref}
          className={`section fade-in-section ${manualTagSectionAnim.isVisible ? 'visible' : ''}`}
        >
          <h2 className="section-title">
            <span className="section-icon">{Icons.edit}</span>
            {ui.manualTagExperiment}
          </h2>
          <p className="section-description">{ui.manualTagDesc}</p>
          <div className="manual-experiment-card">
            <div className="manual-input-section">
              <div className="manual-input-panel">
                <div className="panel-header">
                  <span className="panel-dot manual-dot"></span>
                  <span className="panel-label">{ui.manualTagInput}</span>
                </div>
                <textarea
                  className="manual-textarea"
                  value={manualTagInput}
                  onChange={(e) => setManualTagInput(e.target.value)}
                  placeholder={t(
                    'name(이름), phone(전화번호), money(금액) 등의 태그를 사용해보세요...',
                    'Try tags like name(John), phone(555-1234), money($100)...',
                    'name(佐藤), phone(090-1234-5678), money(500円)などをお試しください...',
                    '请尝试name(王伟)、phone(138-0013-8000)、money(500元)等标注...',
                    '請嘗試name(王偉)、phone(0912-345-678)、money(500新臺幣)等標註...'
                  )}
                  spellCheck={false}
                />
              </div>
              <div className="manual-result-panel">
                <div className="panel-header">
                  <span className="panel-dot after-dot"></span>
                  <span className="panel-label">{ui.manualTagResult}</span>
                </div>
                <div className="manual-result-content highlight">{manualTagResult}</div>
              </div>
            </div>
            <div className="tag-list-section">
              <h4 className="tag-list-title">
                <span className="tag-list-icon">{Icons.link}</span>
                {ui.availableTags}
              </h4>
              <div className="tag-list">
                {language === 'ko' ? (
                  <>
                    <div className="tag-category">
                      <div className="tag-category-title">이름/번호</div>
                      <div className="tag-item">
                        <code>name(홍길동)</code>
                        <span>이름 (한글자씩)</span>
                      </div>
                      <div className="tag-item">
                        <code>phone(010-1234-5678)</code>
                        <span>전화번호</span>
                      </div>
                      <div className="tag-item">
                        <code>digits(1234)</code>
                        <span>숫자를 한자리씩</span>
                      </div>
                      <div className="tag-item">
                        <code>address(102동 1101호)</code>
                        <span>주소 (동호수)</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">날짜/시간</div>
                      <div className="tag-item">
                        <code>date(2024-01-15)</code>
                        <span>날짜</span>
                      </div>
                      <div className="tag-item">
                        <code>time(14:30)</code>
                        <span>시간</span>
                      </div>
                      <div className="tag-item">
                        <code>datetime(2024-01-15T14:30)</code>
                        <span>날짜와 시간</span>
                      </div>
                      <div className="tag-item">
                        <code>year(2024)</code>
                        <span>연도</span>
                      </div>
                      <div className="tag-item">
                        <code>month(12)</code>
                        <span>월</span>
                      </div>
                      <div className="tag-item">
                        <code>day(25)</code>
                        <span>일</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">금액/점수</div>
                      <div className="tag-item">
                        <code>money(50000원)</code>
                        <span>화폐 금액</span>
                      </div>
                      <div className="tag-item">
                        <code>point(95점)</code>
                        <span>점수/포인트</span>
                      </div>
                      <div className="tag-item">
                        <code>order(3번째)</code>
                        <span>순서</span>
                      </div>
                      <div className="tag-item">
                        <code>piece(5개)</code>
                        <span>개수 세기</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">시간/비율</div>
                      <div className="tag-item">
                        <code>minsec(5분30초)</code>
                        <span>분/초 시간</span>
                      </div>
                      <div className="tag-item">
                        <code>ratio(50%)</code>
                        <span>비율/퍼센트</span>
                      </div>
                      <div className="tag-item">
                        <code>duration(3개월)</code>
                        <span>기간</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">단위</div>
                      <div className="tag-item">
                        <code>floor(5층)</code>
                        <span>층수</span>
                      </div>
                      <div className="tag-item">
                        <code>weight(5kg)</code>
                        <span>무게</span>
                      </div>
                      <div className="tag-item">
                        <code>distance(5km)</code>
                        <span>거리</span>
                      </div>
                      <div className="tag-item">
                        <code>temperature(25℃)</code>
                        <span>온도</span>
                      </div>
                      <div className="tag-item">
                        <code>volume(500ml)</code>
                        <span>부피/용량</span>
                      </div>
                      <div className="tag-item">
                        <code>dataCapacity(100GB)</code>
                        <span>데이터 용량</span>
                      </div>
                      <div className="tag-item">
                        <code>inch(55인치)</code>
                        <span>인치</span>
                      </div>
                    </div>
                  </>
                ) : language === 'ja' ? (
                  <>
                    <div className="tag-category">
                      <div className="tag-category-title">名前・番号</div>
                      <div className="tag-item">
                        <code>name(佐藤)</code>
                        <span>名前</span>
                      </div>
                      <div className="tag-item">
                        <code>phone(090-1234-5678)</code>
                        <span>電話番号</span>
                      </div>
                      <div className="tag-item">
                        <code>digits(2048)</code>
                        <span>一桁ずつ読む</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">日付・時刻</div>
                      <div className="tag-item">
                        <code>date(2026-07-14)</code>
                        <span>日付</span>
                      </div>
                      <div className="tag-item">
                        <code>time(14:30)</code>
                        <span>時刻</span>
                      </div>
                      <div className="tag-item">
                        <code>datetime(2026-07-14T09:05)</code>
                        <span>日時</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">金額・割合</div>
                      <div className="tag-item">
                        <code>money(5000円)</code>
                        <span>金額</span>
                      </div>
                      <div className="tag-item">
                        <code>percentage(72.5%)</code>
                        <span>パーセント</span>
                      </div>
                      <div className="tag-item">
                        <code>score(3-2)</code>
                        <span>試合スコア</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">数値・単位</div>
                      <div className="tag-item">
                        <code>unit(25kg)</code>
                        <span>単位</span>
                      </div>
                      <div className="tag-item">
                        <code>range(6–9時)</code>
                        <span>範囲</span>
                      </div>
                      <div className="tag-item">
                        <code>number(1234)</code>
                        <span>数値</span>
                      </div>
                    </div>
                  </>
                ) : language === 'zh' || language === 'zh-TW' ? (
                  <>
                    <div className="tag-category">
                      <div className="tag-category-title">{zhText('姓名和号码', '姓名與號碼')}</div>
                      <div className="tag-item">
                        <code>{zhText('name(王伟)', 'name(王偉)')}</code>
                        <span>{zhText('姓名', '姓名')}</span>
                      </div>
                      <div className="tag-item">
                        <code>{zhText('phone(138-0013-8000)', 'phone(0912-345-678)')}</code>
                        <span>{zhText('电话号码', '電話號碼')}</span>
                      </div>
                      <div className="tag-item">
                        <code>digits(2048)</code>
                        <span>{zhText('逐位朗读', '逐位朗讀')}</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">{zhText('日期和时间', '日期與時間')}</div>
                      <div className="tag-item">
                        <code>date(2026-07-14)</code>
                        <span>{zhText('日期', '日期')}</span>
                      </div>
                      <div className="tag-item">
                        <code>time(14:30)</code>
                        <span>{zhText('时间', '時間')}</span>
                      </div>
                      <div className="tag-item">
                        <code>datetime(2026-07-14T09:05)</code>
                        <span>{zhText('日期和时间', '日期與時間')}</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">{zhText('金额和比例', '金額與比例')}</div>
                      <div className="tag-item">
                        <code>{zhText('money(5000元)', 'money(5000新臺幣)')}</code>
                        <span>{zhText('金额', '金額')}</span>
                      </div>
                      <div className="tag-item">
                        <code>percentage(72.5%)</code>
                        <span>{zhText('百分比', '百分比')}</span>
                      </div>
                      <div className="tag-item">
                        <code>score(3-2)</code>
                        <span>{zhText('比赛比分', '比賽比數')}</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">{zhText('数值和单位', '數值與單位')}</div>
                      <div className="tag-item">
                        <code>unit(25kg)</code>
                        <span>{zhText('单位', '單位')}</span>
                      </div>
                      <div className="tag-item">
                        <code>{zhText('range(6–9点)', 'range(6–9點)')}</code>
                        <span>{zhText('范围', '範圍')}</span>
                      </div>
                      <div className="tag-item">
                        <code>number(1234)</code>
                        <span>{zhText('数值', '數值')}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="tag-category">
                      <div className="tag-category-title">Names/Numbers</div>
                      <div className="tag-item">
                        <code>name(John)</code>
                        <span>Name (char-by-char)</span>
                      </div>
                      <div className="tag-item">
                        <code>phone(555-1234)</code>
                        <span>Phone numbers</span>
                      </div>
                      <div className="tag-item">
                        <code>digits(1234)</code>
                        <span>Digit-by-digit</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">Date/Time</div>
                      <div className="tag-item">
                        <code>date(Jan 15, 2024)</code>
                        <span>Date</span>
                      </div>
                      <div className="tag-item">
                        <code>time(2:30 PM)</code>
                        <span>Time</span>
                      </div>
                      <div className="tag-item">
                        <code>datetime(2024-01-15T14:30)</code>
                        <span>Date and time</span>
                      </div>
                      <div className="tag-item">
                        <code>year(2024)</code>
                        <span>Year</span>
                      </div>
                      <div className="tag-item">
                        <code>month(December)</code>
                        <span>Month</span>
                      </div>
                      <div className="tag-item">
                        <code>day(15th)</code>
                        <span>Day</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">Money/Scores</div>
                      <div className="tag-item">
                        <code>money($1,500)</code>
                        <span>Currency amounts</span>
                      </div>
                      <div className="tag-item">
                        <code>point(95 points)</code>
                        <span>Points/scores</span>
                      </div>
                      <div className="tag-item">
                        <code>order(3rd place)</code>
                        <span>Ordinal numbers</span>
                      </div>
                      <div className="tag-item">
                        <code>piece(5 items)</code>
                        <span>Counting</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">Time/Ratios</div>
                      <div className="tag-item">
                        <code>minsec(5m30s)</code>
                        <span>Duration (min/sec)</span>
                      </div>
                      <div className="tag-item">
                        <code>ratio(50%)</code>
                        <span>Ratio/percent</span>
                      </div>
                      <div className="tag-item">
                        <code>duration(3 months)</code>
                        <span>Period</span>
                      </div>
                    </div>
                    <div className="tag-category">
                      <div className="tag-category-title">Units</div>
                      <div className="tag-item">
                        <code>floor(5th floor)</code>
                        <span>Floor numbers</span>
                      </div>
                      <div className="tag-item">
                        <code>weight(5kg)</code>
                        <span>Weight</span>
                      </div>
                      <div className="tag-item">
                        <code>distance(5km)</code>
                        <span>Distance</span>
                      </div>
                      <div className="tag-item">
                        <code>temperature(25°C)</code>
                        <span>Temperature</span>
                      </div>
                      <div className="tag-item">
                        <code>volume(500ml)</code>
                        <span>Volume/capacity</span>
                      </div>
                      <div className="tag-item">
                        <code>dataCapacity(100GB)</code>
                        <span>Data capacity</span>
                      </div>
                      <div className="tag-item">
                        <code>inch(55 inches)</code>
                        <span>Inch</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          ref={infoSectionAnim.ref}
          className={`info-section fade-in-section ${infoSectionAnim.isVisible ? 'visible' : ''}`}
        >
          <div className="info-card">
            <div className="info-icon">{Icons.zap}</div>
            <h3>{ui.autoTagTitle}</h3>
            <p>{ui.autoTagDesc}</p>
          </div>
          <div className="info-card">
            <div className="info-icon">{Icons.edit}</div>
            <h3>{ui.manualTagTitle}</h3>
            <p>
              <code>
                {t('name(홍길동)', 'name(John)', 'name(佐藤)', 'name(王伟)', 'name(王偉)')}
              </code>
              , <code>digits(1234)</code>
            </p>
          </div>
          <div className="info-card">
            <div className="info-icon">{Icons.link}</div>
            <h3>{ui.combinedTagTitle}</h3>
            <p>{ui.combinedTagDesc}</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          {ui.madeFor}{' '}
          <a href="https://typecast.ai" target="_blank" rel="noopener noreferrer">
            Typecast
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
