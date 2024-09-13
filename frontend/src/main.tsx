import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './contexts/UserContext.tsx';
import { SocketProvider } from './contexts/SocketContext.tsx';
import { SelectedChatProvider } from './contexts/SelectedChatContext.tsx';
import { ThemeProvider } from './contexts/ThemeProvider.tsx';
import { BrowserRouter as Router } from 'react-router-dom';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <UserProvider>
            <SelectedChatProvider>
              <SocketProvider>
                <App />
              </SocketProvider>
            </SelectedChatProvider>
          </UserProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
