import { Outlet } from 'react-router-dom'
import { useViewportHeight } from './common/hooks/useViewportHeight.js'
import './styles/App.css'

function App() {
  useViewportHeight()

  return <Outlet />
}

export default App
