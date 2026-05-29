// client/src/pages/InterviewPage.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  RiMicLine, RiStopCircleLine, RiArrowRightLine,
  RiCheckboxCircleLine, RiTimeLine, RiAlertLine
} from 'react-icons/ri';

const QUESTION_TIME = 180;

function InterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [justAdvanced, setJustAdvanced] = useState(false);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/api/interviews/${id}`);
        const data = res.data.interview;
        if (data.status === 'completed') { navigate(`/result/${id}`); return; }
        setInterview(data); setQuestions(data.questions); setIsLoading(false);
      } catch { setError('Failed to load interview'); setIsLoading(false); }
    };
    load();
  }, [id, navigate]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    setVoiceSupported(true);
    recognitionRef.current = new SR();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = e => {
      let t = '';
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setAnswers(prev => {
        const q = questions[currentIndex];
        return q ? { ...prev, [q.id]: t } : prev;
      });
    };
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onend = () => setIsListening(false);
  }, [questions, currentIndex]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) { recognitionRef.current.stop(); setIsListening(false); }
  }, [isListening]);

  const finishInterview = useCallback(async () => {
    if (isFinishing) return;
    setIsFinishing(true);
    clearInterval(timerRef.current);
    stopListening();
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    try {
      await axios.post(`/api/results/complete/${id}`, { duration });
      navigate(`/result/${id}`);
    } catch { setError('Failed to complete interview.'); setIsFinishing(false); }
  }, [isFinishing, id, navigate, stopListening]);

  const handleAutoAdvance = useCallback(async () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    try {
      await axios.post(`/api/interviews/${id}/answer`, { questionId: currentQ.id, answer: answers[currentQ.id] || '' });
    } catch {}
    if (currentIndex < questions.length - 1) {
      setJustAdvanced(true);
      setTimeout(() => setJustAdvanced(false), 600);
      setCurrentIndex(p => p + 1);
      setTimeLeft(QUESTION_TIME);
    } else { finishInterview(); }
  }, [questions, currentIndex, answers, id, finishInterview]);

  useEffect(() => {
    if (isLoading || questions.length === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(timerRef.current); handleAutoAdvance(); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isLoading, questions, currentIndex, handleAutoAdvance]);

  const handleNext = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    clearInterval(timerRef.current);
    const currentQ = questions[currentIndex];
    try {
      await axios.post(`/api/interviews/${id}/answer`, { questionId: currentQ.id, answer: answers[currentQ.id] || '' });
      if (currentIndex < questions.length - 1) {
        setJustAdvanced(true); setTimeout(() => setJustAdvanced(false), 600);
        setCurrentIndex(p => p + 1); setTimeLeft(QUESTION_TIME);
      } else { finishInterview(); }
    } catch { setError('Failed to submit answer'); }
    finally { setIsSubmitting(false); }
  };

  const toggleListening = () => {
    if (isListening) { stopListening(); return; }
    if (recognitionRef.current) { recognitionRef.current.start(); setIsListening(true); }
  };

  const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const timerColor = timeLeft <= 30 ? 'var(--red)' : timeLeft <= 60 ? 'var(--amber)' : 'var(--green)';
  const progress = (currentIndex / questions.length) * 100;

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner" style={{ width: 36, height: 36 }} />
      <p>Loading interview...</p>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="card text-center" style={{ maxWidth: 400 }}>
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    </div>
  );

  if (isFinishing) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner" style={{ width: 44, height: 44 }} />
      <h2>Generating AI Feedback...</h2>
      <p style={{ fontSize: '.875rem' }}>Analyzing your performance — this may take a moment.</p>
    </div>
  );

  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentQ?.id] || '';
  const wordCount = currentAnswer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 780 }}>

        {/* Progress bar */}
        <div className={`card fade-up ${justAdvanced ? 'scale-in' : ''}`} style={{ padding: '1rem 1.5rem', marginBottom: '1rem' }}>
          <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '.7rem', flexWrap: 'wrap', gap: '.5rem' }}>
            <span style={{ fontSize: '.82rem', color: 'var(--t3)' }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex gap-2">
              <span className={`badge ${interview?.type === 'Technical' ? 'badge-violet' : 'badge-blue'}`}>{interview?.type}</span>
              {/* Timer */}
              <div className={`flex gap-1 ${timeLeft <= 30 ? 'timer-urgent' : ''}`} style={{
                fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: 700, color: timerColor,
                padding: '.2rem .65rem', background: 'var(--bg2)', borderRadius: 'var(--r)',
                border: `1px solid ${timerColor}44`
              }}>
                <RiTimeLine size={15} style={{ marginTop: 1 }} /> {fmtTime(timeLeft)}
              </div>
            </div>
          </div>
          <div className="progress-wrap">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className={`card glow ${justAdvanced ? 'scale-in' : 'fade-up delay-1'}`} style={{ marginBottom: '1rem' }}>
          <div className="flex gap-3" style={{ alignItems: 'flex-start' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'var(--blue-dim)', border: '1px solid rgba(59,130,246,.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: 'var(--blue)', fontSize: '.85rem', fontFamily: 'var(--mono)'
            }}>
              {currentIndex + 1}
            </div>
            <div>
              {currentQ?.category && (
                <span className="badge badge-violet" style={{ marginBottom: '.5rem', display: 'inline-block' }}>
                  {currentQ.category}
                </span>
              )}
              <h2 style={{ fontSize: '1.1rem', lineHeight: 1.55, color: 'var(--t1)' }}>{currentQ?.question}</h2>
            </div>
          </div>
        </div>

        {/* Answer */}
        <div className="card fade-up delay-2" style={{ marginBottom: '1rem' }}>
          <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '.75rem', flexWrap: 'wrap', gap: '.5rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Your Answer</label>
            <div className="flex gap-2">
              {isListening && <div className="pulse-dot" />}
              {voiceSupported && (
                <button
                  onClick={toggleListening}
                  className={`btn btn-sm flex gap-1 ${isListening ? 'btn-red' : 'btn-ghost'}`}
                >
                  {isListening ? <><RiStopCircleLine size={14} /> Stop</> : <><RiMicLine size={14} /> Voice</>}
                </button>
              )}
            </div>
          </div>

          {isListening && (
            <div className="alert alert-info flex gap-2" style={{ marginBottom: '.75rem', fontSize: '.83rem' }}>
              <RiMicLine size={15} style={{ flexShrink: 0 }} /> Listening — speak clearly into your microphone.
            </div>
          )}

          <textarea
            className="form-input"
            value={currentAnswer}
            onChange={e => setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
            placeholder="Type your answer or use voice input above..."
            style={{ minHeight: 148 }}
          />

          <div className="flex" style={{ justifyContent: 'space-between', marginTop: '.4rem' }}>
            <span style={{ fontSize: '.78rem', color: 'var(--t3)' }}>
              {currentAnswer.length} chars {wordCount > 0 && `· ${wordCount} words`}
            </span>
            {!voiceSupported && (
              <span style={{ fontSize: '.75rem', color: 'var(--t3)' }}>Voice input: Chrome recommended</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          {currentIndex < questions.length - 1 ? (
            <button className="btn btn-primary btn-lg flex gap-1" onClick={handleNext} disabled={isSubmitting}>
              {isSubmitting
                ? <><div className="spinner" /> Saving...</>
                : <>Next Question <RiArrowRightLine size={16} /></>
              }
            </button>
          ) : (
            <button className="btn btn-green btn-lg flex gap-2" onClick={handleNext} disabled={isSubmitting}>
              {isSubmitting
                ? <><div className="spinner" /> Finishing...</>
                : <><RiCheckboxCircleLine size={18} /> Submit and Get Feedback</>
              }
            </button>
          )}
        </div>

        <p className="text-center" style={{ fontSize: '.75rem', color: 'var(--t3)', marginTop: '1.25rem' }}>
          <RiAlertLine size={12} style={{ verticalAlign: 'middle', marginRight: '.25rem' }} />
          Strict Mode — timer auto-advances at 0:00
        </p>
      </div>
    </div>
  );
}

export default InterviewPage;
