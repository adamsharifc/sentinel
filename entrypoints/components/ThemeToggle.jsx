import React from "react";
import styles from "./styles/ThemeToggle.module.css";
import { useTheme } from "../context/ThemeContext"; // Import the useTheme hook

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme(); // Use the theme context

    if (!theme) {
        return <div>Loading ...</div>; 
    }

    return (
        <div className={styles.container}>
            <h2>Theme Toggle</h2>
            <p>Switch between light and dark themes.</p>
            <div className={styles.toggle}>
                <input
                    type="checkbox"
                    id="theme-toggle"
                    checked={theme === "dark"}
                    onChange={toggleTheme} // Use the toggle function from context
                    aria-label="Toggle theme"
                />
                <label htmlFor="theme-toggle">Toggle Theme ({theme})</label>
            </div>
        </div>
    );
}