import React from "react";
import styles from "./styles/ThemeToggle.module.css";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
    const { themePreference, setThemePreference } = useTheme();
    const themeOptions = ['system', 'light', 'dark'];

    return (
        <div className={styles.container}>
            <p>Select theme preference:</p>
            <div className={styles.buttonGroup} role="radiogroup" aria-label="Theme preference">
                {themeOptions.map((option) => (
                    <button
                        key={option}
                        className={`${styles.themeButton} ${themePreference === option ? styles.active : ''}`}
                        onClick={() => setThemePreference(option)}
                        aria-pressed={themePreference === option}
                        role="radio"
                        aria-checked={themePreference === option}
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
}