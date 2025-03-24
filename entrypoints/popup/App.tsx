import './App.css';
import Logo from './components/Logo';
import Fingerprint from './components/Fingerprint';
import Detective from './components/Detective';
import TrackingStats from './components/TrackingStats';

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

					<div className="tracking-stats-container">
						<TrackingStats />
					</div>

				</div>
				<div className="protection-container">
					<div className="header-protection-container">
						<Fingerprint size={28}/>
						<h2>Fingerprinting Protection</h2>
					</div>
					<p>
						Prevents websites from collecting unique device information to create a digital fingerprint, enhancing your anonymity.
					</p>
				</div>
			</div>
		</div>
	);
}

export default App;
