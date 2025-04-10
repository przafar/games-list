import { defineEventHandler, getQuery } from 'h3'

interface Game {
  id: string
  name: string
  order: number
  children?: Game[]
}

const mockData: Game[] = [
  {
    id: '1',
    name: 'DOTA 2',
    order: 1,
    children: [
      { id: '1-1', name: 'Alchemist', order: 1 },
      { id: '1-2', name: 'Anti-Mage', order: 2 },
      { id: '1-3', name: 'BristleBack', order: 2 },
      { id: '1-4', name: 'Clinkz', order: 2 },
      { id: '1-5', name: 'Arcana', order: 2 }
    ]
  },
  {
    id: '2',
    name: 'CS2',
    order: 2,
    children: [
      {
        id: '2-1',
        name: 'Knives',
        order: 1
      }
    ]
  },
  {
    id: '3',
    name: 'Gloves',
    order: 3
  },
  {
    id: '4',
    name: 'Knives',
    order: 4
  },
  {
    id: '5',
    name: 'Pistols',
    order: 5,
    children: [
      { id: '5-1', name: 'Desert Eagle', order: 1 },
      { id: '5-2', name: 'Glock', order: 2 }
    ]
  },
  {
    id: '6',
    name: 'Rifles',
    order: 6
  },
  {
    id: '7',
    name: 'SMGs',
    order: 7
  },
  {
    id: '8',
    name: 'RUST',
    order: 8,
    children: [
      { id: '8-1', name: 'Wood', order: 1 },
      { id: '8-2', name: 'Metal', order: 2 }
    ]
  },
  {
    id: '9',
    name: 'OtherGame',
    order: 9,
    children: [
      { id: '9-1', name: 'Extra1', order: 1 },
      { id: '9-2', name: 'Extra2', order: 2 }
    ]
  },
  {
    id: '10',
    name: 'FIFA22',
    order: 10
  },
  {
    id: '11',
    name: 'Fortnite',
    order: 11
  },
  {
    id: '12',
    name: 'Apex Legends',
    order: 12
  },
  {
    id: '13',
    name: 'Overwatch',
    order: 13
  },
  {
    id: '14',
    name: 'Valorant',
    order: 14
  },
  {
    id: '15',
    name: 'Minecraft',
    order: 15,
    children: [
      { id: '15-1', name: 'Survival', order: 1 },
      { id: '15-2', name: 'Creative', order: 2 }
    ]
  }
]

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = 5
  const start = (page - 1) * limit
  const end = start + limit
  const items = mockData.slice(start, end)

  return {
    items,
    total: mockData.length
  }
})