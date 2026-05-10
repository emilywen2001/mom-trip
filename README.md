# 妈妈的旅行小助手 🌸

专为 50–70 岁中老年女性打造的 AI 旅行伴侣 App（Demo 版）。

## 功能模块

| 模块 | 功能 |
|------|------|
| 🏠 首页 | 当日行程进度、天气卡片、AI 穿搭推荐、旅行记忆回顾 |
| 🗺️ 行程 | 每日时间轴浏览、AI 智能规划新行程、攻略文本解析 |
| 🤖 AI 助手 | 流式对话、语音输入/播报（豆包 ASR+TTS）、景点问答 |
| 📷 拍照 | 相机实时预览、美颜滤镜、姿势引导、旅行相册管理 |
| 👤 我的 | 足迹统计、紧急联系人、安全设置 |

## 技术栈

**前端**
- React 19 + TypeScript
- Vite 8（PWA 支持）
- Tailwind CSS 4
- Zustand（状态管理）
- TanStack Query（服务端状态）
- Framer Motion（动画）
- React Router 7

**后端**
- Python + FastAPI
- GLM-5.1（智谱 AI，通过 Anthropic 兼容接口调用）
- 豆包语音（火山引擎 ASR + TTS）
- OpenWeatherMap（天气数据）

## 项目结构

```
mom-travel/
├── src/
│   ├── app/               # 路由、全局 Provider
│   ├── features/          # 按功能模块划分
│   │   ├── home/          # 首页
│   │   ├── itinerary/     # 行程规划
│   │   ├── assistant/     # AI 助手
│   │   ├── camera/        # 拍照
│   │   └── profile/       # 我的
│   └── shared/            # 公共组件、类型、API、Store、Mock
│       ├── api/
│       ├── components/
│       ├── mocks/
│       ├── store/
│       └── types/
├── backend/
│   ├── main.py            # FastAPI 入口
│   ├── routers/           # API 路由（plan/outfit/weather/assistant/explain/media/voice）
│   ├── services/          # 业务服务（LLM、天气、豆包语音）
│   └── requirements.txt
└── public/                # 静态资源
```

## 快速开始

### 环境要求

- Node.js 20+
- Python 3.12+

### 1. 配置环境变量

```bash
cp backend/.env.example backend/.env
```

编辑 `backend/.env`，填入以下 Key：

| 变量 | 说明 | 是否必填 |
|------|------|--------|
| `GLM_API_KEY` | 智谱 AI Key（[申请地址](https://open.bigmodel.cn/)） | ✅ 必填 |
| `OPENWEATHER_API_KEY` | OpenWeatherMap Key（[申请地址](https://openweathermap.org/api)） | 可选，无则用 Mock |
| `DOUBAO_APP_ID` | 火山引擎豆包语音 App ID | 语音功能必填 |
| `DOUBAO_ACCESS_TOKEN` | 豆包语音 Access Token | 语音功能必填 |
| `DOUBAO_ASR_RESOURCE_ID` | ASR 资源 ID（从控制台接入指南复制） | 语音功能必填 |
| `DOUBAO_TTS_RESOURCE_ID` | TTS 资源 ID | 语音功能必填 |

### 2. 启动后端

```bash
cd backend
pip install -r requirements.txt
python main.py
```

后端运行在 `http://localhost:8000`  
接口文档：`http://localhost:8000/docs`  
健康检查：`http://localhost:8000/api/v1/health`

### 3. 启动前端

```bash
# 在项目根目录
npm install
npm run dev
```

前端运行在 `http://localhost:5173`

## API 路由一览

| 前缀 | 说明 |
|------|------|
| `POST /api/v1/plan/generate` | AI 生成旅行行程 |
| `POST /api/v1/plan/parse` | 解析攻略文本提取景点 |
| `POST /api/v1/outfit/suggest` | AI 穿搭推荐 |
| `GET  /api/v1/weather/{city}` | 获取城市天气 |
| `POST /api/v1/assistant/chat` | AI 助手流式对话（SSE） |
| `POST /api/v1/explain/image` | 图片景点识别与讲解 |
| `POST /api/v1/media/upload` | 上传旅行照片 |
| `POST /api/v1/voice/asr` | 语音转文字 |
| `POST /api/v1/voice/tts` | 文字转语音 |

## 开发说明

- 无后端/无 Key 时，前端自动使用 `src/shared/mocks/` 中的 Mock 数据，可独立运行
- 语音功能需要 HTTPS 或 localhost 环境（浏览器麦克风权限限制）
- PWA 支持：可安装到手机桌面，体验更接近原生 App
