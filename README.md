# Sentinel

## Required functionality
 
Tracker blocking: Your extension should block trackers on the page, using a block list. You are 
free to use one (or multiple) block lists among the ones we have read about in class. Note that 
the popular block lists usually use regex-based rules: either modify the rules to a different format 
that your extension will use or modify your extension to handle regex. 
 
Fingerprint protection mode: Provide a pop-up UI that will enable users to enable or disable 
fingerprinting protection. Pick one of the fingerprinting APIs (e.g., Canvas, WebGL, 
AudioContext). On enabling fingerprinting protection, your extension should (1) display to the 
user that the use of your chosen API has been detected on the site (2) override the values that 
this API returns with a randomized one.  
 
One additional feature: Develop one feature of your choice for this extension. A few ideas (for 
inspiration, your idea need not belong to this list) – visualization of tracking, a real-time privacy 
score for your browsing session, a customizable block list that allows users to upload their own 
rules.   
 
## Testing and evaluation
 
Tracker blocking: Test on at least five sites, especially ones that are likely to have tracking 
(news, shopping, etc.). Use Chrome DevTools to verify that requests are blocked. Provide a 
sample screenshot of one site to show this. 
 
Fingerprint protection: Write a small script (either in console or on your webpage at 
webprivacylabs.com) that runs fingerprinting. Check if your extension behaves as expected 
here. Provide a sample screenshot to show this. You can test this on actual sites as well – note 
that we do not care if the page breaks for this project. You can mention that in your report if you 
observe this behavior.  
 
Additional feature: Provide appropriate evidence (e.g., screenshots) to show the functionality of 
this feature.  
 
## Stretch goals
 
Implementing extra features beyond the requirements or having a very well-done additional 
feature will get you bonus points (amount of points will be decided based on creativity, 
complexity, and correctness of the feature).  

## Grading Rubric

| Category                  | Points | Description                                                                                     |
|---------------------------|--------|-------------------------------------------------------------------------------------------------|
| Answers to questions in part 1 | 20 pts | Correct answers and explanations. Partial points will be given if the methodology is correct, but the final answer is not. |
| Tracker blocking          | 20 pts | Successfully blocks third-party tracking. Shows evidence with testing.                          |
| Fingerprinting protection | 20 pts | Successfully modifies the fingerprinting API value. Shows evidence with testing. Toggling the protection is easy to use. |
| Additional feature        | 20 pts | Successfully implements the chosen feature. Shows evidence with testing.                        |
| Code Quality              | 5 pts  | Code is well-structured and documented.                                                         |
| Report                    | 5 pts  | The report clearly describes the steps taken to complete the project.                           |
| Bonus                     | TBD    | Does the extension go beyond the basic requirements?                                            |


## Ideas for stretch goals

- Allow user to upload their own block lists.
- Allow user to add a single custom rule to the block list.
- Setup automatic updates for the block list.
- Use wxt to generate the extension for firefox as well.
- Visualization of tracking

## DNR Rulesets mapping

| Blocklist | DNR Ruleset | Description |
|-----------|-------------|-------------|
| [Easylist](https://easylist.to/easylist/easylist.txt) | `advert-dnr` | This ruleset blocks ads and trackers. |
| [Easyprivacy](https://easylist.to/easylist/easyprivacy.txt) | `tracker-dnr` | This ruleset blocks tracking scripts. |
| [Fanboy's Social Blocking List](https://easylist.to/easylist/fanboy-social.txt) | `social-dnr` | This ruleset blocks social media trackers. |

## Fingerprinting Protection

### Fingerprinting Protection Results Matrix

| Test Site / API                                      | Canvas Fingerprint | Audio Fingerprint | WebGL Fingerprint |
|------------------------------------------------------|:-----------------:|:----------------:|:----------------:|
| [browserleaks.com/canvas](https://browserleaks.com/canvas)                |    ✅ Different   |        —         |        —         |
| [webbrowsertools.com/canvas-fingerprint](https://webbrowsertools.com/canvas-fingerprint/) |    ✅ Different   |        —         |        —         |
| [webbrowsertools.com/audiocontext-fingerprint](https://webbrowsertools.com/audiocontext-fingerprint/) |        —         |   ✅ Different / Unstable   |        —         |
| [audiofingerprint.openwpm.com](https://audiofingerprint.openwpm.com/)     |        —         |   ✅ Different   |        —         |
| [webbrowsertools.com/webgl-fingerprint](https://webbrowsertools.com/webgl-fingerprint/) |        —         |        —         |   ✅ Different   |
| [browserleaks.com/webgl](https://browserleaks.com/webgl)                 |        —         |        —         |   ✅ Different   |

**Legend:**  
✅ Different — The fingerprint changes on each reload or is randomized  
— Not tested / Not applicable

This matrix summarizes Sentinel's effectiveness at defeating fingerprinting on major test sites for each API.

### Canvas Fingerprinting

Sentinel protects against canvas fingerprinting by intercepting and modifying the results of canvas API calls that are commonly used for browser fingerprinting. When fingerprinting protection is enabled, Sentinel injects a content script into every page and all same-origin iframes. This script overrides key canvas methods (`getImageData`, `toDataURL`, and `toBlob`) in both the main window and any accessible iframes.

Whenever a website or script tries to read pixel data from a canvas (for example, to generate a unique fingerprint), Sentinel's overrides add subtle, random noise to the pixel data. This ensures that the fingerprint generated from the canvas will be different each time, making it unreliable for tracking users.

The extension also monitors for dynamically created iframes and patches their canvas prototypes as soon as they are accessible. This approach defeats advanced fingerprinting techniques that attempt to bypass protections by creating canvases inside iframes.

#### Tested Websites
https://browserleaks.com/canvas  Different fingerprint each time.
https://webbrowsertools.com/canvas-fingerprint/  Different fingerprint each time.


### Audio Fingerprinting

Sentinel protects against audio fingerprinting by intercepting and modifying the results of key Web Audio API methods that are commonly used for browser fingerprinting. When fingerprinting protection is enabled, Sentinel injects a content script into every page and all same-origin iframes. This script overrides important Web Audio methods such as `AnalyserNode.getFloatFrequencyData`, `AudioBuffer.getChannelData`, and `OfflineAudioContext.startRendering`.

Whenever a website or script tries to read audio data for fingerprinting, Sentinel's overrides add subtle, random noise to the audio data. This ensures that the fingerprint generated from the audio context will be different each time, making it unreliable for tracking users.

The extension is careful to only add a very small amount of noise, so that legitimate audio playback and processing are not noticeably affected, but fingerprinting scripts cannot get a stable, unique value.

#### Tested Websites

- https://webbrowsertools.com/audiocontext-fingerprint/ — Breaks fingerprinting (shows indefinite loading or inconsistent results).
- https://audiofingerprint.openwpm.com/ — Different fingerprint each time.


### WebGL Fingerprinting

Sentinel protects against WebGL fingerprinting by intercepting and modifying the results of key WebGL API methods that are commonly used for browser fingerprinting. When fingerprinting protection is enabled, Sentinel injects a content script into every page and all same-origin iframes. This script overrides important WebGL methods such as `getParameter`, `getExtension`, and `readPixels`.

#### Tested Websites

- https://webbrowsertools.com/webgl-fingerprint/ — Different fingerprint each time.
- https://browserleaks.com/webgl — Different fingerprint each time.



## Firefox DNR Redirect Errors

While testing Sentinel in Firefox, you may see errors like:

#### Why do these errors occur?

Firefox does **not** allow Declarative Net Request (DNR) rules to redirect network requests to `data:` URLs (such as base64-encoded video or JavaScript). This is a browser security restriction. Chrome allows some `data:` URL redirects, but Firefox blocks them entirely.

#### How was this resolved?

To ensure compatibility with Firefox, I replaced all DNR rules that redirected to `data:` URLs with rules that simply **block** the request instead. This avoids the error and maintains effective blocking of unwanted resources.

**Summary:**  
- These errors are Firefox-specific and caused by its restriction on `data:` URL redirects in DNR rules.
- The solution is to use `"block"` actions instead of `"redirect"` to `data:` URLs for maximum compatibility.