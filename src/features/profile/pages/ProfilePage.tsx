import UserHeader from '../components/UserHeader'
import FootprintStats from '../components/FootprintStats'
import SafetyContacts from '../components/SafetyContacts'
import SettingsPanel from '../components/SettingsPanel'

export default function ProfilePage() {
  return (
    <div className="page-container" style={{ background: '#FAF7F2' }}>
      <UserHeader />
      <FootprintStats />
      <SafetyContacts />
      <SettingsPanel />
    </div>
  )
}
