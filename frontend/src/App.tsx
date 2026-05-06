import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Calendar, 
  Brain, 
  Moon, 
  Zap, 
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import './App.css';

interface PredictionResult {
  name: string;
  predicted_score: number;
  strategy: string;
  metrics_summary: {
    academic_standing: string;
  };
}

function App() {
  const [formData, setFormData] = useState({
    name: '',
    study_hours: 20,
    attendance: 85,
    prev_grade: 75,
    sleep_hours: 7,
    stress_level: 5
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${apiUrl}/predict`, formData);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to connect to the prediction engine. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (standing: string) => {
    switch (standing) {
      case 'Excellent': return 'status-excellent';
      case 'Good': return 'status-good';
      case 'Needs Improvement': return 'status-warning';
      case 'At Risk': return 'status-danger';
      default: return '';
    }
  };

  return (
    <div className="container">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <header className="header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>EduPulse AI</h1>
          <p>Predict your academic future and unlock personalized success strategies.</p>
        </motion.div>
      </header>

      <main className="main-grid">
        {/* Input Section */}
        <motion.section 
          className="glass card"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain className="text-primary" /> Student Metrics
            </h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Enter your name" 
                required 
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>
                Weekly Study Hours <span>{formData.study_hours}h</span>
              </label>
              <input 
                type="range" 
                name="study_hours" 
                min="0" max="100" 
                value={formData.study_hours}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>
                Attendance Percentage <span>{formData.attendance}%</span>
              </label>
              <input 
                type="range" 
                name="attendance" 
                min="0" max="100" 
                value={formData.attendance}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>
                Previous Grade <span>{formData.prev_grade}%</span>
              </label>
              <input 
                type="range" 
                name="prev_grade" 
                min="0" max="100" 
                value={formData.prev_grade}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>
                Avg Sleep Hours <span>{formData.sleep_hours}h</span>
              </label>
              <input 
                type="range" 
                name="sleep_hours" 
                min="0" max="24" 
                value={formData.sleep_hours}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>
                Stress Level (1-10) <span>{formData.stress_level}</span>
              </label>
              <input 
                type="range" 
                name="stress_level" 
                min="1" max="10" 
                value={formData.stress_level}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="predict-btn" disabled={loading}>
              {loading ? <div className="loader" /> : <><Zap size={20} /> Generate Prediction</>}
            </button>
          </form>
        </motion.section>

        {/* Result Section */}
        <section className="result-container">
          <AnimatePresence mode="wait">
            {!result && !loading && !error && (
              <motion.div 
                key="placeholder"
                className="glass card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem 2rem' }}
              >
                <GraduationCap size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
                <h3>Waiting for Input</h3>
                <p>Fill in your academic metrics to see your predicted performance and AI-generated roadmap.</p>
              </motion.div>
            )}

            {error && (
              <motion.div 
                key="error"
                className="glass card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444' }}>
                  <AlertCircle />
                  <h3>Error</h3>
                </div>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>{error}</p>
                <button 
                  onClick={handleSubmit} 
                  className="predict-btn" 
                  style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444' }}
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                className="glass card result-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <div className="prediction-score">
                  <div className="score-circle">
                    <span className="value">{result.predicted_score}%</span>
                    <span className="label">Expected Grade</span>
                  </div>
                  <h2>Analysis for {result.name}</h2>
                  <span className={`status-badge ${getStatusClass(result.metrics_summary.academic_standing)}`}>
                    {result.metrics_summary.academic_standing}
                  </span>
                </div>

                <div className="insights-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1.5rem',
                  margin: '2rem 0'
                }}>
                  <div className="glass card insight-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Clock className="text-primary" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formData.study_hours}h</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Study/Week</div>
                  </div>
                  <div className="glass card insight-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Calendar className="text-primary" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formData.attendance}%</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Attendance</div>
                  </div>
                  <div className="glass card insight-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Moon className="text-primary" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formData.sleep_hours}h</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Daily Sleep</div>
                  </div>
                </div>

                <hr style={{ opacity: 0.1, margin: '2rem 0' }} />

                <div className="strategy-section">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <BookOpen size={20} className="text-primary" /> AI Roadmap
                  </h3>
                  <div className="strategy-content">
                    <ReactMarkdown>{result.strategy}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer style={{ marginTop: '4rem', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        &copy; 2026 EduPulse AI. Powered by Groq Llama 3.
      </footer>
    </div>
  );
}

export default App;
