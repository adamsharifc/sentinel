import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js';
import { storage } from '#imports';

// Store the user's preference: 'system', 'light', or 'dark'
const themePreferenceStorage = storage.defineItem('local:themePreference', { defaultValue: 'system' });

const ThemeContext = createContext(undefined);

// Helper function to get system theme
const getSystemTheme = () => {
    if (typeof window !== 'undefined') {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return 'light'; // Default server-side or if window is undefined
};

export const ThemeProvider = ({ children }) => {
    const [themePreference, setThemePreferenceState] = useState('system'); // Initial state before storage check
    const [effectiveTheme, setEffectiveTheme] = useState(getSystemTheme()); // Initial guess
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Fetch initial preference from storage
    useEffect(() => {
        const loadPreference = async () => {
            try {
                const storedPreference = await themePreferenceStorage.getValue();
                console.log('Preference from storage:', storedPreference);
                setThemePreferenceState(storedPreference || 'system'); // Default to 'system' if null/undefined
            } catch (error) {
                console.error("Failed to get theme preference from storage:", error);
                setThemePreferenceState('system'); // Fallback to system on error
            } finally {
                setIsInitialLoad(false);
            }
        };
        loadPreference();
    }, []);

    // Update effective theme based on preference and system changes
    useEffect(() => {
        if (isInitialLoad) return; // Don't run on initial load before preference is set

        const applyTheme = () => {
            let newEffectiveTheme;
            if (themePreference === 'system') {
                newEffectiveTheme = getSystemTheme();
                console.log('Applying system theme:', newEffectiveTheme);
            } else {
                newEffectiveTheme = themePreference;
                console.log('Applying user preference:', newEffectiveTheme);
            }
            setEffectiveTheme(newEffectiveTheme);
            document.documentElement.setAttribute('data-theme', newEffectiveTheme);
        };

        applyTheme(); // Apply theme immediately based on current preference

        // Listen for system theme changes only if preference is 'system'
        let mediaQueryList;
        const handleChange = () => {
            console.log('System theme changed');
            applyTheme();
        };

        if (themePreference === 'system' && typeof window !== 'undefined') {
            mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
            mediaQueryList.addEventListener('change', handleChange);
            console.log('Added system theme listener');
        }

        // Cleanup listener
        return () => {
            if (mediaQueryList) {
                mediaQueryList.removeEventListener('change', handleChange);
                console.log('Removed system theme listener');
            }
        };
    }, [themePreference, isInitialLoad]); // Rerun when preference changes or initial load completes

    // Function to update the theme preference
    const setThemePreference = useCallback(async (preference) => {
        if (!['system', 'light', 'dark'].includes(preference)) {
            console.error('Invalid theme preference:', preference);
            return;
        }
        console.log('Setting theme preference to:', preference);
        try {
            await themePreferenceStorage.setValue(preference);
            setThemePreferenceState(preference); // Update local state immediately
            // The useEffect hook will handle applying the theme
        } catch (error) {
            console.error("Failed to set theme preference:", error);
        }
    }, []);

    // Subscribe to storage changes (e.g., from other tabs/windows)
    const subscribe = useCallback((callback) => {
        console.log('Subscribing to theme preference changes');
        const unwatch = themePreferenceStorage.watch((newValue) => {
            console.log('Theme preference changed in storage:', newValue);
            if (newValue && ['system', 'light', 'dark'].includes(newValue)) {
                setThemePreferenceState(newValue); // Update state when storage changes
                callback(); // Notify useSyncExternalStore (though we primarily rely on state now)
            }
        });
        return () => {
            console.log('Unsubscribing from theme preference changes');
            unwatch();
        };
    }, []);

    // Snapshot for useSyncExternalStore (less critical now state drives updates)
    const getSnapshot = useCallback(() => themePreference, [themePreference]);

    // Use useSyncExternalStore primarily for cross-tab sync
    useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    // Avoid rendering children until the initial preference is loaded
    if (isInitialLoad) {
        return null; // Or a loading indicator
    }

    const value = {
        themePreference, // 'system', 'light', 'dark'
        effectiveTheme,  // 'light', 'dark'
        setThemePreference,
    };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
