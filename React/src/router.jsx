import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import PublicLayout from './common/components/PublicLayout.jsx'
import RequireAuth from './common/components/RequireAuth.jsx'
import { getResourceList } from './common/services/api.js'
import { supabase, isSupabaseConfigured } from './common/services/supabaseClient.js'
import { ToolOutlined, DashboardOutlined, FormOutlined } from '@ant-design/icons'

const HomePage = lazy(() => import('./features/home/HomePage.jsx'))
const ResetPasswordPage = lazy(() => import('./features/auth/pages/ResetPasswordPage.jsx'))
const NotFoundPage = lazy(() => import('./features/error/NotFoundPage.jsx'))
const AdminLayout = lazy(() => import('./features/adminPanel/adminPanel.jsx'))
const DashboardPage = lazy(() => import('./features/adminPanel/pages/DashboardPage.jsx'))
const CreateItemPage = lazy(() => import('./features/adminPanel/pages/AddCarPage.jsx'))

async function adminLoader() {
  try {
    let token = null

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.warn('Failed to retrieve Supabase session:', error)
      } else {
        token = data.session?.access_token ?? null
      }
    }

    const resources = await getResourceList(1, 10, {}, token)
    return { resources }
  } catch (error) {
    console.warn('Failed to load admin data:', error)
    return { resources: [] }
  }
}

export const adminRoutes = [
  {
    path: '/admin',
    name: 'admin.menu.dashboard',
    icon: <DashboardOutlined />,
    showInMenu: true,
    element: <Suspense fallback={<div>Loading...</div>}><DashboardPage /></Suspense>,
  },
  {
    path: '/admin/create',
    name: 'admin.menu.create',
    icon: <FormOutlined />,
    showInMenu: true,
    element: <Suspense fallback={<div>Loading...</div>}><CreateItemPage /></Suspense>,
  },
]

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: '/',
            element: <Suspense fallback={<div>Loading...</div>}><HomePage /></Suspense>,
          },
          {
            path: '/reset-password',
            element: <Suspense fallback={<div>Loading...</div>}><ResetPasswordPage /></Suspense>,
          },
          {
            path: '*',
            element: <Suspense fallback={<div>Loading...</div>}><NotFoundPage /></Suspense>,
          },
        ],
      },
      {
        path: '/admin',
        element: (
          <RequireAuth>
            <Suspense fallback={<div>Loading...</div>}><AdminLayout /></Suspense>
          </RequireAuth>
        ),
        id: 'admin',
        loader: adminLoader,
        children: adminRoutes.map(route => {
          const isIndex = route.path === '/admin'
          return {
            index: isIndex,
            path: isIndex ? undefined : route.path.replace('/admin/', ''),
            element: route.element,
          }
        }),
      },
    ],
  },
])
