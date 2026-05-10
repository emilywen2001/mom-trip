import { MOCK_GALLERY } from '@/shared/mocks/mockMedia'

export default function TripGallery() {
  return (
    <div className="px-4">
      <p className="text-[13px] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
        本次旅行 · {MOCK_GALLERY.length} 张
      </p>
      <div className="columns-2 gap-2">
        {MOCK_GALLERY.map((photo) => (
          <div key={photo.id} className="mb-2 rounded-2xl overflow-hidden relative">
            <img src={photo.url} alt="" className="w-full object-cover" />
            <div
              className="absolute bottom-0 left-0 right-0 px-2 py-1"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.5))' }}
            >
              <p className="text-[11px] text-white">📍 {photo.place}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
