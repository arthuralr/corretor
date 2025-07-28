import type { ActivityLog } from './definitions';

const ACTIVITY_LOG_KEY = 'activityLog';
const MAX_LOG_ENTRIES = 50; // Keep the log from growing indefinitely

export function addActivityLog(logEntry: Omit<ActivityLog, 'id' | 'timestamp'>) {
    if (typeof window === 'undefined') return;
    
    try {
        const newLog: ActivityLog = {
            ...logEntry,
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString(),
        };

        const savedLog = window.localStorage.getItem(ACTIVITY_LOG_KEY);
        let logs: ActivityLog[] = savedLog ? JSON.parse(savedLog) : [];

        // Add the new log to the beginning of the array
        logs.unshift(newLog);

        // Keep the log size manageable
        if (logs.length > MAX_LOG_ENTRIES) {
            logs = logs.slice(0, MAX_LOG_ENTRIES);
        }

        window.localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(logs));
        
    } catch (error) {
        console.error("Failed to add activity log:", error);
    }
}
