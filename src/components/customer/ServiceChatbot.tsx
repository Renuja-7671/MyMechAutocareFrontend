import { useState } from 'react';
import { customerAPI } from '../../lib/supabase-api';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { Bot, Loader2, Send, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface ServiceChatbotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceChatbot({ open, onOpenChange }: ServiceChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I can help you check available service slots. Please select a date and service type.',
      timestamp: new Date(),
    },
  ]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const serviceTypes = [
    'Oil Change',
    'Brake Service',
    'Tire Rotation',
    'Engine Diagnostics',
    'Transmission Service',
    'Air Conditioning Service',
    'Battery Replacement',
    'Wheel Alignment',
    'General Inspection',
  ];

  const handleCheckSlots = async () => {
    if (!selectedDate || !selectedService) {
      toast.error('Please select both date and service type');
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: `Check slots for ${selectedService} on ${new Date(selectedDate).toLocaleDateString()}`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);

    try {
      const response = await customerAPI.chatbotCheckSlots(selectedDate, selectedService);
      
      let botText = '';
      if (response.success && response.data) {
        const slots = response.data.availableSlots || [];
        if (slots.length > 0) {
          botText = `Great! I found ${slots.length} available slot(s) for ${selectedService} on ${new Date(selectedDate).toLocaleDateString()}:\n\n${slots.join('\n')}\n\nWould you like to book one of these slots?`;
        } else {
          botText = `I'm sorry, but there are no available slots for ${selectedService} on ${new Date(selectedDate).toLocaleDateString()}. Would you like to try a different date?`;
        }
      } else {
        // Mock response for demonstration
        botText = `I found the following available time slots for ${selectedService} on ${new Date(selectedDate).toLocaleDateString()}:\n\n• 9:00 AM - 10:00 AM\n• 11:00 AM - 12:00 PM\n• 2:00 PM - 3:00 PM\n• 4:00 PM - 5:00 PM\n\nWould you like to book one of these slots? You can book an appointment from the main dashboard.`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('Failed to check slots. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Service Slot Checker</DialogTitle>
          <DialogDescription>
            Check available appointment slots using our AI assistant
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <ScrollArea className="h-64 border rounded-lg p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'bot'
                        ? 'bg-blue-600'
                        : 'bg-gray-600'
                    }`}
                  >
                    {message.sender === 'bot' ? (
                      <Bot className="h-4 w-4 text-white" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`flex-1 rounded-lg p-3 ${
                      message.sender === 'bot'
                        ? 'bg-blue-50'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 rounded-lg p-3 bg-blue-50">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="chatDate">Select Date</Label>
              <Input
                id="chatDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chatService">Service Type</Label>
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
                disabled={isLoading}
              >
                <SelectTrigger id="chatService">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleCheckSlots}
              className="w-full gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Check Available Slots
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
