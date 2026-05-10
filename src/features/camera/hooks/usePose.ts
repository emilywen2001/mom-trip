import { useState, useCallback } from 'react'

export interface Pose {
  id: string
  name: string
  svgPath: string
  hint: string
}

export const POSES: Pose[] = [
  {
    id: 'natural',
    name: '自然站立',
    hint: '保持自然，微微抬头 ✨',
    svgPath: `
      M65,24 m-20,0 a20,22 0 1,0 40,0 a20,22 0 1,0 -40,0
      M65,46 L65,62
      M22,70 Q65,62 108,70
      M22,70 Q14,100 18,128
      M108,70 Q116,100 112,128
      M22,70 Q24,126 30,158
      M108,70 Q106,126 100,158
      M30,158 Q65,166 100,158
      M46,158 Q42,210 44,280
      M84,158 Q88,210 86,280
    `,
  },
  {
    id: 'waist',
    name: '叉腰回眸',
    hint: '一手叉腰，头转向右边 ✨',
    svgPath: `
      M65,24 m-20,0 a20,22 0 1,0 40,0 a20,22 0 1,0 -40,0
      M65,46 L65,62
      M22,70 Q65,62 108,70
      M22,70 L12,90 L28,100
      M108,70 L118,105 Q110,110 100,105
      M30,100 Q24,126 30,158
      M100,105 Q106,126 100,158
      M30,158 Q65,166 100,158
      M46,158 Q42,210 44,280
      M84,158 Q88,210 86,280
    `,
  },
  {
    id: 'shoulder',
    name: '斜肩优雅',
    hint: '左肩微微下沉，显气质 ✨',
    svgPath: `
      M65,24 m-20,0 a20,22 0 1,0 40,0 a20,22 0 1,0 -40,0
      M65,46 L65,62
      M18,80 Q65,62 108,70
      M18,80 Q12,110 16,138
      M108,70 Q116,100 112,128
      M16,138 Q18,126 24,158
      M112,128 Q106,126 100,158
      M24,158 Q65,166 100,158
      M46,158 Q42,210 44,280
      M84,158 Q88,210 86,280
    `,
  },
  {
    id: 'gaze',
    name: '侧身远望',
    hint: '侧对镜头，目视远方 ✨',
    svgPath: `
      M50,24 m-18,0 a18,20 0 1,0 36,0 a18,20 0 1,0 -36,0
      M50,44 L48,62
      M20,68 Q48,60 90,72
      M20,68 Q10,100 14,130
      M90,72 Q100,100 96,130
      M14,130 Q12,140 18,158
      M96,130 Q98,140 92,158
      M18,158 Q55,166 92,158
      M32,158 Q28,210 30,280
      M78,158 Q82,210 80,280
    `,
  },
  {
    id: 'backhand',
    name: '背手微笑',
    hint: '双手背在身后，自然微笑 ✨',
    svgPath: `
      M65,24 m-20,0 a20,22 0 1,0 40,0 a20,22 0 1,0 -40,0
      M65,46 L65,62
      M22,70 Q65,62 108,70
      M22,70 Q14,96 24,100 Q50,108 80,100 Q110,96 108,70
      M24,100 Q24,126 30,158
      M80,100 Q106,126 100,158
      M30,158 Q65,166 100,158
      M46,158 Q42,210 44,280
      M84,158 Q88,210 86,280
    `,
  },
  {
    id: 'look_back',
    name: '回眸一笑',
    hint: '背对镜头，回头微笑 ✨',
    svgPath: `
      M75,24 m-18,0 a18,20 0 1,0 36,0 a18,20 0 1,0 -36,0
      M72,44 L70,62
      M30,68 Q70,60 110,72
      M30,68 Q20,100 24,130
      M110,72 Q118,100 114,130
      M24,130 Q22,140 28,158
      M114,130 Q116,140 110,158
      M28,158 Q70,166 110,158
      M44,158 Q40,210 42,280
      M94,158 Q98,210 96,280
    `,
  },
]

export function usePose() {
  const [isPoseActive, setIsPoseActive] = useState(false)
  const [selectedPose, setSelectedPose] = useState<Pose>(POSES[0])

  const togglePose = useCallback(() => {
    setIsPoseActive((prev) => !prev)
  }, [])

  const selectPose = useCallback((pose: Pose) => {
    setSelectedPose(pose)
  }, [])

  return { isPoseActive, selectedPose, togglePose, selectPose }
}
