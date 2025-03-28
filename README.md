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