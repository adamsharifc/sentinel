import {
    getCanvasFPProtectionStorage,
    getAudioFPProtectionStorage,
    getWebGLFPProtectionStorage,
    STORAGE_KEYS // Import the storage keys
} from '../utils/storage.js'; // Adjust path if necessary

export default defineBackground(async () => {
    console.log('Sentinel Background Script Loaded', { id: browser.runtime.id });

    // Function to get and log current storage state
    const logCurrentStorageState = async () => {
        try {
            const canvasEnabled = await getCanvasFPProtectionStorage();
            const audioEnabled = await getAudioFPProtectionStorage();
            const webglEnabled = await getWebGLFPProtectionStorage();
            console.log('Current Sentinel Storage State:', {
                [STORAGE_KEYS.CANVAS_PROTECTION]: canvasEnabled, // Use imported keys for logging clarity
                [STORAGE_KEYS.AUDIO_PROTECTION]: audioEnabled,
                [STORAGE_KEYS.WEBGL_PROTECTION]: webglEnabled,
            });
        } catch (error) {
            console.error("Error reading Sentinel storage:", error);
        }
    };

    // Log initial state
    await logCurrentStorageState();

    // Listen for changes in storage
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local') {
            // Use the actual storage keys from STORAGE_KEYS
            const relevantKeys = [
                STORAGE_KEYS.CANVAS_PROTECTION,
                STORAGE_KEYS.AUDIO_PROTECTION,
                STORAGE_KEYS.WEBGL_PROTECTION
            ];
            const changedKeys = Object.keys(changes);
            const hasRelevantChange = changedKeys.some(key => relevantKeys.includes(key));

            if (hasRelevantChange) {
                console.log('Sentinel storage changed:', changes);
                // Log the new complete state after a change
                logCurrentStorageState();
            }
        }
    });
});	