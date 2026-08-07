import { Question, GameSettings, GameHistoryItem } from '../types';
import { DEFAULT_QUESTIONS, DEFAULT_SETTINGS } from '../data/defaultData';

const QUESTIONS_KEY = 'ular_tangga_ppkn_questions_v1';
const SETTINGS_KEY = 'ular_tangga_ppkn_settings_v1';
const HISTORY_KEY = 'ular_tangga_ppkn_history_v1';

export const loadQuestions = (): Question[] => {
  try {
    const data = localStorage.getItem(QUESTIONS_KEY);
    if (!data) {
      saveQuestions(DEFAULT_QUESTIONS);
      return DEFAULT_QUESTIONS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_QUESTIONS;
  } catch (err) {
    console.error('Failed to load questions from localStorage:', err);
    return DEFAULT_QUESTIONS;
  }
};

export const saveQuestions = (questions: Question[]): void => {
  try {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  } catch (err) {
    console.error('Failed to save questions to localStorage:', err);
  }
};

export const loadSettings = (): GameSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) {
      saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (err) {
    console.error('Failed to load settings from localStorage:', err);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
  }
};

export const loadGameHistory = (): GameHistoryItem[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to load history from localStorage:', err);
    return [];
  }
};

export const saveGameHistoryItem = (item: GameHistoryItem): void => {
  try {
    const current = loadGameHistory();
    const updated = [item, ...current].slice(0, 50); // keep last 50 games
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save history item:', err);
  }
};

export const resetAllDataToDefault = (): void => {
  try {
    localStorage.removeItem(QUESTIONS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(HISTORY_KEY);
    saveQuestions(DEFAULT_QUESTIONS);
    saveSettings(DEFAULT_SETTINGS);
  } catch (err) {
    console.error('Failed to reset localStorage:', err);
  }
};
