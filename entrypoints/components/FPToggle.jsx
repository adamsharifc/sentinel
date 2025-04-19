import styles from "./styles/FPToggle.module.css";
import { useState } from "react";
import Cube from "../icons/Cube.jsx";
import Waveform from "../icons/Waveform.jsx";
import PaintBrush from "../icons/PaintBrush.jsx";

const icons = {
    webgl: Cube,
    audio: Waveform,
    canvas: PaintBrush,
};

const labels = {
    webgl: "WebGL",
    audio: "Audio",
    canvas: "Canvas",
};

export default function FPToggle({ type, enabled = false, onToggle }) {
    const [isOn, setIsOn] = useState(enabled);
    const Icon = icons[type];

    const handleToggle = () => {
        setIsOn((prev) => !prev);
        if (onToggle) onToggle(!isOn);
    };

    return (
        <div className={styles.container}>
            <button
                className={`${styles.toggleBtn} ${isOn ? styles.on : styles.off}`}
                onClick={handleToggle}
                aria-pressed={isOn}
                title={labels[type]}
            >
                <span className={styles.iconCircle}>
                    {Icon && <Icon size={24} fill={isOn ? "#fff" : "var(--danger-800)"} />}
                </span>
            </button>
            <span className={`${styles.label} ${isOn ? styles.on : styles.off}`}>
                {labels[type]}
            </span>
        </div>
    );
}