import './App.css';
import Logo from '../icons/Logo.jsx';
import Detective from '../icons/Detective.jsx';
import FingerprintIcon from '../icons/FingerprintIcon.jsx';
import BlockingStats from '../components/BlockingStats.jsx';
import FPToggle from "../components/FPToggle.jsx";
import { 
	getCanvasFPProtectionStorage, setCanvasFPProtectionStorage,
	getWebGLFPProtectionStorage, setWebGLFPProtectionStorage,
	getAudioFPProtectionStorage, setAudioFPProtectionStorage
} from "../../utils/storage.js";
import { useState, useEffect } from 'react';

function App() {
  // Initialize states with default values
  const [canvasFPProtectionState, setCanvasFPProtectionState] = useState(true);
  const [webGLFPProtectionState, setWebGLFPProtectionState] = useState(true);
  const [audioFPProtectionState, setAudioFPProtectionState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProtectionSettings = async () => {
      try {
        // Load all protection settings
        const canvasValue = await getCanvasFPProtectionStorage();
        const webGLValue = await getWebGLFPProtectionStorage();
        const audioValue = await getAudioFPProtectionStorage();
        
        console.log('Loaded protection settings:', {
          canvas: canvasValue,
          webGL: webGLValue,
          audio: audioValue
        });
        
        setCanvasFPProtectionState(canvasValue);
        setWebGLFPProtectionState(webGLValue);
        setAudioFPProtectionState(audioValue);
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

  return (
    <div className='container'>
		<div className="logo-container">
			<Logo />
			<h1>Sentinel</h1>
		</div>

		<div className="protections-container">
			<div className="protection-container">
				<div className="header-protection-container">
					<Detective size={28} />
					<h2>Tracking Protection</h2>
				</div>

				<p>
					Detects and blocks tracking attempts from websites, ensuring your online activities remain private.
				</p>

				<div className="blocking-stats-container">
					<BlockingStats />
				</div>
			</div>
			<div className="protection-container">
				<div className="header-protection-container">
					<FingerprintIcon size={28}/>
					<h2>Fingerprinting Protection</h2>
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
				</div>
			</div>
		</div>
    </div>
  );
}

export default App;