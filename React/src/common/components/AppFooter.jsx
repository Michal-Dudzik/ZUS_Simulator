import { Layout, theme } from 'antd'
import {
  GlobalOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons'
import { useTheme } from '../hooks/useTheme.js'
import { useLanguage } from '../../i18n/useLanguage.js'
import '../../styles/App.css'

const { Footer } = Layout

const AppFooter = () => {
  const { isDark, toggleTheme } = useTheme()
  const { toggleLanguage, getOtherLanguageText } = useLanguage()
  const { token } = theme.useToken()
  const cardBg = token.colorBgContainer

  return (
    <Footer className="app-footer" style={{ background: cardBg }}>
      <div className="language-switcher" onClick={toggleLanguage}>
        <GlobalOutlined /> {getOtherLanguageText()}
      </div>
      
      <span>©{new Date().getFullYear()} Boże Danusia Serduszkoe Moje</span>

      <div className="theme-switcher" onClick={toggleTheme}>
        {isDark ? <SunOutlined /> : <MoonOutlined />}
      </div>
    </Footer>
  )
}

export default AppFooter 