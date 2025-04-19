import { useEffect, useState } from 'react';

export default function BlockingStats() {
    const [advertsBlocked, setAdvertsBlocked] = useState(0);
    const [socialBlocked, setSocialBlocked] = useState(0);
    const [trackersBlocked, setTrackersBlocked] = useState(0);
    const [currentTabId, setCurrentTabId] = useState(null);
    // Add a refresh trigger state to force updates
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Get current tab and set up URL change listener
    useEffect(() => {
        let activeTabId = null;
        
        // Function to get the active tab ID
        const getActiveTab = async () => {
            try {
                const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tabs[0]?.id) {
                    activeTabId = tabs[0].id;
                    setCurrentTabId(activeTabId);
                }
            } catch (error) {
                console.error('Error getting current tab:', error);
            }
        };
        
        // Initial tab ID fetch
        getActiveTab();
        
        // Listen for tab status changes
        const tabUpdateListener = (tabId, changeInfo) => {
            // Refresh when the page has completed loading and it's our active tab
            if (changeInfo.status === 'complete' && tabId === activeTabId) {
                console.log('Page load complete, refreshing stats');
                setRefreshTrigger(prev => prev + 1);
            }
        };
        
        // Add the listener
        chrome.tabs.onUpdated.addListener(tabUpdateListener);
        
        // Clean up listener when component unmounts
        return () => {
            chrome.tabs.onUpdated.removeListener(tabUpdateListener);
        };
    }, []);

    // Fetch and count blocked resources
    useEffect(() => {
        // Only fetch rules when we have a valid tab ID
        if (currentTabId === null) return;

        let adverts = 0;
        let social = 0;
        let trackers = 0;

        // Fetch the number of trackers blocked using getMatchedRules API
        chrome.declarativeNetRequest.getMatchedRules()
            .then((matchedRules) => {
                // Filter rules to only those for the current tab
                const tabRules = matchedRules.rulesMatchedInfo.filter(rule => 
                    rule.tabId === currentTabId
                );
                
                // Count the filtered rules by ruleset ID
                tabRules.forEach((rule) => {
                    if (rule.rule.rulesetId === 'advert-dnr') {
                        adverts += 1;
                    } else if (rule.rule.rulesetId === 'social-dnr') {
                        social += 1;
                    } else if (rule.rule.rulesetId === 'tracker-dnr') {
                        trackers += 1;
                    }
                });

                setAdvertsBlocked(adverts);
                setSocialBlocked(social);
                setTrackersBlocked(trackers);
                
                console.log('Current tab:', currentTabId);
                console.log('Matched rules for current tab:', tabRules);
            })
            .catch((error) => {
                console.error('Error fetching matched rules:', error);
            });
    }, [currentTabId, refreshTrigger]); // Re-run when tab ID or refresh trigger changes

    return (
        <>
            <div className="blocking-stats">
                <span style={{fontSize: "var(--size-5)", color: "var(--warning-400)"}}>
                    <strong> {trackersBlocked} </strong> 
                    <span style={{fontSize: "var(--size-3"}}>TRACKERS</span>
                </span>
                <span style={{fontSize: "var(--size-5)", color: "var(--warning-400)"}}>
                    <strong> {advertsBlocked} </strong> 
                    <span style={{fontSize: "var(--size-3"}}>ADVERTS</span>
                </span>
                <span style={{fontSize: "var(--size-5)", color: "var(--warning-400)"}}>
                    <strong> {socialBlocked} </strong> 
                    <span style={{fontSize: "var(--size-3"}}>SOCIALS</span>
                </span>
            </div>
        </>
    );
}