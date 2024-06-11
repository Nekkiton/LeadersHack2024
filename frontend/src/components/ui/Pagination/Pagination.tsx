import { useMemo } from 'react'
import classNames from 'classnames'
import BaseButton from '@/components/ui/BaseButton'
import Icon from '@/components/ui/Icon'
import styles from './Pagination.module.scss'

interface Props {
  className?: string
  page: number
  totalPages: number
  loadPage: (page: number) => void
}

export default function Pagination({
  className,
  page,
  totalPages,
  loadPage: loadPage_,
}: Props) {
  const currentPage = useMemo(() => page + 1, [page])
  const lastPage = totalPages
  const loadPage = (val: number) => loadPage_(val - 1)

  if (lastPage === 1) {
    return null
  }

  return (
    <div className={classNames(styles.pages, className)}>
      {currentPage > 1 && (
        <BaseButton
          className={styles.pagesMoveBtn}
          onClick={() => loadPage(currentPage - 1)}
          hoverable
        >
          <Icon icon="chevronLeft" />
        </BaseButton>
      )}
      <BaseButton
        className={classNames(styles.page, {
          [styles.showed]: currentPage >= 4,
          [styles.mobileShowed]: currentPage >= 3,
        })}
        onClick={() => loadPage(1)}
      >
        1
      </BaseButton>
      <Icon
        className={classNames(styles.pagesSeparator, {
          [styles.showed]: currentPage >= 5,
          [styles.mobileShowed]: currentPage >= 4,
        })}
        icon="moreH"
      />
      {Array.from({ length: 5 }).map((_, idx) => {
        let page = currentPage + idx - 2
        return (
          <BaseButton
            className={classNames(styles.page, {
              [styles.active]: page === currentPage,
              [styles.showed]: page > 0 && page <= lastPage,
              [styles.mobileShowed]:
                page > 0 &&
                Math.abs(page - currentPage) < 2 &&
                page <= lastPage,
            })}
            onClick={() => loadPage(page)}
            key={idx}
          >
            {page}
          </BaseButton>
        )
      })}
      <Icon
        className={classNames(styles.pagesSeparator, {
          [styles.showed]: currentPage + 4 <= lastPage,
          [styles.mobileShowed]: currentPage + 3 <= lastPage,
        })}
        icon="moreH"
      />
      <BaseButton
        className={classNames(styles.page, {
          [styles.showed]: currentPage + 3 <= lastPage,
          [styles.mobileShowed]: currentPage + 2 <= lastPage,
        })}
        onClick={() => loadPage(lastPage)}
      >
        {lastPage}
      </BaseButton>
      {currentPage < lastPage && (
        <BaseButton
          className={styles.pagesMoveBtn}
          onClick={() => loadPage(currentPage + 1)}
          hoverable
        >
          <Icon icon="chevronRight" />
        </BaseButton>
      )}
    </div>
  )
}
