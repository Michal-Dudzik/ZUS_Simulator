import { Layout, theme } from 'antd'
import '../../styles/App.css'

const { Header } = Layout

const AppHeader = ({ leftActions, centerContent, actions }) => {
    const { token } = theme.useToken();
    const cardBg = token.colorBgContainer;

    return (
        <Header className="app-header" style={{ background: cardBg }}>
            <div className="header-left">
                {leftActions && <div className="header-left-actions">{leftActions}</div>}
            </div>
            <div className="header-center">
                {centerContent}
            </div>
            <div className="header-actions">{actions}</div>
        </Header>
    )
}

export default AppHeader 