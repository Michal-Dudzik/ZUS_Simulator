import { useState, useRef } from 'react'
import { Layout, Button, message } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AppHeader from '../../common/components/AppHeader.jsx'
import AppFooter from '../../common/components/AppFooter.jsx'
import SideMenu from './components/SideMenu.jsx'
// import { useAuth } from './hooks/useAuth.js'
import useOnClickOutside from './hooks/useOnClickOutside.js'
import useWindowSize from '../../common/hooks/useWindowSize.js'
import { useTheme } from '../../common/hooks/useTheme.js'
import './styles/adminPage.css'
import '../../styles/App.css'

const { Content, Sider } = Layout

const AdminLayout = () => {
  // const { session, loading, signOut } = useAuth()
  const session = null
  const loading = false
  const signOut = () => {}
  const { t } = useTranslation()
  const [siderCollapsed, setSiderCollapsed] = useState(true)
  const siderRef = useRef()
  const menuButtonRef = useRef()
  const { width } = useWindowSize()
  const { isDark } = useTheme()

  useOnClickOutside(siderRef, (event) => {
    if (width < 768 && !siderCollapsed) {
      if (menuButtonRef.current && menuButtonRef.current.contains(event.target)) {
        return
      }
      setSiderCollapsed(true)
    }
  })

  // if (loading) {
  //   return (
  //     <Layout className="loading-container">
  //       <Content>
  //         <p>{t('admin.loading')}</p>
  //       </Content>
  //     </Layout>
  //   )
  // }

  // if (!session) {
  //   return null
  // }

  // const handleLogout = async () => {
  //   const { error } = await signOut()
  //   if (error) {
  //     message.error(error.message || 'Unable to log out right now.')
  //   } else {
  //     message.success('Logged out.')
  //   }
  // }
  const handleLogout = () => {}

  const menuButton = (
    <Button
      ref={menuButtonRef}
      type="text"
      icon={<MenuOutlined />}
      onClick={() => setSiderCollapsed(!siderCollapsed)}
    />
  )

  const headerLeftActions = (
    <div className="header-actions-group">
      {menuButton}
    </div>
  )

  return (
    <Layout className="app-layout">
      <AppHeader leftActions={headerLeftActions} />
      <Layout>
        <Sider
          ref={siderRef}
          collapsedWidth={0}
          theme={isDark ? 'dark' : 'light'}
          className="admin-sider"
          collapsed={siderCollapsed}
          trigger={null}
          width={250}
          breakpoint="md"
        >
          <SideMenu onLogout={handleLogout} collapsed={siderCollapsed} />
        </Sider>
        <Layout>
          <Content className="admin-content-wrapper">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <AppFooter />
    </Layout>
  )
}

export default AdminLayout
