import './App.css';
import { useState } from 'react';
import Logo from "../icons/Logo.jsx";

function App() {
    const [activeTab, setActiveTab] = useState('general');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className='container'>
            <div className="centered-container">
                <h1 style={{display: "flex", gap: "var(--size-2)"}}><Logo/>  Sentinel Options</h1>
                
                <div className="tabs-container">
                    <div className="tabs-navigation">
                        <button 
                            className={`tab ${activeTab === 'general' ? 'active' : ''}`}
                            onClick={() => handleTabClick('general')}
                        >
                            General
                        </button>
                        <button 
                            className={`tab ${activeTab === 'allowlist' ? 'active' : ''}`}
                            onClick={() => handleTabClick('allowlist')}
                        >
                            Allow List
                        </button>
                        <button 
                            className={`tab ${activeTab === 'userrules' ? 'active' : ''}`}
                            onClick={() => handleTabClick('userrules')}
                        >
                            User Rules
                        </button>
                        <button 
                            className={`tab ${activeTab === 'rulelimits' ? 'active' : ''}`}
                            onClick={() => handleTabClick('rulelimits')}
                        >
                            Rule Limits
                        </button>
                        <button 
                            className={`tab ${activeTab === 'about' ? 'active' : ''}`}
                            onClick={() => handleTabClick('about')}
                        >
                            About
                        </button>
                    </div>
                    
                    <div className="tab-content">
                        {activeTab === 'general' && (
                            <div className="tab-panel">
                                <h2>General Settings</h2>
                                <p>Configure general extension settings here.</p>
                            </div>
                        )}
                        
                        {activeTab === 'allowlist' && (
                            <div className="tab-panel">
                                <h2>Allow List</h2>
                                <p>Manage websites that are exempt from protection.</p>
                            </div>
                        )}
                        
                        {activeTab === 'userrules' && (
                            <div className="tab-panel">
                                <h2>User Rules</h2>
                                <p>Configure custom protection rules.</p>
                            </div>
                        )}
                        
                        {activeTab === 'rulelimits' && (
                            <div className="tab-panel">
                                <h2>Rule Limits</h2>
                                <p>Configure limits for protection rules.</p>
                            </div>
                        )}
                        
                        {activeTab === 'about' && (
                            <div className="tab-panel">
                                <h2>About</h2>
                                <p>Sentinel - Privacy Protection Extension</p>
                                <p>Version: 1.0.0</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;