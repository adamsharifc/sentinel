export default defineContentScript({
    matches: ['http://*/*', 'https://*/*'],
    run_at: 'document_start',
    all_frames: true,
    world: 'MAIN',

    main: () => {
        // Generate session noise
        const noise = () => (Math.random() * 0.0002) - 0.0001; // Small noise

        // Patch AnalyserNode.getFloatFrequencyData
        if (window.AnalyserNode) {
            const origGetFloatFrequencyData = AnalyserNode.prototype.getFloatFrequencyData;
            Object.defineProperty(AnalyserNode.prototype, "getFloatFrequencyData", {
                value: function(array) {
                    origGetFloatFrequencyData.call(this, array);
                    for (let i = 0; i < array.length; i += 100) { // Only every 100th sample for performance
                        array[i] += noise();
                    }
                },
                configurable: true,
                writable: true
            });
        }

        // Patch AudioBuffer.getChannelData (mutate in-place, no Proxy)
        if (window.AudioBuffer) {
            const origGetChannelData = AudioBuffer.prototype.getChannelData;
            Object.defineProperty(AudioBuffer.prototype, "getChannelData", {
                value: function(channel) {
                    const data = origGetChannelData.call(this, channel);
                    for (let i = 0; i < data.length; i += 100) { // Only every 100th sample for performance
                        data[i] += noise();
                    }
                    return data;
                },
                configurable: true,
                writable: true
            });
        }

        // Patch OfflineAudioContext.startRendering
        if (window.OfflineAudioContext) {
            const origStartRendering = OfflineAudioContext.prototype.startRendering;
            Object.defineProperty(OfflineAudioContext.prototype, "startRendering", {
                value: function() {
                    return origStartRendering.apply(this, arguments).then(buffer => {
                        // Add noise to all channels
                        for (let i = 0; i < buffer.numberOfChannels; i++) {
                            const data = buffer.getChannelData(i);
                            for (let j = 0; j < data.length; j += 100) {
                                data[j] += noise();
                            }
                        }
                        return buffer;
                    });
                },
                configurable: true,
                writable: true
            });
        }

        console.log('[Sentinel] Web Audio fingerprinting protection active');
    }
});