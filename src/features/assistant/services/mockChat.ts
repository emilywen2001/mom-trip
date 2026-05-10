/**
 * Mock LLM：根据关键词命中固定回复，按字流式吐出。
 * 真实 LLM 接通后把 useAICall 里的调用切回 assistantApi.chat 即可。
 */

interface Reply {
  match: RegExp
  text: string
}

const REPLIES: Reply[] = [
  {
    match: /春|花|游|去哪|推荐|城市/,
    text: '妈妈您要是想看花，三月底到四月初的杭州西湖、苏州拙政园都很合适。坐高铁两小时就到，不太累。',
  },
  {
    match: /带|东西|准备|行李/,
    text: '妈妈记得带这几样：身份证、舒服的旅游鞋、薄外套、帽子、墨镜、常用药、还有充电宝。其他到当地买就行啦。',
  },
  {
    match: /拍|照|相|出片/,
    text: '妈妈您找有色彩的背景拍最好看，比如油菜花、樱花、红墙。穿浅色衣服更出片，丝巾轻轻搭着，相机调到人像模式。',
  },
  {
    match: /胃|药|身体|病|不舒服|吃什么/,
    text: '胃溃疡的话辣的、酸的、生冷的都先别吃。多吃软糯一点的，小米粥、蒸蛋、煮烂的面条都行。出门记得带常备药哦。',
  },
  {
    match: /天气|冷|热|雨|下雨/,
    text: '妈妈您出门前看一眼当天天气预报，温差大就备件薄外套。下雨天景区会湿滑，记得穿防滑鞋，别赶时间。',
  },
  {
    match: /吃|好吃|美食|餐|饭/,
    text: '出去玩想吃地道的，认准当地老字号，问问出租车司机最准。早晨可以去菜市场尝早点，便宜又地道。',
  },
  {
    match: /累|休息|腿|脚|腰/,
    text: '妈妈不要赶景点，每天看两三个就够啦。中午一定回酒店歇一会儿，下午再出去逛会更有精神。',
  },
  {
    match: /姐妹|朋友|一起|团/,
    text: '姐妹团出去玩最热闹啦~ 建议穿同色系的衣服拍照特别好看。行程别排太满，留出时间一起喝茶聊天。',
  },
]

const FALLBACK_REPLIES = [
  '妈妈我听到啦~ 您再多说几句，我好帮您想想。',
  '小桥这就给您查查，您稍等哦~',
  '妈妈您说的这事儿挺有意思的，咱们慢慢聊。',
]

const FALLBACK_VOICE_TRANSCRIPTS = [
  '推荐适合妈妈的春游城市',
  '出门旅游要带什么东西',
  '怎么拍出好看的丝巾照',
  '今天天气适合出门吗',
]

let voiceFallbackIdx = 0

/** 录音模拟识别：按时长选简短的或较长的 mock 文本，循环演示 4 个推荐问题。 */
export function mockTranscribe(durationMs: number): string {
  if (durationMs < 500) return '嗯'
  const text = FALLBACK_VOICE_TRANSCRIPTS[voiceFallbackIdx % FALLBACK_VOICE_TRANSCRIPTS.length]
  voiceFallbackIdx += 1
  return text
}

function pickReply(userText: string): string {
  for (const r of REPLIES) {
    if (r.match.test(userText)) return r.text
  }
  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)]
}

/** 流式吐出 mock 回复，每段 30~60ms 触发 onDelta。 */
export async function mockChatStream(userText: string, onDelta: (delta: string) => void): Promise<string> {
  const full = pickReply(userText)
  // 按 2-3 字一段切分，模仿流式
  const chunks: string[] = []
  for (let i = 0; i < full.length; i += 2 + Math.floor(Math.random() * 2)) {
    chunks.push(full.slice(i, i + 2 + Math.floor(Math.random() * 2)))
  }
  for (const c of chunks) {
    await new Promise((r) => setTimeout(r, 40 + Math.random() * 30))
    onDelta(c)
  }
  return full
}
