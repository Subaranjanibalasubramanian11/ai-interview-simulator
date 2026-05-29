// client/src/pages/ResultPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  RiArrowLeftLine, RiRefreshLine, RiCheckboxCircleLine, RiErrorWarningLine,
  RiTimeLine, RiTrophyLine, RiBarChartBoxLine, RiChatSmileLine,
  RiArrowDownSLine, RiArrowUpSLine, RiSparklingLine
} from 'react-icons/ri';

function ResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get(`/api/results/${id}`)
      .then(r => setResult(r.data.result))
      .catch(() => setError('Failed to load result'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="spinner" style={{ width: 36, height: 36 }} />
    </div>
  );

  if (error || !result) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="card text-center" style={{ maxWidth: 400 }}>
        <div className="alert alert-error">{error || 'Result not found'}</div>
        <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
      </div>
    </div>
  );

  const { totalScore, confidenceLevel, aiFeedback, answers, type, duration, completedAt } = result;

  const scoreColor = s => s >= 70 ? 'var(--green)' : s >= 50 ? 'var(--amber)' : 'var(--red)';
  const confCls = l => ({ High: 'badge-green', Medium: 'badge-amber', Low: 'badge-red' }[l] || 'badge-blue');
  const grade = totalScore >= 85 ? 'Excellent' : totalScore >= 70 ? 'Good' : totalScore >= 50 ? 'Average' : 'Needs Work';

  const fmtDur = s => s ? `${Math.floor(s / 60)}m ${s % 60}s` : '-';
  const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // SVG ring
  const R = 52, C = 2 * Math.PI * R;
  const dashOffset = C - (totalScore / 100) * C;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 820 }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '1.75rem' }}>
          <Link to="/dashboard" className="btn btn-ghost btn-sm flex gap-1" style={{ width: 'fit-content', marginBottom: '.85rem', textDecoration: 'none' }}>
            <RiArrowLeftLine size={14} /> Dashboard
          </Link>
          <h1 style={{ fontSize: '1.7rem', marginBottom: '.25rem' }}>Interview Results</h1>
          <p style={{ fontSize: '.875rem' }}>
            {type} Interview · {fmtDate(completedAt)}{duration ? ` · ${fmtDur(duration)}` : ''}
          </p>
        </div>

        {/* Score overview */}
        <div className="card glow fade-up delay-1" style={{
          display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap',
          marginBottom: '1.25rem', padding: '1.75rem 2rem',
          background: 'linear-gradient(135deg, rgba(59,130,246,.06), rgba(139,92,246,.05))',
          borderColor: 'rgba(59,130,246,.22)'
        }}>
          {/* Ring */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width={130} height={130} viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={65} cy={65} r={R} fill="none" stroke="var(--bg2)" strokeWidth={10} />
              <circle cx={65} cy={65} r={R} fill="none" stroke={scoreColor(totalScore)} strokeWidth={10}
                strokeDasharray={C} strokeDashoffset={dashOffset} strokeLinecap="round"
                className="ring-fill"
                style={{ filter: `drop-shadow(0 0 8px ${scoreColor(totalScore)}55)` }} />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '1.6rem', fontWeight: 700, color: scoreColor(totalScore) }}>{totalScore}</div>
              <div style={{ fontSize: '.7rem', color: 'var(--t3)' }}>/ 100</div>
            </div>
          </div>

          {/* Grade */}
          <div style={{ flex: 1, minWidth: 180 }}>
            <div className="flex gap-2" style={{ marginBottom: '.5rem', alignItems: 'center' }}>
              <RiTrophyLine size={22} color={scoreColor(totalScore)} />
              <h2 style={{ fontSize: '1.4rem', color: scoreColor(totalScore) }}>{grade}</h2>
            </div>
            <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
              <span className={`badge ${type === 'Technical' ? 'badge-violet' : 'badge-blue'}`}>{type}</span>
              <span className={`badge ${confCls(confidenceLevel)}`}>{confidenceLevel} Confidence</span>
              <span className="badge badge-blue">{answers.length} Questions</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', flexShrink: 0 }}>
            <MiniStat label="Duration" value={fmtDur(duration)} icon={RiTimeLine} />
            <MiniStat
              label="Filler Words"
              value={answers.reduce((s, a) => s + a.fillerWordCount, 0)}
              icon={RiBarChartBoxLine}
              color={answers.reduce((s, a) => s + a.fillerWordCount, 0) > 5 ? 'var(--red)' : 'var(--green)'}
            />
          </div>
        </div>

        {/* AI Feedback */}
        <div className="card fade-up delay-2" style={{ marginBottom: '1.25rem' }}>
          <div className="flex gap-2" style={{ marginBottom: '1rem' }}>
            <RiSparklingLine size={18} color="var(--blue)" />
            <h2 style={{ fontSize: '1rem' }}>AI Feedback</h2>
          </div>

          <div style={{
            background: 'var(--bg2)', borderRadius: 'var(--r)', padding: '1rem',
            borderLeft: '3px solid var(--blue)', marginBottom: '1.25rem'
          }}>
            <p style={{ color: 'var(--t1)', lineHeight: 1.65, fontSize: '.925rem' }}>{aiFeedback?.overall}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Strengths */}
            <div>
              <div className="flex gap-1" style={{ marginBottom: '.65rem' }}>
                <RiCheckboxCircleLine size={15} color="var(--green)" />
                <h3 style={{ fontSize: '.85rem', color: 'var(--green)' }}>Strengths</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
                {(aiFeedback?.strengths || []).map((s, i) => (
                  <div key={i} style={{
                    background: 'var(--green-dim)', border: '1px solid rgba(16,217,160,.2)',
                    borderRadius: 'var(--r)', padding: '.6rem .8rem', fontSize: '.85rem', color: 'var(--t2)', lineHeight: 1.45
                  }}>{s}</div>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div>
              <div className="flex gap-1" style={{ marginBottom: '.65rem' }}>
                <RiErrorWarningLine size={15} color="var(--amber)" />
                <h3 style={{ fontSize: '.85rem', color: 'var(--amber)' }}>Areas to Improve</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
                {(aiFeedback?.improvements || []).map((s, i) => (
                  <div key={i} style={{
                    background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,.2)',
                    borderRadius: 'var(--r)', padding: '.6rem .8rem', fontSize: '.85rem', color: 'var(--t2)', lineHeight: 1.45
                  }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Per-question breakdown */}
        <div className="fade-up delay-3" style={{ marginBottom: '2rem' }}>
          <div className="flex gap-2" style={{ marginBottom: '1rem' }}>
            <RiChatSmileLine size={18} color="var(--t3)" />
            <h2 style={{ fontSize: '1rem' }}>Question Breakdown</h2>
          </div>

          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
            {answers.map((a, i) => (
              <div key={a.questionId} className="card" style={{ padding: '1rem 1.25rem', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className="flex gap-3">
                  {/* Score circle */}
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${scoreColor(a.score)}`,
                    background: `${scoreColor(a.score)}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '.82rem', color: scoreColor(a.score)
                  }}>
                    {a.score}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '.9rem', color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '.25rem' }}>
                      Q{i + 1}: {a.question}
                    </p>
                    <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                      {a.fillerWordCount > 0 && <span className="badge badge-red">{a.fillerWordCount} filler word{a.fillerWordCount > 1 ? 's' : ''}</span>}
                      {a.matchedKeywords?.length > 0 && <span className="badge badge-green">{a.matchedKeywords.length} keywords</span>}
                    </div>
                  </div>

                  {/* Mini score bar */}
                  <div style={{ width: 72, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <div className="progress-wrap" style={{ width: '100%' }}>
                      <div style={{
                        height: '100%', width: `${a.score}%`, borderRadius: 999,
                        background: scoreColor(a.score), transition: 'width .6s ease'
                      }} />
                    </div>
                  </div>

                  {expanded === i ? <RiArrowUpSLine size={17} color="var(--t3)" /> : <RiArrowDownSLine size={17} color="var(--t3)" />}
                </div>

                {expanded === i && (
                  <div className="scale-in" style={{ marginTop: '.75rem', paddingTop: '.75rem', borderTop: '1px solid var(--line)' }}>
                    <p style={{ fontSize: '.78rem', color: 'var(--t3)', marginBottom: '.35rem' }}>Your answer:</p>
                    <p style={{ fontSize: '.875rem', color: 'var(--t2)', lineHeight: 1.6, fontStyle: a.answer ? 'normal' : 'italic' }}>
                      {a.answer || '(No answer provided)'}
                    </p>
                    {a.matchedKeywords?.length > 0 && (
                      <div style={{ marginTop: '.6rem' }}>
                        <p style={{ fontSize: '.75rem', color: 'var(--t3)', marginBottom: '.3rem' }}>Matched keywords:</p>
                        <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                          {a.matchedKeywords.map(k => <span key={k} className="badge badge-green" style={{ fontSize: '.68rem' }}>{k}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="fade-up delay-4 flex gap-2" style={{ flexWrap: 'wrap' }}>
          <Link to="/setup" className="btn btn-green btn-lg flex gap-2">
            <RiRefreshLine size={17} /> Try Again
          </Link>
          <Link to="/dashboard" className="btn btn-ghost btn-lg flex gap-1">
            <RiArrowLeftLine size={16} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon, color = 'var(--t2)' }) {
  return (
    <div className="flex gap-2" style={{ alignItems: 'center' }}>
      <Icon size={14} color={color} />
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: '.9rem', color }}>{value}</div>
        <div style={{ fontSize: '.7rem', color: 'var(--t3)' }}>{label}</div>
      </div>
    </div>
  );
}

export default ResultPage;
