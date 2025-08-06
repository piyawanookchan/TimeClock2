
export type TimestampType = 'in' | 'out';

export interface TimestampEntry {
  id: string;
  type: TimestampType;
  time: string; // ISO 8601 string format
}

export interface Employee {
  id: string;
  name: string;
  company: string;
  timestamps: TimestampEntry[];
}
