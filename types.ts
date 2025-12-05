export interface Alarm {
  id: string;
  hour: number;
  minute: number;
  label: string;
  isActive: boolean;
  repeat: boolean;
  days: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export interface BriefingResponse {
  greeting: string;
  quote: string;
  weatherTip: string;
}
