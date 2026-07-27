import { createRoot } from 'react-dom/client';

import App from './App';

import './index.css';

// SentinelAI is dark-mode only
document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')!).render(<App />);
