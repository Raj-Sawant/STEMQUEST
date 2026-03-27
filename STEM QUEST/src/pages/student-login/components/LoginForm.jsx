import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import axios from 'axios';

const LoginForm = ({ language = 'en', isOffline = false }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student',
    grade: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = 'http://127.0.0.1:5000/api/auth';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/register' : '/login';
      const response = await axios.post(`${API_URL}${endpoint}`, formData);

      const { token, user } = response.data;
      localStorage.setItem('stemquest_token', token);
      localStorage.setItem('stemquest_user', JSON.stringify({ ...user, isAuthenticated: true }));

      if (user.role === 'teacher') {
        navigate('/student-analytics');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Something went wrong. Please check your connection.';
      setError(errorMsg);
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter italic italic game-text-shadow">
          {isRegister ? 'JOIN_QUEST' : 'MISSION'}
        </h1>
        <p className="text-blue-400 text-xs cyber-text opacity-70 tracking-widest">
          {isRegister ? 'ESTABLISHING_NEW_IDENTITY' : 'AUTHENTICATING_USER'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 console-panel p-10 border-t-2 border-t-blue-500/50">
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm font-bold flex items-center">
            <Icon name="AlertCircle" size={18} className="mr-2" />
            {error}
          </div>
        )}

        <Input
          label="USERNAME"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="enter name"
          required
        />

        <Input
          label="PASSWORD"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          required
        />

        {isRegister && (
          <div className="space-y-6 animate-in">
            <div className="flex flex-col space-y-3">
              <label className="text-[10px] cyber-text text-slate-500 tracking-widest">RANK_SPECIFICATION</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, role: 'student' }))}
                  className={`py-3 rounded-xl border font-black transition-all cyber-text text-xs ${formData.role === 'student' ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, role: 'teacher' }))}
                  className={`py-3 rounded-xl border font-black transition-all cyber-text text-xs ${formData.role === 'teacher' ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`}
                >
                  Teacher
                </button>
              </div>
            </div>

            {formData.role === 'student' && (
              <div className="flex flex-col space-y-3">
                <label className="text-[10px] cyber-text text-slate-500 tracking-widest">GRADE</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl border border-blue-500/30 bg-slate-950/50 text-white cyber-text focus:border-blue-500 outline-none appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6].map(g => <option key={g} value={g} className="bg-slate-900">LEVEL_{g}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isLoading}
          className="bg-blue-600 hover:bg-blue-500 text-white cyber-text h-14 tracking-widest text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          {isRegister ? 'REGISTER' : 'SIGN IN'}
        </Button>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-400 font-bold text-[10px] cyber-text tracking-widest hover:text-blue-300 transition-colors"
          >
            {isRegister ? ' EXISTING_USER ? LOGIN' : 'NEW USER? REGISTER'}
          </button>
        </div>
      </form>


    </div>
  );
};

export default LoginForm;