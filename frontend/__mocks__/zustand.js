// Mock for Zustand state management library
const createState = (initialState) => {
  let state = typeof initialState === 'function' 
    ? initialState((updater) => {
      if (typeof updater === 'function') {
        state = { ...state, ...updater(state) };
      } else {
        state = { ...state, ...updater };
      }
    }, () => state, {}) 
    : initialState;
  
  const setState = (updater, replace) => {
    if (typeof updater === 'function') {
      state = replace ? updater(state) : { ...state, ...updater(state) };
    } else {
      state = replace ? updater : { ...state, ...updater };
    }
    listeners.forEach(listener => listener(state));
  };
  
  const getState = () => state;
  
  const listeners = new Set();
  
  const useStore = (selector = s => s) => {
    // In tests, we just return the selected state
    return selector(state);
  };
  
  // Add store methods that tests can access
  useStore.setState = setState;
  useStore.getState = getState;
  useStore.subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  
  return useStore;
};

// Set up the default export and named exports to support all import styles
const mockCreate = createState;

// This ensures default import works: import create from 'zustand'
module.exports = mockCreate;

// Support for named imports: import { create } from 'zustand'
module.exports.create = mockCreate;

// Support for mixed imports: import create, { createStore } from 'zustand'
module.exports.createStore = createState;