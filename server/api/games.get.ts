import { defineEventHandler, getQuery } from 'h3'

interface Request {
  id: string
  title: string
  children?: Request[]
}

const mockData: Request[] = [
  {
    id: '1',
    title: 'Запрос 1',
    children: [
      { id: '1-1', title: 'Дочерний запрос 1-1' },
      { id: '1-2', title: 'Дочерний запрос 1-2' }
    ]
  },
  { id: '2', title: 'Запрос 2' },
  { id: '3', title: 'Запрос 3' },
  // Добавьте по необходимости больше элементов
]

export default defineEventHandler((event) => {
  // Получаем параметры запроса из URL
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = 10
  const start = (page - 1) * limit
  // Возвращаем срез данных; H3 автоматически сформирует JSON-ответ
  return mockData.slice(start, start + limit)
})