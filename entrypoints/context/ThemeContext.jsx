import React, {createContext, useState, useEffect, useCallback, useContext} from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js';
import { storage } from 'wxt/storage'; 

const themeStorage = storage.defineItem('local:theme', {});

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
	// Initialize state with a placeholder or system preference guess
	const [initialTheme, setInitialTheme] = useState(() => {
		// Initial guess before async storage check
		if (typeof window !== 'undefined') {
				return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		}
		return 'light'; // Default server-side or if window is undefined
	});
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	// Fetch initial theme from storage asynchronously
	useEffect(() => {
		const getInitialTheme = async () => {
			let determinedTheme = 'light'; // Default fallback
			if (typeof window !== 'undefined') {
					// Determine system theme first
					const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
					determinedTheme = systemPrefersDark ? 'dark' : 'light';
					console.log('System preference:', determinedTheme);
			}

			try {
				const storedTheme = await themeStorage.getValue();
				console.log('Theme from storage:', storedTheme);
				if (storedTheme) {
						determinedTheme = storedTheme; // Use stored theme if available
				} else {
						console.log('No theme in storage, using system preference as fallback.');
						// If no stored theme, determinedTheme already holds the system preference
				}
			} catch (error) {
				console.error("Failed to get theme from storage:", error);
				// Keep determinedTheme as system preference on error
			} finally {
				console.log('Setting initial theme to:', determinedTheme);
				setInitialTheme(determinedTheme);
				document.documentElement.setAttribute('data-theme', determinedTheme);
				setIsInitialLoad(false); // Mark initial load as complete
			}
		};
		getInitialTheme();
	}, []);

	// Function to subscribe to theme changes in storage
	const subscribe = useCallback((callback) => {
		console.log('Subscribing to theme changes');
		const unwatch = themeStorage.watch((newValue, oldValue) => {
			console.log('Theme changed in storage:', oldValue, '->', newValue);
			if (newValue) {
				document.documentElement.setAttribute('data-theme', newValue);
				callback(); // Notify useSyncExternalStore
			}
		});
		return () => {
			console.log('Unsubscribing from theme changes');
			unwatch();
		};
	}, []);

	// Function to get the current theme snapshot from storage
	const getSnapshot = useCallback(() => {
		// During initial load, return the state value, otherwise read directly for sync
		// This avoids reading storage synchronously on every render initially
		if (isInitialLoad) {
				return initialTheme;
		}
		return document.documentElement.getAttribute('data-theme') || (typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light');
	}, [isInitialLoad, initialTheme]);

	// Use useSyncExternalStore to keep the theme in sync with storage changes
	const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot); // Use getSnapshot for server snapshot too

	const toggleTheme = useCallback(async () => {
		// Read current theme directly from attribute or state as fallback
		const currentTheme = document.documentElement.getAttribute('data-theme') || initialTheme;
		const newTheme = currentTheme === 'light' ? 'dark' : 'light';
		console.log('Toggling theme to:', newTheme);
		try {
			await themeStorage.setValue(newTheme);
			// Watcher updates the attribute, but set it immediately for responsiveness
			document.documentElement.setAttribute('data-theme', newTheme);
		} catch (error) {
			console.error("Failed to set theme:", error);
		}
	}, [initialTheme]); // Depend on initialTheme for fallback in toggle

	// Ensure the attribute is set on initial load completion based on fetched theme
	useEffect(() => {
		if (!isInitialLoad) {
			 document.documentElement.setAttribute('data-theme', theme);
		}
	}, [theme, isInitialLoad]);

	// Avoid rendering children until the initial theme is loaded
	if (isInitialLoad) {
		return null; // Or a loading indicator
	}

	const value = {
		theme,
		toggleTheme,
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
