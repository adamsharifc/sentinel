import { useState, useEffect } from "react";
import styles from "./styles/PanelUserRules.module.css";

export default function PanelUserRules() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [urlPattern, setUrlPattern] = useState("");
    const [ruleType, setRuleType] = useState("block");
    const [resourceTypes, setResourceTypes] = useState(["main_frame"]);
    const [errorMessage, setErrorMessage] = useState("");

    // Load existing rules when component mounts
    useEffect(() => {
        const loadRules = async () => {
            try {
                const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
                setRules(existingRules);
                setLoading(false);
            } catch (error) {
                console.error("Error loading rules:", error);
                setErrorMessage("Failed to load existing rules.");
                setLoading(false);
            }
        };
        
        loadRules();
    }, []);

    // Handle form submission to add a new rule
    const handleAddRule = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        
        if (!urlPattern) {
            setErrorMessage("URL pattern is required");
            return;
        }
        
        try {
            const newRuleId = rules.length > 0 
                ? Math.max(...rules.map(rule => rule.id)) + 1 
                : 1;
                
            const newRule = {
                id: newRuleId,
                priority: 1,
                action: {
                    type: ruleType === "block" ? "block" : "allow",
                },
                condition: {
                    urlFilter: urlPattern,
                    resourceTypes: resourceTypes,
                }
            };
            
            // Update rules in Chrome
            await chrome.declarativeNetRequest.updateDynamicRules({
                addRules: [newRule],
                removeRuleIds: []
            });
            
            // Update local state
            setRules([...rules, newRule]);
            
            // Clear form
            setUrlPattern("");
        } catch (error) {
            console.error("Error adding rule:", error);
            setErrorMessage("Failed to add rule: " + error.message);
        }
    };

    // Handle rule deletion
    const handleDeleteRule = async (ruleId) => {
        try {
            // Remove rule from Chrome
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [ruleId],
                addRules: []
            });
            
            // Update local state
            setRules(rules.filter(rule => rule.id !== ruleId));
        } catch (error) {
            console.error("Error deleting rule:", error);
            setErrorMessage("Failed to delete rule: " + error.message);
        }
    };

    // Toggle resource type selection
    const toggleResourceType = (type) => {
        if (resourceTypes.includes(type)) {
            setResourceTypes(resourceTypes.filter(t => t !== type));
        } else {
            setResourceTypes([...resourceTypes, type]);
        }
    };

    return (
        <div className={styles.container}>
            <h2>User Rules</h2>
            <p>Configure custom protection rules to block or allow web requests.</p>
            
            <form onSubmit={handleAddRule} className={styles.ruleForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="urlPattern">URL Pattern:</label>
                    <input
                        type="text"
                        id="urlPattern"
                        value={urlPattern}
                        onChange={(e) => setUrlPattern(e.target.value)}
                        placeholder="e.g., *://*.example.com/*"
                        className={styles.textInput}
                    />
                    <small>Use * as wildcard. Examples: *://*.example.com/*, ||example.com^</small>
                </div>
                
                <div className={styles.formGroup}>
                    <label>Rule Type:</label>
                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                name="ruleType"
                                value="block"
                                checked={ruleType === "block"}
                                onChange={() => setRuleType("block")}
                            />
                            Block
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="ruleType"
                                value="allow"
                                checked={ruleType === "allow"}
                                onChange={() => setRuleType("allow")}
                            />
                            Allow
                        </label>
                    </div>
                </div>
                
                <div className={styles.formGroup}>
                    <label>Resource Types:</label>
                    <div className={styles.checkboxGroup}>
                        {["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "media"].map(type => (
                            <label key={type}>
                                <input
                                    type="checkbox"
                                    checked={resourceTypes.includes(type)}
                                    onChange={() => toggleResourceType(type)}
                                />
                                {type.replace("_", " ")}
                            </label>
                        ))}
                    </div>
                </div>
                
                <button type="submit" className={styles.addButton}>Add Rule</button>
                
                {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            </form>
            
            <div className={styles.rulesContainer}>
                <h3>Existing Rules</h3>
                
                {loading ? (
                    <p>Loading rules...</p>
                ) : rules.length === 0 ? (
                    <p>No custom rules added yet.</p>
                ) : (
                    <ul className={styles.rulesList}>
                        {rules.map(rule => (
                            <li key={rule.id} className={styles.ruleItem}>
                                <div className={styles.ruleDetails}>
                                    <span className={styles.ruleType}>
                                        {rule.action.type.toUpperCase()}
                                    </span>
                                    <span className={styles.rulePattern}>
                                        {rule.condition.urlFilter}
                                    </span>
                                    <div className={styles.resourceTypes}>
                                        {rule.condition.resourceTypes?.join(", ")}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteRule(rule.id)} 
                                    className={styles.deleteButton}
                                    aria-label="Delete rule"
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}