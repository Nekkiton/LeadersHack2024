export interface WorkHistory {
  company: string
  job_title: string
  start_date: string
  end_date: string | null
  responsabilites: string
}

export interface UpdateWorkHistory extends WorkHistory {}
