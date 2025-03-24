import { useEffect, useState } from 'react';

export default function TrackingStats() {
	const [trackersBlocked, setTrackersBlocked] = useState(0);

	useEffect(() => {
		// Fetch the number of trackers blocked using getMatchedRules API
		chrome.declarativeNetRequest.getMatchedRules()
		.then((matchedRules) => {
			// Count the number of unique rules that have been matched
			// This represents how many trackers have been blocked
			setTrackersBlocked(matchedRules.rulesMatchedInfo.length);
			
			// For debugging purposes (remove in production)
			console.log('Matched rules:', matchedRules);
		})
		.catch((error) => {
			console.error('Error fetching matched rules:', error);
		});
	}, []);

	return (
		<>
			<span style={{fontSize: "var(--size-5)", color: "var(--warning-400)"}}>
				<strong> {trackersBlocked} </strong> 
				<span style={{fontSize: "var(--size-3"}}>TRACKERS</span>
			</span>
		</>
	);
}