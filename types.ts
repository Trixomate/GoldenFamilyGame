
export interface Answer {
  text: string;
  percentage: number;
}

export interface Question {
  type?: 'question';
  id?: number;
  variant?: 3 | 6;
  question: string;
  answers: Answer[];
}

export interface Transition {
  type: 'transition';
  title: string;
  subtitle?: string;
}

export type GameItem = Question | Transition;

export interface TeamState {
  score: number;
  strikes: boolean[];
}
