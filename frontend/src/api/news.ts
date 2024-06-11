import { Api } from '@/config/api'
import { createUseQuery } from '@/lib/create-use-query'

export const useNews = createUseQuery('news.all', Api.news.all)

export const useDailyNews = createUseQuery('news.daily', Api.news.daily)
