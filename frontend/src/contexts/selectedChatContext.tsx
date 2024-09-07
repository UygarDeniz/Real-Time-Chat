import { createContext, useState, useContext } from 'react';


type SelectedChat = {
  chatId: string;
  to: string;
  toId: string;
};

type SelectedChatContextType = {
  selectedChat: SelectedChat | undefined;
  setSelectedChat: React.Dispatch<React.SetStateAction<{ chatId: string; to: string, toId:string } | undefined>>;
};

const SelectedChatContext = createContext<SelectedChatContextType | null>(null);

export function SelectedChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedChat, setSelectedChat] = useState<SelectedChat | undefined>(
      undefined
  );

  return (
    <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
      {children}
    </SelectedChatContext.Provider>
  );
}

export function useSelectedChat() {
  const context = useContext(SelectedChatContext);
  if (!context) {
    throw new Error(
      'useSelectedChat must be used within a SelectedChatProvider'
    );
  }
  return context;
}
