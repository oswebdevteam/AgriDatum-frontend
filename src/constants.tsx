import {
  MessageSquare, 
  X,             
  Send,          
  Leaf,          
  Bot,           
  Link,          
} from 'lucide-react';


export const Icons = {
  
  Chat: () => <MessageSquare size={24} />,
  
  Close: () => <X size={20} />,
  
  Send: () => <Send size={20} />,
  
  Leaf: () => <Leaf size={24} />,
  
  Robot: () => <Bot size={24} />,
  
  Link: () => <Link size={14} />,
};

export const INITIAL_MESSAGE_TEXT = "Hello! I'm your AgriDatum farming assistant. I can help you with market prices, weather updates, planting tips, and more. How can I help your farm today?";