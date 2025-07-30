
import type { Lead } from './definitions';

const LEADS_STORAGE_KEY = 'leadsData';

type LeadInput = Omit<Lead, 'id' | 'createdAt' | 'status'>;

export function saveLead(leadData: LeadInput) {
    if (typeof window === 'undefined') return;
    
    try {
        const newLead: Lead = {
            id: `LEAD-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'Novo',
            ...leadData,
        };

        const savedLeads = window.localStorage.getItem(LEADS_STORAGE_KEY);
        const leads: Lead[] = savedLeads ? JSON.parse(savedLeads) : [];

        leads.unshift(newLead); // Add new lead to the beginning

        window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
        
    } catch (error) {
        console.error("Failed to save lead:", error);
        // Optionally re-throw or handle the error in a different way
        throw new Error("Could not save lead data.");
    }
}
