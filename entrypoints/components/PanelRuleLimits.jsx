import { useState, useEffect } from "react";
import styles from "./styles/PanelRuleLimits.module.css";

export default function PanelRuleLimits() {
    const [staticRuleCount, setStaticRuleCount] = useState(null); // State to store the available static rule count
    const [dynamicRuleCount, setDynamicRuleCount] = useState(null); // State to store the dynamic rule count
    const [inUseStaticRulesetCount, setInUseStaticRulesetCount] = useState(null); // State to store the in-use static ruleset count
    const [staticRulesInUseCount, setStaticRulesInUseCount] = useState(null); // State to store the number of rules in static rulesets

    useEffect(() => {
        // Fetch the static rule count when the component mounts
        const fetchRuleCount = async () => {
            try {
                const count = await chrome.declarativeNetRequest.getAvailableStaticRuleCount();
                setStaticRuleCount(count); // Update state with the fetched count
            } catch (error) {
                console.error("Error fetching static rule count:", error);
            }
        };

        const fetchInUseDynamicRuleCount = async () => {
            try {
                const rules = await chrome.declarativeNetRequest.getDynamicRules();
                setDynamicRuleCount(rules.length); // Update state with the fetched count
            } catch (error) {
                console.error("Error fetching in-use dynamic rule count:", error);
            }
        };

        const fetchInUseStaticRulesetCount = async () => {
            try {
                const rules = await chrome.declarativeNetRequest.getEnabledRulesets();
                setInUseStaticRulesetCount(rules.length); // Update state with the fetched count
            } catch (error) {
                console.error("Error fetching in-use static ruleset count:", error);
            }
        };

        const fetchStaticRulesInUseCount = async () => {
            try {
                const count = await chrome.declarativeNetRequest.getAvailableStaticRuleCount();
                setStaticRulesInUseCount(matchedRules.rules.length); // Update state with the number of matched rules
            } catch (error) {
                console.error("Error fetching static rules in use count:", error);
            }
        };

        fetchRuleCount();
        fetchInUseDynamicRuleCount();
        fetchInUseStaticRulesetCount();
        fetchStaticRulesInUseCount();
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className={styles.container}>
            <p>Configure limits for protection rules.</p>

            <div>
                Static Rule: {staticRuleCount !== null ? staticRuleCount : "Loading..."}
            </div>

            <div>
                Dynamic Rule: {dynamicRuleCount !== null ? dynamicRuleCount : "Loading..."}
            </div>

            <div>
                Static rules in use: {inUseStaticRulesetCount !== null ? inUseStaticRulesetCount : "Loading..."}
            </div>

            <div>
                Number of rules in static rulesets: {staticRulesInUseCount !== null ? staticRulesInUseCount : "Loading..."}
            </div>
        </div>
    );
}