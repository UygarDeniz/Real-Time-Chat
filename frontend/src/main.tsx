import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './contexts/userContext.tsx';
import { SocketProvider } from './contexts/socketContext.tsx';
import { SelectedChatProvider } from './contexts/selectedChatContext.tsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/themeProvider.tsx';

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
