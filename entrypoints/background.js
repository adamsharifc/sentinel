import {
    getCanvasFPProtectionStorage,
    getAudioFPProtectionStorage,
    getWebGLFPProtectionStorage,
    getFontFPProtectionStorage,
    STORAGE_KEYS // Import the storage keys
} from '../utils/storage.js'; // Adjust path if necessary

export default defineBackground(async () => {
    console.log('Sentinel Background Script Loaded', { id: browser.runtime.id });

    // Function to register a content script
    const registerContentScript = async (id, scriptPath) => {
        try {
            await chrome.scripting.registerContentScripts([{
                id,
                js: [scriptPath],
                persistAcrossSessions: false,
                matches: ["<all_urls>"],
                runAt: "document_start",
                allFrames: true,
                world: "MAIN",
            }]);
            console.log(`${id} registered`);
        } catch (error) {
            console.warn(`Error registering ${id}:`, error);
        }
    };

    // Function to unregister a content script
    const unregisterContentScript = async (id) => {
        try {
            await chrome.scripting.unregisterContentScripts({ ids: [id] });
            console.log(`${id} unregistered`);
        } catch (error) {
            console.warn(`Error unregistering ${id}:`, error);
        }
    };

    // Function to check and update the content script registration for a specific feature
    const updateContentScript = async (getStorageFn, id, scriptPath) => {
        const isEnabled = await getStorageFn();
        if (isEnabled) {
            console.log(`${id} is enabled. Registering content script...`);
            await registerContentScript(id, scriptPath);
        } else {
            console.log(`${id} is disabled. Unregistering content script...`);
            await unregisterContentScript(id);
        }
    };

    // Function to get and log current storage state
    const logCurrentStorageState = async () => {
        try {
            const canvasEnabled = await getCanvasFPProtectionStorage();
            const audioEnabled = await getAudioFPProtectionStorage();
            const webglEnabled = await getWebGLFPProtectionStorage();
            const fontEnabled = await getFontFPProtectionStorage();
            console.log('Current Sentinel Storage State:', {
                [STORAGE_KEYS.CANVAS_PROTECTION]: canvasEnabled,
                [STORAGE_KEYS.AUDIO_PROTECTION]: audioEnabled,
                [STORAGE_KEYS.WEBGL_PROTECTION]: webglEnabled,
                [STORAGE_KEYS.FONT_PROTECTION]: fontEnabled,
            });
        } catch (error) {
            console.error("Error reading Sentinel storage:", error);
        }
    };

    // Log initial state and update content script registrations
    await logCurrentStorageState();
    await updateContentScript(getCanvasFPProtectionStorage, "canvas-content-script", "./content-scripts/canvasFingerprintBlocking.js");
    await updateContentScript(getAudioFPProtectionStorage, "audio-content-script", "./content-scripts/audioFingerprintBlocking.js");
    await updateContentScript(getWebGLFPProtectionStorage, "webgl-content-script", "./content-scripts/webglFingerprintBlocking.js");
    await updateContentScript(getFontFPProtectionStorage, "font-content-script", "./content-scripts/fontFingerprintBlocking.js");

    // Listen for changes in storage and update content script registrations dynamically
    chrome.storage.onChanged.addListener(async (changes, areaName) => {
        if (areaName === 'local') {
            const relevantKeys = [
                STORAGE_KEYS.CANVAS_PROTECTION,
                STORAGE_KEYS.AUDIO_PROTECTION,
                STORAGE_KEYS.WEBGL_PROTECTION,
                STORAGE_KEYS.FONT_PROTECTION,
            ];
            const changedKeys = Object.keys(changes);
            const hasRelevantChange = changedKeys.some(key => relevantKeys.includes(key));

            if (hasRelevantChange) {
                console.log('Sentinel storage changed:', changes);
                logCurrentStorageState();
            }

            if (STORAGE_KEYS.CANVAS_PROTECTION in changes) {
                console.log("Canvas protection state changed:", changes[STORAGE_KEYS.CANVAS_PROTECTION]);
                await updateContentScript(getCanvasFPProtectionStorage, "canvas-content-script", "./content-scripts/canvasFingerprintBlocking.js");
            }
            if (STORAGE_KEYS.AUDIO_PROTECTION in changes) {
                console.log("Audio protection state changed:", changes[STORAGE_KEYS.AUDIO_PROTECTION]);
                await updateContentScript(getAudioFPProtectionStorage, "audio-content-script", "./content-scripts/audioFingerprintBlocking.js");
            }
            if (STORAGE_KEYS.WEBGL_PROTECTION in changes) {
                console.log("WebGL protection state changed:", changes[STORAGE_KEYS.WEBGL_PROTECTION]);
                await updateContentScript(getWebGLFPProtectionStorage, "webgl-content-script", "./content-scripts/webglFingerprintBlocking.js");
            }
            if (STORAGE_KEYS.FONT_PROTECTION in changes) {
                console.log("Font protection state changed:", changes[STORAGE_KEYS.FONT_PROTECTION]);
                await updateContentScript(getFontFPProtectionStorage, "font-content-script", "./content-scripts/fontFingerprintBlocking.js");
            }
        }
    });

    // Log registered content scripts for debugging
    chrome.scripting.getRegisteredContentScripts()
        .then((scripts) => {
            console.log('Registered content scripts:', scripts);
        })
        .catch((error) => {
            console.error('Error fetching registered content scripts:', error);
        });
});