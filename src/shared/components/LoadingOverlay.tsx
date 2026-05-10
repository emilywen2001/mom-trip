export default function LoadingOverlay({ text = '加载中…' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-transparent animate-spin mb-3" />
      <p className="text-[14px]" style={{ color: '#B5A696' }}>{text}</p>
    </div>
  )
}
