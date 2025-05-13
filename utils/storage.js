import browser from 'webextension-polyfill';

// Constants for storage keys
const STORAGE_KEYS = {
	CANVAS_PROTECTION: 'fingerprintProtection.canvas',
	WEBGL_PROTECTION: 'fingerprintProtection.webgl',
	AUDIO_PROTECTION: 'fingerprintProtection.audio',
	FONT_PROTECTION: 'fingerprintProtection.font',
};

// Get canvas fingerprinting protection state
export const getCanvasFPProtectionStorage = async () => {
	try {
		const result = await browser.storage.local.get(STORAGE_KEYS.CANVAS_PROTECTION);
		// Check if key exists explicitly to properly handle false values
		return result.hasOwnProperty(STORAGE_KEYS.CANVAS_PROTECTION) 
			? result[STORAGE_KEYS.CANVAS_PROTECTION] 
			: true; // Default to true if not set
	} catch (error) {
		console.error('Error getting canvas protection state:', error);
		return true; // Default to true on error
	}
};

// Set canvas fingerprinting protection state
export const setCanvasFPProtectionStorage = async (value) => {
	try {
		await browser.storage.local.set({ [STORAGE_KEYS.CANVAS_PROTECTION]: value });
		console.log(`Canvas protection set to ${value} in storage`);
		return true;
	} catch (error) {
		console.error('Error setting canvas protection state:', error);
		throw error;
	}
};

// Add functions for WebGL and Audio protection settings
export const getWebGLFPProtectionStorage = async () => {
	try {
		const result = await browser.storage.local.get(STORAGE_KEYS.WEBGL_PROTECTION);
		return result.hasOwnProperty(STORAGE_KEYS.WEBGL_PROTECTION) 
			? result[STORAGE_KEYS.WEBGL_PROTECTION] 
			: true; // Default to true if not set
	} catch (error) {
		console.error('Error getting WebGL protection state:', error);
		return true; // Default to true on error
	}
};

export const setWebGLFPProtectionStorage = async (value) => {
	try {
		await browser.storage.local.set({ [STORAGE_KEYS.WEBGL_PROTECTION]: value });
		console.log(`WebGL protection set to ${value} in storage`);
		return true;
	} catch (error) {
		console.error('Error setting WebGL protection state:', error);
		throw error;
	}
};

export const getAudioFPProtectionStorage = async () => {
	try {
		const result = await browser.storage.local.get(STORAGE_KEYS.AUDIO_PROTECTION);
		return result.hasOwnProperty(STORAGE_KEYS.AUDIO_PROTECTION) 
			? result[STORAGE_KEYS.AUDIO_PROTECTION] 
			: true; // Default to true if not set
	} catch (error) {
		console.error('Error getting Audio protection state:', error);
		return true; // Default to true on error
	}
};

export const setAudioFPProtectionStorage = async (value) => {
	try {
		await browser.storage.local.set({ [STORAGE_KEYS.AUDIO_PROTECTION]: value });
		console.log(`Audio protection set to ${value} in storage`);
		return true;
	} catch (error) {
		console.error('Error setting Audio protection state:', error);
		throw error;
	}
};

// Add functions for Font protection settings
export const getFontFPProtectionStorage = async () => {
	try {
		const result = await browser.storage.local.get(STORAGE_KEYS.FONT_PROTECTION);
		return result.hasOwnProperty(STORAGE_KEYS.FONT_PROTECTION) 
			? result[STORAGE_KEYS.FONT_PROTECTION] 
			: true; // Default to true if not set
	} catch (error) {
		console.error('Error getting Font protection state:', error);
		return true; // Default to true on error
	}
};

export const setFontFPProtectionStorage = async (value) => {
	try {
		await browser.storage.local.set({ [STORAGE_KEYS.FONT_PROTECTION]: value });
		console.log(`Font protection set to ${value} in storage`);
		return true;
	} catch (error) {
		console.error('Error setting Font protection state:', error);
		throw error;
	}
}


// Export the storage keys for use in other components
export { STORAGE_KEYS };