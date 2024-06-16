import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import {
  useCreateNews,
  useCurRecruiterNewsSingle,
  useDeleteNews,
  useUpdateNews,
} from '@/api/news'
import { Routes } from '@/config/routes'
import { FormData, getInitialData, transformData } from './utils'
import moment from 'moment'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import FileUpload from '@/components/ui/FileUpload'
import DatePicker from '@/components/ui/DatePicker'
import TimePicker from '@/components/ui/TimePicker'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import styles from './NewsForm.module.scss'

interface Props {
  backLink?: {
    text: string
    url: string
  }
  editId?: string
}

export default function NewsForm({ backLink, editId }: Props) {
  const router = useRouter()

  const news = useCurRecruiterNewsSingle(editId!, { enabled: !!editId })

  const { control, handleSubmit, setError, reset } = useForm<FormData>({
    defaultValues: getInitialData(
      news.status === 'success' ? news.value : undefined
    ),
  })

  useEffect(() => {
    if (news.status === 'success') {
      reset(getInitialData(news.value))
    }
  }, [(news as any).value])

  const { mutate: create, status: createStatus } = useCreateNews({ setError })
  const { mutate: update, status: updateStatus } = useUpdateNews({ setError })
  const { mutate: remove, status: deleteStatus } = useDeleteNews()

  const onSubmit = handleSubmit((data) => {
    if (editId && news.status === 'success') {
      update(
        { ...transformData(data), pk: news.value._id },
        {
          onSuccess: () => {
            router.push(Routes.recruiterNews)
          },
        }
      )
    } else {
      create(transformData(data), {
        onSuccess: () => {
          router.push(Routes.recruiterNews)
        },
      })
    }
  })

  const deleteNews = () => {
    if (news.status === 'success') {
      remove(news.value._id, {
        onSuccess: () => {
          router.push(Routes.recruiterNews)
        },
      })
    }
  }

  return (
    <div className={styles.container}>
      {backLink && (
        <Button type="text" href={backLink.url}>
          <Icon icon="chevronLeft" />
          <span>{backLink.text}</span>
        </Button>
      )}
      <h1>{editId ? 'Редактировать новость' : 'Создать новость'}</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <Controller
          control={control}
          name="title"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              error={fieldState.error}
              label="Название *"
              placeholder="Укажите название новости"
            />
          )}
        />
        <Controller
          control={control}
          name="image"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <FileUpload
              {...field}
              error={fieldState.error}
              label="Обложка *"
              formats={['jpg', 'png']}
              maxSize={5 * 1024 * 1024}
            />
          )}
        />
        <Controller
          control={control}
          name="text"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              error={fieldState.error}
              label="Контент новости *"
              placeholder="Напишите текст новости"
            />
          )}
        />
        <Controller
          control={control}
          name="publication_date"
          render={({ field, fieldState }) => (
            <div className={styles.checkboxField}>
              <p className={styles.checkboxFieldLabel}>
                Дата и время публикации
              </p>
              <Checkbox
                error={fieldState.error}
                value={field.value ? false : true}
                onChange={(val) => field.onChange(val ? null : moment())}
              >
                Опубликовать сразу
              </Checkbox>
            </div>
          )}
        />
        <div className={styles.fieldsRow}>
          <Controller
            control={control}
            name="publication_date"
            render={({ field, fieldState }) => (
              <DatePicker
                {...field}
                error={fieldState.error}
                label="Дата публикации"
                placeholder="Выберите дату"
              />
            )}
          />
          <Controller
            control={control}
            name="publication_date"
            render={({ field, fieldState }) => (
              <TimePicker
                {...field}
                error={fieldState.error}
                label="Время публикации"
                placeholder="Выберите время"
              />
            )}
          />
        </div>
        <div className={styles.controls}>
          <Button
            type="primary"
            htmlType="submit"
            loading={createStatus === 'pending' || updateStatus === 'pending'}
          >
            {editId ? 'Сохранить' : 'Опубликовать'}
          </Button>
          {editId && (
            <Button
              type="text"
              className={styles.removeBtn}
              onClick={deleteNews}
              loading={deleteStatus === 'pending'}
            >
              <Icon className={styles.removeIcon} icon="trash" />
              <span>Удалить новость</span>
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
