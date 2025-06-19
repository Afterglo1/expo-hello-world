export interface Recording {
  id: string;
  title: string;
  uri: string;
  duration: number;
  createdAt: number;
  transcribedText?: string;
}
