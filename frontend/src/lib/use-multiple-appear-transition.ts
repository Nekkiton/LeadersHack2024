import { useEffect, useState } from 'react'
import { Site } from '@/config/site'

export const useMultipleAppearTransition = <
  Item extends { id: string } = { id: string }
>(
  value: Item[]
) => {
  const [items, setItems] = useState<
    {
      id: string
      isActive: boolean
      value: Item
    }[]
  >([])

  useEffect(() => {
    const newItems = JSON.parse(JSON.stringify(items)) as typeof items

    value.forEach((item) => {
      const found = newItems.find((i) => i.value.id === item.id)
      if (found) {
        found.value = item
      } else {
        newItems.push({
          id: item.id,
          value: item,
          isActive: true,
        })
      }
    })

    newItems.forEach((item) => {
      if (value.every((i) => i.id !== item.value.id)) {
        item.isActive = false
        setTimeout(() => {
          setItems((prev) => prev.filter((i) => i.id !== item.id))
        }, Site.transition.duration)
      }
    })

    setItems(newItems)
  }, [value])
  // TODO: eslint warning

  return items
}
