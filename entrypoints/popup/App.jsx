import './App.css';
import Logo from '../icons/Logo.jsx';
import Detective from '../icons/Detective.jsx';
import FingerprintIcon from '../icons/FingerprintIcon.jsx';
import BlockingStats from '../components/BlockingStats.jsx';
import FPToggle from "../components/FPToggle.jsx";
import { 
	getCanvasFPProtectionStorage, setCanvasFPProtectionStorage,
	getWebGLFPProtectionStorage, setWebGLFPProtectionStorage,
	getAudioFPProtectionStorage, setAudioFPProtectionStorage,
	getFontFPProtectionStorage, setFontFPProtectionStorage
} from "../../utils/storage.js";
import { useState, useEffect } from 'react';

function App() {
	// Initialize states with default values
	const [canvasFPProtectionState, setCanvasFPProtectionState] = useState(true);
	const [webGLFPProtectionState, setWebGLFPProtectionState] = useState(true);
	const [audioFPProtectionState, setAudioFPProtectionState] = useState(true);
	const [fontFPProtectionState, setFontFPProtectionState] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadProtectionSettings = async () => {
			try {
				// Load all protection settings
				const canvasValue = await getCanvasFPProtectionStorage();
				const webGLValue = await getWebGLFPProtectionStorage();
				const audioValue = await getAudioFPProtectionStorage();
				const fontValue = await getFontFPProtectionStorage();
				
				console.log('Loaded protection settings:', {
					canvas: canvasValue,
					webGL: webGLValue,
					audio: audioValue,
					font: fontValue
				});
				
				setCanvasFPProtectionState(canvasValue);
				setWebGLFPProtectionState(webGLValue);
				setAudioFPProtectionState(audioValue);
				setFontFPProtectionState(fontValue);
			} catch (error) {
				console.error('Error loading protection settings:', error);
			} finally {
				setIsLoading(false);
			}
		};
		
		loadProtectionSettings();
	}, []);

	async function toggleCanvasFPProtection() {
		const newState = !canvasFPProtectionState;
		console.log('Toggling Canvas protection to:', newState);
		setCanvasFPProtectionState(newState);
		
		try {
			await setCanvasFPProtectionStorage(newState);
		} catch (error) {
			console.error('Failed to save Canvas protection state:', error);
			setCanvasFPProtectionState(!newState); // Revert UI on error
		}
	}

	async function toggleWebGLFPProtection() {
		const newState = !webGLFPProtectionState;
		console.log('Toggling WebGL protection to:', newState);
		setWebGLFPProtectionState(newState);
		
		try {
			await setWebGLFPProtectionStorage(newState);
		} catch (error) {
			console.error('Failed to save WebGL protection state:', error);
			setWebGLFPProtectionState(!newState); // Revert UI on error
		}
	}

	async function toggleAudioFPProtection() {
		const newState = !audioFPProtectionState;
		console.log('Toggling Audio protection to:', newState);
		setAudioFPProtectionState(newState);
		
		try {
			await setAudioFPProtectionStorage(newState);
		} catch (error) {
			console.error('Failed to save Audio protection state:', error);
			setAudioFPProtectionState(!newState); // Revert UI on error
		}
	}

	async function toggleFontFPProtection() {
		const newState = !fontFPProtectionState;
		console.log('Toggling Font protection to:', newState);
		setFontFPProtectionState(newState);
		
		try {
			await setFontFPProtectionStorage(newState);
		} catch (error) {
			console.error('Failed to save Font protection state:', error);
			setFontFPProtectionState(!newState); // Revert UI on error
		}
	}

	return (
		<main className='container' role="main" aria-label="Sentinel Extension Popup">
			<div className="logo-container" role="banner" aria-label="Sentinel Logo and Title">
				<Logo aria-hidden="true" />
				<h1 tabIndex={0}>Sentinel</h1>
			</div>

			<div className="protections-container">
				<section className="protection-container" aria-labelledby="tracking-protection-heading">
					<div className="header-protection-container">
						<Detective size={28} aria-hidden="true" />
						<h2 id="tracking-protection-heading" tabIndex={0}>Tracking Protection</h2>
					</div>
					<p>
						Detects and blocks tracking attempts from websites, ensuring your online activities remain private.
					</p>
					<div className="blocking-stats-container" aria-live="polite">
						<BlockingStats />
					</div>
				</section>
				<section className="protection-container" aria-labelledby="fingerprinting-protection-heading">
					<div className="header-protection-container">
						<FingerprintIcon size={28} aria-hidden="true" />
						<h2 id="fingerprinting-protection-heading" tabIndex={0}>Fingerprinting Protection</h2>
					</div>
					<p>
						Prevents websites from collecting unique device information to create a digital fingerprint, enhancing your anonymity.
					</p>
					<div className="fingerprint-toggles-container">
						<FPToggle 
							type="webgl" 
							enabled={webGLFPProtectionState} 
							onToggle={toggleWebGLFPProtection}
							disabled={isLoading} 
						/>
						<FPToggle 
							type="audio" 
							enabled={audioFPProtectionState} 
							onToggle={toggleAudioFPProtection}
							disabled={isLoading} 
						/>
						<FPToggle 
							type="canvas" 
							enabled={canvasFPProtectionState} 
							onToggle={toggleCanvasFPProtection}
							disabled={isLoading} 
						/>
						<FPToggle 
							type="font" 
							enabled={fontFPProtectionState} 
							onToggle={toggleFontFPProtection}
							disabled={isLoading}
						/>
					</div>
				</section>
			</div>
		</main>
	);
}

export default App;