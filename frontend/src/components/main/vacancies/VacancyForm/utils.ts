export interface FormData {
  title: string
  scope_id: string
  description: string | null
  responsibilities: string
  candidate_expectation: string
  additions: string | null
  conditions: string | null
  work_type_id: string
  work_schedule_id: string
  work_experience_id: string
  salary_from: number | null
  salary_to: number | null
  skills: string[]
  stages: {
    title: string
    auto_interview: boolean
    approve_template: string
    reject_template: string
    _isRequired: boolean
  }[]
}

export const transformFormData = (data: FormData) => {
  return {
    ...data,
    stages: data.stages.map((i, idx) => ({
      ...i,
      position: idx,
    })),
  }
}
