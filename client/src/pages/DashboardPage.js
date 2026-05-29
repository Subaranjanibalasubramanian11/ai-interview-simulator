// client/src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  RiPlayCircleLine, RiHistoryLine, RiBarChartLine, RiTrophyLine,
  RiArrowRightLine, RiTimeLine, RiCheckboxCircleLine, RiFlashlightLine
} from 'react-icons/ri';

function DashboardPage() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchResults(); }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get('/api/results');
      setResults(res.data.results || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const totalInterviews = results.length;
  const avgScore = totalInterviews > 0 ? Math.round(results.reduce((s, r) => s + r.totalScore, 0) / totalInterviews) : 0;
  const bestScore = totalInterviews > 0 ? Math.max(...results.map(r => r.totalScore)) : 0;

  const scoreColor = s => s >= 70 ? 'var(--green)' : s >= 50 ? 'var(--amber)' : 'var(--red)';
  const confidenceCls = l => ({ High: 'badge-green', Medium: 'badge-amber', Low: 'badge-red' }[l] || 'badge-blue');

  const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const fmtDur = s => { if (!s) return '-'; return `${Math.floor(s / 60)}m ${s % 60}s`; };

  return (
    <div className="page">
      <div className="container">

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.7rem', marginBottom: '.25rem' }}>
            Hey, <span style={{ color: 'var(--blue)' }}>{user?.name}</span>
          </h1>
          <p>Track your progress and keep practicing.</p>
        </div>

        {/* Stat cards */}
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard label="Interviews" value={totalInterviews} icon={RiBarChartLine} color="var(--blue)" />
          <StatCard label="Avg Score" value={`${avgScore}%`} icon={RiFlashlightLine} color="var(--violet)" highlight />
          <StatCard label="Best Score" value={`${bestScore}%`} icon={RiTrophyLine} color="var(--amber)" />
        </div>

        {/* CTA banner */}
        <div className="card glow fade-up delay-3" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
          marginBottom: '2rem', padding: '1.5rem 1.75rem',
          background: 'linear-gradient(135deg, rgba(59,130,246,.08), rgba(139,92,246,.06))',
          borderColor: 'rgba(59,130,246,.28)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '.25rem' }}>Ready to practice?</h2>
            <p style={{ fontSize: '.875rem' }}>Simulate a real interview with AI-powered feedback.</p>
          </div>
          <Link to="/setup" className="btn btn-primary btn-lg flex gap-1">
            <RiPlayCircleLine size={18} /> Start Interview <RiArrowRightLine size={15} />
          </Link>
        </div>

        {/* History */}
        <div className="fade-up delay-4">
          <div className="flex gap-2" style={{ marginBottom: '1rem' }}>
            <RiHistoryLine size={18} color="var(--t3)" />
            <h2 style={{ fontSize: '1rem' }}>Previous Attempts</h2>
            {totalInterviews > 0 && <span className="badge badge-blue">{totalInterviews}</span>}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: 72 }} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem' }}>
              <RiPlayCircleLine size={36} color="var(--t3)" style={{ margin: '0 auto .75rem' }} />
              <p style={{ marginBottom: '1rem' }}>No interviews yet. Start your first one!</p>
              <Link to="/setup" className="btn btn-primary">Begin Practice</Link>
            </div>
          ) : (
            <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
              {results.map(result => (
                <Link key={result._id} to={`/result/${result._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{
                    padding: '1rem 1.25rem',
                    display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
                    cursor: 'pointer', transition: 'border-color .2s, transform .2s'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    {/* Score circle */}
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${scoreColor(result.totalScore)}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `${scoreColor(result.totalScore)}15`
                    }}>
                      <span style={{ fontWeight: 700, fontSize: '.85rem', fontFamily: 'var(--mono)', color: scoreColor(result.totalScore) }}>
                        {result.totalScore}
                      </span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex gap-1" style={{ marginBottom: '.3rem', flexWrap: 'wrap' }}>
                        <span className={`badge ${result.type === 'Technical' ? 'badge-violet' : 'badge-blue'}`}>{result.type}</span>
                        <span className={`badge ${confidenceCls(result.confidenceLevel)}`}>{result.confidenceLevel} Confidence</span>
                      </div>
                      <p style={{ fontSize: '.82rem', color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {result.aiFeedback?.overall?.slice(0, 85)}...
                      </p>
                    </div>

                    {/* Meta */}
                    <div style={{ textAlign: 'right', flexShrink: 0, fontSize: '.78rem', color: 'var(--t3)' }}>
                      <div className="flex gap-1" style={{ justifyContent: 'flex-end', marginBottom: '.2rem' }}>
                        <RiCheckboxCircleLine size={12} /> {fmtDate(result.completedAt)}
                      </div>
                      <div className="flex gap-1" style={{ justifyContent: 'flex-end' }}>
                        <RiTimeLine size={12} /> {fmtDur(result.duration)}
                      </div>
                    </div>

                    <RiArrowRightLine size={16} color="var(--t3)" style={{ flexShrink: 0 }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, highlight }) {
  return (
    <div className="card" style={{
      textAlign: 'center', padding: '1.25rem',
      background: highlight ? 'linear-gradient(135deg, rgba(139,92,246,.08), rgba(59,130,246,.06))' : undefined,
      borderColor: highlight ? 'rgba(139,92,246,.25)' : undefined
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.5rem' }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ fontSize: '1.55rem', fontWeight: 800, fontFamily: 'var(--display)', color }}>{value}</div>
      <div style={{ fontSize: '.78rem', color: 'var(--t3)', marginTop: '.2rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
    </div>
  );
}

export default DashboardPage;
