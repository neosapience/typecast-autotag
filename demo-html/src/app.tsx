import { useState, useMemo, useEffect } from 'react';
import { korean } from 'typecast-autotag';
import * as english from 'typecast-autotag/english';
import { Icons, categoryIconsKo, categoryIconsEn } from './Icons';
import { examplesKo, examplesEn, aiccExamplesKo, aiccExamplesEn } from './examples';
import { useScrollAnimation } from './useScrollAnimation';

type Language = 'ko' | 'en';

function App() {
  const [language, setLanguage] = useState<Language>('ko');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const singleSectionAnim = useScrollAnimation<HTMLElement>();
  const aiccSectionAnim = useScrollAnimation<HTMLElement>();
  const infoSectionAnim = useScrollAnimation<HTMLElement>();

  const examples = language === 'ko' ? examplesKo : examplesEn;
  const aiccExamples = language === 'ko' ? aiccExamplesKo : aiccExamplesEn;
  const categoryIcons = language === 'ko' ? categoryIconsKo : categoryIconsEn;
  const categories = useMemo(() => [...new Set(examples.map((e) => e.category))], [examples]);

  const [selectedAICCId, setSelectedAICCId] = useState(aiccExamples[0].id);
  const [editableText, setEditableText] = useState(aiccExamples[0].input);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedCategory(null);
    setSelectedAICCId(aiccExamples[0].id);
    setEditableText(aiccExamples[0].input);
  }, [language, aiccExamples]);

  const filteredExamples = useMemo(() => {
    if (!selectedCategory) return examples;
    return examples.filter((e) => e.category === selectedCategory);
  }, [selectedCategory, examples]);

  const currentExample = filteredExamples[currentIndex] || filteredExamples[0];

  const applyAutoTag = (text: string) => {
    return language === 'ko' ? korean.autoTag(text) : english.autoTag(text);
  };

  const applyManualTag = (text: string) => {
    return language === 'ko' ? korean.manualTag(text) : english.manualTag(text);
  };

  const applyAutoTagWithManual = (text: string) => {
    const manualTagged = language === 'ko' ? korean.manualTag(text) : english.manualTag(text);
    return language === 'ko' ? korean.autoTag(manualTagged) : english.autoTag(manualTagged);
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

  const ui = {
    subtitle:
      language === 'ko' ? 'TTS를 위한 텍스트 전처리 데모' : 'Text Preprocessing Demo for TTS',
    singleExample: language === 'ko' ? '단일 예시' : 'Single Examples',
    all: language === 'ko' ? '전체' : 'All',
    before: language === 'ko' ? 'Before (원본)' : 'Before (Original)',
    after: language === 'ko' ? 'After (오토태깅)' : 'After (Auto-tagged)',
    manualResult: language === 'ko' ? '수동 태깅 결과' : 'Manual Tag Result',
    combinedResult: language === 'ko' ? '자동 + 수동 태깅 결과' : 'Auto + Manual Tag Result',
    prev: language === 'ko' ? '이전' : 'Prev',
    next: language === 'ko' ? '다음' : 'Next',
    longExample: language === 'ko' ? '장문 예시 (AICC 시나리오)' : 'Long Text (AICC Scenarios)',
    selectScenario: language === 'ko' ? '시나리오 선택' : 'Select Scenario',
    inputEditable: language === 'ko' ? '입력 (수정 가능)' : 'Input (Editable)',
    autoTagResult: language === 'ko' ? '오토태깅 결과' : 'Auto-tagged Result',
    autoTagTitle: language === 'ko' ? '자동 태깅' : 'Auto Tagging',
    autoTagDesc:
      language === 'ko'
        ? '전화번호, 날짜, 시간, 금액 등 패턴을 자동으로 인식하여 TTS에 적합한 형태로 변환합니다.'
        : 'Automatically recognizes patterns like phone numbers, dates, times, and amounts for TTS.',
    manualTagTitle: language === 'ko' ? '수동 태깅' : 'Manual Tagging',
    combinedTagTitle: language === 'ko' ? '복합 태깅' : 'Combined Tagging',
    combinedTagDesc:
      language === 'ko'
        ? '수동 태그가 먼저 처리된 후, 나머지 텍스트에 자동 태깅이 적용됩니다.'
        : 'Manual tags are processed first, then auto-tagging is applied.',
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
              <code>{language === 'ko' ? 'name(홍길동)' : 'name(John)'}</code>,{' '}
              <code>digits(1234)</code>
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
