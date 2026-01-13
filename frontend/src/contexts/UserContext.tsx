import {
  createContext,
  useState,
  Dispatch,
  ReactNode,
  useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import axios from '../api/axios';
import { useMutation } from '@tanstack/react-query';
type UserContextType = {
  user: User | undefined;
  setUser: Dispatch<
    React.SetStateAction<{ name: string; id: string } | undefined>
  >;
  accessToken: string | undefined;
  setAccessToken: Dispatch<React.SetStateAction<string | undefined>>;
  logout: () => void;
};

const UserContext = createContext<null | UserContextType>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserContextType['user']>();
  const [accessToken, setAccessToken] =
    useState<UserContextType['accessToken']>();
  const navigate = useNavigate();

  const { mutate: logout } = useMutation({
    mutationFn: () => axios.post('/api/auth/logout'),
    onSuccess: () => {
      setUser(undefined);
      setAccessToken(undefined);
      navigate('/login');
    },
  });

  return (
    <UserContext.Provider
      value={{ user, setUser, accessToken, setAccessToken, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
