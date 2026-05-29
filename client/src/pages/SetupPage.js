// client/src/pages/SetupPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  RiUserSmileLine, RiCodeSSlashLine, RiArrowLeftLine, RiRocketLine,
  RiUpload2Line, RiFileTextLine, RiAlertLine, RiInformationLine
} from 'react-icons/ri';

function SetupPage() {
  const [type, setType] = useState('');
  const [questionCount, setQuestionCount] = useState(7);
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => setResumeText(evt.target.result);
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  };

  const handleStart = async () => {
    if (!type) { setError('Please select an interview type'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/interviews/start', { type, questionCount, resumeText });
      navigate(`/interview/${res.data.interviewId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview');
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 680 }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '2rem' }}>
          <Link to="/dashboard" className="flex gap-1 btn btn-ghost btn-sm" style={{ width: 'fit-content', marginBottom: '1rem', textDecoration: 'none' }}>
            <RiArrowLeftLine size={15} /> Back
          </Link>
          <h1 style={{ fontSize: '1.7rem', marginBottom: '.25rem' }}>Interview Setup</h1>
          <p>Configure your mock interview session</p>
        </div>

        {error && (
          <div className="alert alert-error scale-in">
            <RiAlertLine size={16} style={{ flexShrink: 0 }} /> {error}
          </div>
        )}

        {/* Type */}
        <div className="card fade-up delay-1" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '.95rem', marginBottom: '1rem', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '.07em' }}>
            Select Type
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <TypeCard
              title="HR Interview"
              desc="Behavioral, soft skills & situational"
              icon={RiUserSmileLine}
              color="var(--blue)"
              selected={type === 'HR'}
              onClick={() => { setType('HR'); setError(''); }}
            />
            <TypeCard
              title="Technical"
              desc="Algorithms, systems & coding concepts"
              icon={RiCodeSSlashLine}
              color="var(--violet)"
              selected={type === 'Technical'}
              onClick={() => { setType('Technical'); setError(''); }}
            />
          </div>
        </div>

        {/* Count */}
        <div className="card fade-up delay-2" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '.95rem', marginBottom: '1rem', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '.07em' }}>
            Questions: <span style={{ color: 'var(--t1)', fontFamily: 'var(--mono)' }}>{questionCount}</span>
          </h2>
          <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
            {[5, 6, 7, 8, 9, 10].map(n => (
              <button key={n} onClick={() => setQuestionCount(n)}
                className={`btn ${questionCount === n ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                style={{ minWidth: 44 }}>
                {n}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '.8rem', color: 'var(--t3)', marginTop: '.65rem' }}>
            Each question allows 3 minutes in strict mode.
          </p>
        </div>

        {/* Resume */}
        <div className="card fade-up delay-3" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '.95rem', marginBottom: '.4rem', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '.07em' }}>
            Resume <span style={{ color: 'var(--t3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
          </h2>
          <p style={{ fontSize: '.875rem', marginBottom: '1rem' }}>
            Upload your resume to personalize questions.
          </p>

          {/* Drop zone */}
          <div
            onClick={() => document.getElementById('resumeFile').click()}
            style={{
              border: `1.5px dashed ${resumeText ? 'var(--green)' : 'var(--line2)'}`,
              borderRadius: 'var(--r)', padding: '1.25rem', textAlign: 'center',
              cursor: 'pointer', transition: 'border-color .2s, background .2s',
              background: resumeText ? 'var(--green-dim)' : 'transparent',
              marginBottom: '.75rem'
            }}
            onMouseEnter={e => !resumeText && (e.currentTarget.style.borderColor = 'var(--blue)')}
            onMouseLeave={e => !resumeText && (e.currentTarget.style.borderColor = 'var(--line2)')}
          >
            <input type="file" id="resumeFile" style={{ display: 'none' }} accept=".txt,.md" onChange={handleFile} />
            {resumeText
              ? <div className="flex gap-2" style={{ justifyContent: 'center' }}>
                  <RiFileTextLine size={18} color="var(--green)" />
                  <span style={{ fontSize: '.875rem', color: 'var(--green)' }}>Loaded ({resumeText.length} chars)</span>
                </div>
              : <div className="flex gap-2" style={{ justifyContent: 'center' }}>
                  <RiUpload2Line size={18} color="var(--t3)" />
                  <span style={{ fontSize: '.875rem', color: 'var(--t3)' }}>Click to upload .txt or .md</span>
                </div>
            }
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Or paste text</label>
            <textarea className="form-input" value={resumeText} onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your resume or key experience here..." style={{ minHeight: 80 }} />
          </div>
        </div>

        {/* Notice + Start */}
        <div className="fade-up delay-4">
          <div className="alert alert-amber flex gap-2" style={{ marginBottom: '1rem' }}>
            <RiInformationLine size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span><strong>Strict Mode:</strong> Questions appear one by one with a 3-minute timer. No skipping or pausing.</span>
          </div>
          <button className="btn btn-green btn-lg w-full flex gap-2" onClick={handleStart} disabled={loading || !type}>
            {loading
              ? <><div className="spinner" /> Preparing interview...</>
              : <><RiRocketLine size={18} /> Start {type || '...'} Interview ({questionCount} Questions)</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function TypeCard({ title, desc, icon: Icon, color, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      padding: '1.25rem', borderRadius: 'var(--r2)', cursor: 'pointer',
      border: `1.5px solid ${selected ? color : 'var(--line)'}`,
      background: selected ? `${color}12` : 'var(--bg4)',
      transition: 'all .2s', textAlign: 'center',
      transform: selected ? 'scale(1.02)' : 'scale(1)',
      boxShadow: selected ? `0 0 20px ${color}25` : 'none'
    }}>
      <div style={{ marginBottom: '.65rem', display: 'flex', justifyContent: 'center' }}>
        <Icon size={28} color={selected ? color : 'var(--t3)'} />
      </div>
      <div style={{ fontWeight: 600, marginBottom: '.2rem', fontSize: '.95rem', color: selected ? color : 'var(--t1)' }}>{title}</div>
      <div style={{ fontSize: '.78rem', color: 'var(--t3)', lineHeight: 1.4 }}>{desc}</div>
      {selected && <div style={{ marginTop: '.6rem' }}><span className="badge badge-green">Selected</span></div>}
    </div>
  );
}

export default SetupPage;
