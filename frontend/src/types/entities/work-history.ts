export interface WorkHistory {
  company: string
  position: string
  start_date: string
  end_date: string | null
  responsibilities: string
}

export interface UpdateWorkHistory extends WorkHistory {}
