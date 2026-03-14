export interface Job {
  id: number;
  title: string;
  category: string;
  post_date: string | null;
  last_date: string | null;
  short_info: string | null;
  content: string | null;
  external_link: string | null;
  location: string | null;
  job_type: string | null;
  industry: string | null;
  experience_level: string | null;
  qualification: string | null;
  is_filled: number;
  views: number;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export type Category = 
  | 'latest_job' 
  | 'admit_card' 
  | 'result' 
  | 'answer_key' 
  | 'syllabus' 
  | 'admission' 
  | 'important' 
  | 'certificate_verification';

export const CATEGORY_LABELS: Record<string, string> = {
  latest_job: 'Latest Job',
  admit_card: 'Admit Card',
  result: 'Result',
  answer_key: 'Answer Key',
  syllabus: 'Syllabus',
  admission: 'Admission',
  important: 'Important',
  certificate_verification: 'Certificate Verification',
};
