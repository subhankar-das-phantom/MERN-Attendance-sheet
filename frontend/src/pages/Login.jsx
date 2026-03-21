import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, GraduationCap, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/login', { username, password });
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success("Welcome back!");
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-400/20 dark:bg-primary-900/40 mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-pulse transition-transform duration-1000"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-emerald-400/20 dark:bg-emerald-900/40 mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-pulse transition-transform duration-1000" style={{ animationDelay: '2s' }}></div>

      {/* Main Container */}
      <div className="relative max-w-md w-full z-10 flex flex-col items-center">
        
        {/* Logo/Icon Container */}
        <div className="w-20 h-20 mb-8 bg-gradient-to-tr from-primary-600 to-primary-400 dark:from-primary-700 dark:to-primary-500 rounded-2xl shadow-xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
          <GraduationCap className="h-10 w-10 text-white" />
        </div>

        {/* Glassmorphic Login Card */}
        <div className="w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/50 dark:border-gray-700/50 transition-colors relative overflow-hidden group">
          
          {/* Subtle inner top glow inside card */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Attendify
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Sign in to manage student attendance
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              
              {/* Floating Label Input: Username */}
              <div className="relative group/input">
                <input
                  type="text"
                  required
                  id="username"
                  className="peer appearance-none bg-gray-50/50 dark:bg-gray-800/50 block w-full px-4 pt-6 pb-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder=" "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label 
                  htmlFor="username"
                  className="absolute text-sm font-semibold text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary-600 dark:peer-focus:text-primary-400"
                >
                  Username
                </label>
              </div>

              {/* Floating Label Input: Password */}
              <div className="relative group/input">
                <input
                  type="password"
                  required
                  id="password"
                  className="peer appearance-none bg-gray-50/50 dark:bg-gray-800/50 block w-full px-4 pt-6 pb-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label 
                  htmlFor="password"
                  className="absolute text-sm font-semibold text-gray-500 dark:text-gray-400 transition-all duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary-600 dark:peer-focus:text-primary-400"
                >
                  Password
                </label>
              </div>

            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group/btn relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gray-900 hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/30 shadow-lg shadow-gray-900/20 dark:shadow-primary-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 relative z-10">
                    <LogIn className="h-4 w-4 opacity-90 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                    Sign in to Account
                  </span>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
