import { StudioSignatureData } from "@/types/studio";
import { StudioAction, studioReducer } from "../types";

export interface StudioHistoryState {
  past: StudioSignatureData[];
  present: StudioSignatureData;
  future: StudioSignatureData[];
}

export type StudioHistoryAction =
  | StudioAction
  | { type: "UNDO" }
  | { type: "REDO" };

const MAX_HISTORY_STEPS = 50;

export function studioHistoryReducer(
  state: StudioHistoryState,
  action: StudioHistoryAction
): StudioHistoryState {
  if (action.type === "UNDO") {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    return {
      past: newPast,
      present: previous,
      future: [state.present, ...state.future],
    };
  }

  if (action.type === "REDO") {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    return {
      past: [...state.past, state.present],
      present: next,
      future: newFuture,
    };
  }

  if (action.type === "SET_FULL_STATE") {
    return {
      past: [],
      present: action.payload,
      future: [],
    };
  }

  const nextPresent = studioReducer(state.present, action);
  if (nextPresent === state.present) {
    return state;
  }

  const newPast = [
    ...state.past.slice(Math.max(0, state.past.length - (MAX_HISTORY_STEPS - 1))),
    state.present,
  ];

  return {
    past: newPast,
    present: nextPresent,
    future: [],
  };
}
