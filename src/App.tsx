import { BirthdayPage } from '@/features/birthday/birthday-page'
import { BarcodeMakerPage } from '@/features/barcode-maker/barcode-maker-page'

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/make') {
    return <BarcodeMakerPage />
  }
  return <BirthdayPage />
}

export default App
