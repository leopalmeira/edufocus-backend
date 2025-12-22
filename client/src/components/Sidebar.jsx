import { LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ menuItems, activeTab, setActiveTab, isOpen, expandedMenus, toggleMenu }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleMenuClick = (item) => {
        if (item.hasSubmenu) {
            toggleMenu(item.id);
        } else {
            setActiveTab(item.id);
        }
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', background: 'linear-gradient(to right, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    EDUFOCUS
                </h2>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {menuItems.map((item) => (
                    <div key={item.id}>
                        {/* Main Menu Item */}
                        <button
                            onClick={() => handleMenuClick(item)}
                            className={activeTab === item.id && !item.hasSubmenu ? 'menu-item-active' : 'menu-item'}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                borderRadius: '8px',
                                background: activeTab === item.id && !item.hasSubmenu
                                    ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))'
                                    : expandedMenus[item.id]
                                        ? 'rgba(59, 130, 246, 0.1)'
                                        : 'transparent',
                                color: activeTab === item.id && !item.hasSubmenu ? 'white' : 'var(--text-secondary)',
                                border: 'none',
                                width: '100%',
                                textAlign: 'left',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                fontWeight: activeTab === item.id && !item.hasSubmenu ? '600' : '500'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            {item.hasSubmenu && (
                                <div style={{
                                    transition: 'transform 0.2s',
                                    transform: expandedMenus[item.id] ? 'rotate(0deg)' : 'rotate(-90deg)'
                                }}>
                                    <ChevronDown size={16} />
                                </div>
                            )}
                        </button>

                        {/* Submenu Items */}
                        {item.hasSubmenu && expandedMenus[item.id] && (
                            <div style={{
                                marginTop: '0.25rem',
                                marginBottom: '0.5rem',
                                paddingLeft: '2.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem',
                                borderLeft: '2px solid rgba(59, 130, 246, 0.3)',
                                marginLeft: '1rem'
                            }}>
                                {item.submenu.map((subItem) => (
                                    <button
                                        key={subItem.id}
                                        onClick={() => setActiveTab(subItem.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.625rem 0.75rem',
                                            borderRadius: '6px',
                                            background: activeTab === subItem.id
                                                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.2))'
                                                : 'transparent',
                                            color: activeTab === subItem.id ? '#3b82f6' : 'var(--text-secondary)',
                                            border: activeTab === subItem.id ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent',
                                            width: '100%',
                                            textAlign: 'left',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            fontWeight: activeTab === subItem.id ? '600' : '400'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (activeTab !== subItem.id) {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (activeTab !== subItem.id) {
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        <div style={{
                                            width: '4px',
                                            height: '4px',
                                            borderRadius: '50%',
                                            background: activeTab === subItem.id ? '#3b82f6' : 'var(--text-secondary)',
                                            transition: 'all 0.2s'
                                        }} />
                                        <span>{subItem.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--danger)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    marginTop: '1rem',
                    fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                }}
            >
                <LogOut size={20} />
                <span>Sair</span>
            </button>
        </div>
    );
}
