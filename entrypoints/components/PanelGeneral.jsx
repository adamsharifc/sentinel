import styles from "./styles/PanelGeneral.module.css"; 
import ThemeToggle from "./ThemeToggle.jsx"; // Import the ThemeToggle component

export default function PanelGeneral(){
    return (
        <div className={styles.container}>
            <h2>General Settings</h2>
            <p>Configure general extension settings here.</p>
            <div className={styles.themeToggleContainer}>
                <ThemeToggle />
            </div>
        </div>
    )
}