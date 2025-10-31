export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}

export interface LogMessage {
  service: string;
  action: string;
  timestamp: Date;
  data: any;
  level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';
}

export interface LogResponse {
  id: string;
  service: string;
  action: string;
  timestamp: Date;
  data: any;
  level: string;
}
