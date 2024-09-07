import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './contexts/userContext.tsx';
import { SocketProvider } from './contexts/socketContext.tsx';
import { SelectedChatProvider } from './contexts/selectedChatContext.tsx';


const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SelectedChatProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </SelectedChatProvider>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
