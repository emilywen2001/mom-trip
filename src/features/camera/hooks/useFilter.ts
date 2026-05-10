import { useState, useMemo, useCallback } from 'react'

export interface Filter {
  id: string
  name: string
  emoji: string
  cssFilter: string
  description: string
  previewColor: string
}

export const FILTERS: Filter[] = [
  {
    id: 'original',
    name: '原图',
    emoji: '🌿',
    cssFilter: 'none',
    description: '保持原始效果',
    previewColor: '#8FBC8F',
  },
  {
    id: 'ruddy',
    name: '红润',
    emoji: '😊',
    cssFilter: 'saturate(1.3) contrast(1.05) hue-rotate(-8deg)',
    description: '让肤色红润自然',
    previewColor: '#E8A090',
  },
  {
    id: 'film',
    name: '胶片',
    emoji: '📷',
    cssFilter: 'sepia(0.4) contrast(1.1) brightness(0.95)',
    description: '复古胶片风格',
    previewColor: '#C4A882',
  },
  {
    id: 'cinema',
    name: '电影感',
    emoji: '🎬',
    cssFilter: 'contrast(1.2) saturate(0.8) brightness(0.9)',
    description: '高级电影质感',
    previewColor: '#607080',
  },
  {
    id: 'warm',
    name: '暖阳',
    emoji: '☀️',
    cssFilter: 'saturate(1.2) sepia(0.2) brightness(1.05) hue-rotate(-15deg)',
    description: '温暖阳光氛围',
    previewColor: '#E8C070',
  },
  {
    id: 'fresh',
    name: '清新',
    emoji: '🌊',
    cssFilter: 'saturate(0.9) brightness(1.08) hue-rotate(10deg)',
    description: '清爽自然风格',
    previewColor: '#80C8D8',
  },
]

export function useFilter() {
  const [selectedFilter, setSelectedFilter] = useState<Filter>(FILTERS[0])
  const [filterIntensity, setFilterIntensity] = useState(0.65)

  const computedCSSFilter = useMemo(() => {
    if (selectedFilter.id === 'original') return 'none'
    return selectedFilter.cssFilter
  }, [selectedFilter])

  const selectFilter = useCallback((filter: Filter) => {
    setSelectedFilter(filter)
  }, [])

  return { selectedFilter, filterIntensity, computedCSSFilter, selectFilter, setFilterIntensity }
}
