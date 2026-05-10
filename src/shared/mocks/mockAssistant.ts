import type { RecommendCard } from '@/shared/types/assistant'

export const RECOMMEND_CARDS: RecommendCard[] = [
  { emoji: '🌸', text: '推荐适合妈妈的春游城市', question: '推荐适合妈妈的春游城市' },
  { emoji: '🎒', text: '出门旅游要带什么东西', question: '出门旅游要带什么东西' },
  { emoji: '📸', text: '怎么拍出好看的丝巾照', question: '怎么拍出好看的丝巾照' },
  { emoji: '🥘', text: '有胃溃疡不能吃哪些东西', question: '有胃溃疡不能吃哪些东西' },
]

// 兼容旧调用：仅取文本
export const QUICK_QUESTIONS = RECOMMEND_CARDS.map((c) => c.question)
