export const assistantApi = {
  chat: async (
    message: string,
    context: { currentCity?: string; tripId?: string; currentDay?: number },
    history: { role: string; content: string }[],
    onDelta: (delta: string) => void
  ) => {
    const response = await fetch('/api/v1/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context, history }),
    })
    if (!response.ok) throw new Error(`backend ${response.status}`)
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let full = ''
    while (reader) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.delta) { onDelta(data.delta); full += data.delta }
          } catch { /* ignore */ }
        }
      }
    }
    return full
  },
}

export const explainApi = {
  byImage: (formData: FormData) =>
    fetch('/api/v1/explain/by-image', {
      method: 'POST',
      body: formData,
    }).then((r) => r.json()),
}
