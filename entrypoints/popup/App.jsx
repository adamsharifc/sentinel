import './App.css';
import Logo from '../icons/Logo.jsx';
import Detective from '../icons/Detective.jsx';
import FingerprintIcon from '../icons/FingerprintIcon.jsx';
import BlockingStats from '../components/BlockingStats.jsx';
import FPToggle from "../components/FPToggle.jsx";

function App() {

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
						<FPToggle type="webgl" enabled={true} onToggle={state => console.log('WebGL:', state)} />
						<FPToggle type="audio" enabled={false} onToggle={state => console.log('Audio:', state)} />
						<FPToggle type="canvas" enabled={true} onToggle={state => console.log('Canvas:', state)} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
