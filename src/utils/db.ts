import Dexie, { Table } from 'dexie';

export interface Patient {
  id?: number;
  name: string;
  age: number;
  gender: string;
  city: string;
  diabetesType: string;
  medications: string[];
  emergencyContact: string;
  reminderTime: string;
  language: 'en' | 'ur';
  createdAt: number;
  onboardingCompleted: boolean;
}

export interface Reading {
  id?: number;
  value: number;
  triageStatus: string;
  urduMessage: string;
  timestamp: number;
  type: 'fasting' | 'random' | 'post-meal';
}

export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant';
  message: string;
  timestamp: number;
}

export class MyDatabase extends Dexie {
  patients!: Table<Patient>;
  readings!: Table<Reading>;
  chatHistory!: Table<ChatMessage>;

  constructor() {
    super('GlucoBridgeDB');
    this.version(1).stores({
      patients: '++id, name, onboardingCompleted',
      readings: '++id, value, timestamp, type',
      chatHistory: '++id, role, timestamp'
    });
  }
}

export const db = new MyDatabase();
