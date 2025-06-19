import { createContext, useContext, useState, ReactNode } from 'react';
import { Lead } from '../types/lead';

interface LeadContextType {
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  removeLead: (id: string) => void;
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider = ({ children }: { children: ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const addLead = (lead: Lead) => {
    setLeads(prev => [...prev, lead]);
  };

  const updateLead = (id: string, updatedLead: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, ...updatedLead } : lead
    ));
  };

  const removeLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  return (
    <LeadContext.Provider value={{
      leads,
      addLead,
      updateLead,
      removeLead,
      selectedLead,
      setSelectedLead
    }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
}; 