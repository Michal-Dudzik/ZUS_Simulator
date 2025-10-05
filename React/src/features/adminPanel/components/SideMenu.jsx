import { useState, useEffect } from 'react';
import { Menu, Switch, Divider } from 'antd';
import { LogoutOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { adminRoutes } from '../../../router';
import '../styles/adminPage.css';

const PRESENTATION_MODE_KEY = 'admin_presentation_mode';

const SideMenu = ({ onLogout, collapsed }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const [presentationMode, setPresentationMode] = useState(() => {
        const stored = localStorage.getItem(PRESENTATION_MODE_KEY);
        return stored === 'true';
    });

    const menuItems = adminRoutes
        .filter(route => route.showInMenu && route.path !== '/admin/create')
        .map(route => ({
            key: route.path,
            icon: route.icon,
            label: <NavLink to={route.path} end>{t(route.name)}</NavLink>,
        }));

    useEffect(() => {
        localStorage.setItem(PRESENTATION_MODE_KEY, presentationMode.toString());
        // Dispatch custom event so dashboard can listen to changes
        window.dispatchEvent(new CustomEvent('presentationModeChange', { 
            detail: { enabled: presentationMode } 
        }));
    }, [presentationMode]);

    const handleTogglePresentation = (checked) => {
        setPresentationMode(checked);
    };

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
            
            <div>
                {!collapsed && (
                    <>
                        <Divider style={{ margin: '12px 0' }} />
                        <div className="presentation-mode-toggle" style={{ 
                            padding: '8px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '12px'
                        }}>
                            <ExperimentOutlined style={{ fontSize: '16px' }} />
                            <span style={{ flex: 1, fontSize: '14px' }}>
                                {t('admin.presentationMode')}
                            </span>
                            <Switch 
                                checked={presentationMode}
                                onChange={handleTogglePresentation}
                                size="small"
                            />
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                    </>
                )}
                
                <Menu
                    mode="inline"
                    className="logout-menu"
                    items={[logoutItem]}
                    inlineCollapsed={collapsed}
                />
            </div>
        </div>
    );
};

export default SideMenu;