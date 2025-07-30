
import type { ActivityLog } from './definitions';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const ACTIVITY_LOG_KEY = 'activityLog'; // This can be removed if not used elsewhere

export async function addActivityLog(logEntry: Omit<ActivityLog, 'id' | 'timestamp'>) {
    if (typeof window === 'undefined') return;
    
    try {
        const newLog = {
            ...logEntry,
            timestamp: new Date().toISOString() // Keep client-side timestamp for immediate display if needed
        };
        
        // Add to Firestore
        await addDoc(collection(db, "activityLog"), {
             ...logEntry,
             timestamp: serverTimestamp() // Use server timestamp for consistency
        });

        // Optional: Dispatch an event for real-time updates in other components
        window.dispatchEvent(new CustomEvent('dataUpdated'));

    } catch (error) {
        console.error("Failed to add activity log to Firestore:", error);
    }
}
