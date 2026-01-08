
export interface Answer {
  text: string;
  percentage: number;
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

export interface TeamState {
  score: number;
  strikes: boolean[];
}
