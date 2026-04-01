import { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChatbotProps {
  onClose: () => void;
}

const BOT_RESPONSES: Record<string, string> = {
  lost: "I can help you find lost items! Try browsing the Lost Items page or report your lost item with details.",
  found: "Check the Found Items page to see if someone found your item. You can also report a found item.",
  claim: "To claim an item, go to Found Items, click 'Claim', upload proof of ownership, and wait for admin approval.",
  help: "I can help with: reporting lost/found items, claiming items, or navigating the platform. What do you need?",
};

const Chatbot = ({ onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: "Hi! I'm the UPES Lost & Found assistant. Ask me about lost or found items at UPES!", isBot: true },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');

    const lower = userMsg.toLowerCase();
    let response = "I'm not sure about that. Try asking about lost items, found items, or how to claim an item!";
    for (const [key, val] of Object.entries(BOT_RESPONSES)) {
      if (lower.includes(key)) { response = val; break; }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 bg-card rounded-2xl shadow-xl border border-border/50 flex flex-col max-h-96 animate-scale-in">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm text-foreground">UPES Assistant</h3>
        <p className="text-xs text-muted-foreground">Ask about lost or found items</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.isBot ? 'bg-muted text-foreground' : 'gradient-primary text-primary-foreground'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-border flex gap-2">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="text-sm"
        />
        <button onClick={handleSend} className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
          <Send className="w-4 h-4 text-primary-foreground" />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
