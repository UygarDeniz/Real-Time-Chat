import {
  createContext,
  useState,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
} from 'react';

import { fetchCurrentUser } from '../../data-access/users';

type UserContextType = {
  name: string | undefined;
  id: string | undefined;
  setName: Dispatch<React.SetStateAction<string | undefined>>;
  setId: Dispatch<React.SetStateAction<string | undefined>>;
  loading: boolean;
};

const UserContext = createContext<null | UserContextType>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState<string | undefined>();
  const [id, setId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setName(user.name);
        setId(user.id);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        // Optionally, you can redirect to the login page here
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [name, id]);

  return (
    <UserContext.Provider value={{ name, id, setName, setId, loading }}>
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
