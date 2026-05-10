import { useNavigate, useLocation } from 'react-router-dom'
import { Home, MapPin, Camera, MessageCircle, User } from 'lucide-react'
import { ROUTES } from '@/shared/constants/routes'

const tabs = [
  { key: 'home',      icon: Home,          label: '首页',    path: ROUTES.HOME },
  { key: 'itinerary', icon: MapPin,         label: '行程',    path: ROUTES.ITINERARY },
  { key: 'camera',    icon: Camera,         label: '拍照',    path: ROUTES.CAMERA },
  { key: 'assistant', icon: MessageCircle,  label: '助手',    path: ROUTES.ASSISTANT },
  { key: 'profile',   icon: User,           label: '我的',    path: ROUTES.PROFILE },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const active = tabs.find((t) => t.path === location.pathname)?.key ?? 'home'

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isCamera = tab.key === 'camera'
          const isActive = active === tab.key

          if (isCamera) {
            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                className="flex-1 flex flex-col items-center justify-center py-2 relative"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg -mt-6"
                  style={{ background: 'linear-gradient(160deg, #E8A87C 0%, #C8633A 100%)' }}
                >
                  <Icon size={26} color="white" />
                </div>
                <span className="text-[10px] mt-1" style={{ color: '#C8633A' }}>
                  {tab.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 touchable"
            >
              <Icon
                size={22}
                color={isActive ? '#C8633A' : '#B5A696'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? '#C8633A' : '#B5A696' }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
