import { Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { adminRoutes } from '../../../router';
import '../styles/adminPage.css';

const SideMenu = ({ onLogout, collapsed }) => {
    const { t } = useTranslation();
    const location = useLocation();

    const menuItems = adminRoutes
        .filter(route => route.showInMenu)
        .map(route => ({
            key: route.path,
            icon: route.icon,
            label: <NavLink to={route.path} end>{t(route.name)}</NavLink>,
        }));

    const logoutItem = {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: t('admin.logout'),
        onClick: onLogout,
    };

    return (
        <div className="admin-menu-container">
            <Menu
                mode="inline"
                className="admin-menu"
                selectedKeys={[location.pathname]}
                items={menuItems}
                inlineCollapsed={collapsed}
            />
            <Menu
                mode="inline"
                className="logout-menu"
                items={[logoutItem]}
                inlineCollapsed={collapsed}
            />
        </div>
    );
};

export default SideMenu;