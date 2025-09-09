// Use Vite env var with fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export const showBackendStatus = async (): Promise<void> => {
  const isHealthy = await checkBackendHealth();
  
  if (isHealthy) {
    console.log('✅ Backend is running and healthy');
  } else {
    console.warn('❌ Backend is not accessible. Please ensure:');
    console.warn(`1. Backend server is running on ${API_BASE_URL}`);
    console.warn('2. MongoDB is running');
    console.warn('3. Ollama is running with Llama3 model');
    console.warn('Run: cd backend && python run.py');
  }
};
