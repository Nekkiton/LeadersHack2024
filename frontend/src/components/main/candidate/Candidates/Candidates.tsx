import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useCandidates } from '@/api/candidates'
import { FiltersFormData, transformFilters } from './utils'
import RemoteData from '@/components/special/RemoteData'
import Icon from '@/components/ui/Icon'
import Pagination from '@/components/ui/Pagination'
import CandidateCard from '@/components/base/candidates/CandidateCard'
import CandidatesFilters from './CandidatesFilters'
import styles from './Candidates.module.scss'

export default function Candidates() {
  const formMethods = useForm<FiltersFormData>({
    defaultValues: {
      query: null,
      work_experiences: [],
      skills: [],
    },
  })
  const { watch } = formMethods
  const filters = watch()

  const [page, setPage] = useState(0)
  const [candidatesExist, setCandidatesExist] = useState<null | boolean>(null)

  const candidates = useCandidates({ ...transformFilters(filters), page })

  useEffect(() => {
    if (candidatesExist === null && candidates.status === 'success') {
      setCandidatesExist(!!candidates.value.items.length)
    }
  }, [candidates, candidatesExist])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>База резюме</h1>
      </div>
      {candidatesExist && (
        <FormProvider {...formMethods}>
          <CandidatesFilters />
        </FormProvider>
      )}
      <RemoteData
        data={candidates}
        renderSuccess={(candidates) =>
          !candidatesExist ? (
            <div className={styles.nothing}>
              <Icon className={styles.nothingIcon} icon="documentLoupe" />
              <p>
                В базе еще нет ни одного резюме. Как только кто-то откликнется
                <br />
                на вакансию или пришлет свою анкету, это отобразится здесь
              </p>
            </div>
          ) : (
            <>
              {candidates.items.length ? (
                candidates.items.map((candidate) => (
                  <CandidateCard
                    candidate={candidate}
                    type="expandedBottom"
                    key={candidate._id}
                  />
                ))
              ) : (
                <div className={styles.nothing}>
                  <Icon className={styles.nothingIcon} icon="loupeOff" />
                  <p>К сожалению, по вашему запросу ничего не найдено</p>
                </div>
              )}
              <Pagination
                page={candidates.page}
                totalPages={candidates.total_pages}
                loadPage={(val) => setPage(val)}
              />
            </>
          )
        }
      />
    </div>
  )
}
