import { v4 as uuidv4 } from 'uuid';

export interface CallScheduleParams {
  leadName: string;
  company: string;
  phoneNumber: string;
  scheduledTime: string;
}

export interface VoiceCall {
  id: string;
  leadName: string;
  company: string;
  phoneNumber: string;
  scheduledTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'failed';
  outcome?: 'meeting_booked' | 'callback_requested' | 'not_interested' | 'no_answer';
  duration?: string;
  transcript?: string;
  liveTranscript?: string[];
  intentScore?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  nextSteps?: string;
  keyPoints?: string[];
  callSummary?: {
    mainTopics: string[];
    customerConcerns: string[];
    actionItems: string[];
    followUpNeeded: boolean;
  };
}

interface CallAnalysis {
  intentScore: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  nextSteps: string;
}

class VoiceCallService {
  private static instance: VoiceCallService;
  private mockTranscriptParts: string[] = [
    "Hi Raj, you just saw our ad about solar panels — do you have a few minutes?",
    "Yes, I'm interested but I have some concerns about the installation process.",
    "I completely understand. The installation is actually quite straightforward. Our certified technicians handle everything from permits to setup. What specific concerns do you have?",
    "Well, I'm worried about potential roof damage and how long it will take.",
    "That's a great question. We use non-invasive mounting systems that actually protect your roof. The entire installation typically takes just 1-2 days. We also provide a 25-year warranty on both the panels and installation.",
    "That sounds reassuring. What about the cost? I've heard solar is expensive.",
    "I appreciate you bringing that up. While there is an upfront investment, most of our customers see a return within 5-7 years through energy savings. Plus, there are currently federal tax credits covering 30% of the cost. Would you like me to calculate your potential savings?",
    "Yes, that would be helpful. And what about maintenance?",
    "The panels are virtually maintenance-free. They're self-cleaning with rain, and we monitor performance remotely. If any issues arise, our service team responds within 24 hours. Would you like to schedule a free consultation to get a custom quote?",
    "Yes, I think that would be good. What times are available?",
    "Great! We have openings tomorrow at 2 PM or Friday at 10 AM. Which works better for you?",
    "Tomorrow at 2 PM works for me.",
    "Perfect! I've scheduled your consultation for tomorrow at 2 PM. You'll receive a confirmation email shortly with the details. Is there anything else you'd like to know?",
    "No, that covers everything for now. Thank you.",
    "Thank you, Raj! Looking forward to helping you go solar. Have a great day!"
  ];

  private constructor() {}

  public static getInstance(): VoiceCallService {
    if (!VoiceCallService.instance) {
      VoiceCallService.instance = new VoiceCallService();
    }
    return VoiceCallService.instance;
  }

  async scheduleCall(params: CallScheduleParams): Promise<VoiceCall> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: uuidv4(),
      ...params,
      status: 'scheduled'
    };
  }

  async getCallStatus(id: string): Promise<VoiceCall> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockCalls: { [key: string]: Partial<VoiceCall> } = {
      '1': {
        status: 'in-progress',
        liveTranscript: this.mockTranscriptParts.slice(0, 3),
        duration: '1:30'
      },
      '2': {
        status: 'completed',
        outcome: 'meeting_booked',
        duration: '4:15',
        transcript: this.mockTranscriptParts.join('\n\n'),
        intentScore: 85,
        sentiment: 'positive',
        nextSteps: 'Consultation scheduled for tomorrow at 2 PM',
        keyPoints: [
          'Customer showed interest in solar panels',
          'Addressed concerns about installation and roof damage',
          'Discussed cost and ROI timeline',
          'Explained maintenance requirements',
          'Scheduled consultation appointment'
        ],
        callSummary: {
          mainTopics: ['Installation process', 'Cost and ROI', 'Maintenance requirements'],
          customerConcerns: ['Roof damage', 'Installation timeline', 'Initial cost', 'Maintenance needs'],
          actionItems: ['Send consultation confirmation email', 'Prepare custom savings calculation'],
          followUpNeeded: true
        }
      },
      '3': {
        status: 'failed',
        outcome: 'no_answer',
        duration: '0:15'
      }
    };

    return {
      id,
      leadName: 'Raj Kumar',
      company: 'Tech Solutions Inc',
      phoneNumber: '+1234567890',
      scheduledTime: '2024-03-20T14:00:00',
      ...mockCalls[id]
    } as VoiceCall;
  }

  async getTranscript(id: string): Promise<string> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return this.mockTranscriptParts.join('\n\n');
  }

  async getLiveTranscript(id: string): Promise<string[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.mockTranscriptParts.slice(0, 3);
  }

  async analyzeIntent(transcript: string): Promise<{
    intentScore: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    nextSteps: string;
  }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      intentScore: 85,
      sentiment: 'positive',
      nextSteps: 'Consultation scheduled for tomorrow at 2 PM'
    };
  }
}

export default VoiceCallService; 