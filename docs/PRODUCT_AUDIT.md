# mentHer product and interface audit

## Findings addressed

- Authentication forms called endpoints that did not exist. Added a persistent API with password hashing (scrypt with per-password salts), opaque server sessions, HttpOnly/SameSite cookies, session expiry and login throttling.
- Browser local storage previously determined authentication. Session restoration now asks the server; protected API routes enforce identity and roles.
- Dashboards consisted of headings and placeholder text. Replaced them with editable profiles, mentor discovery, requests, mentor responses, accepted-connection messages, official resources and private bookmarks.
- The mentor directory never existed. Mentors become discoverable after completing a bio and expertise. Searches cover names, industries and expertise; same-industry profiles appear first. No invented match scores or verified claims.
- Public admin/verification concepts had no implementation. Removed the inactive admin shell from the live app. Public signup accepts only entrepreneur and mentor roles.
- Generic emoji cards, broad purple buttons and repeated navigation lacked hierarchy. Introduced a warm ivory/plum/sage system, custom botanical SVG, editorial serif accents, smaller controls, deliberate whitespace and reusable surface styles.
- Labels, loading feedback and errors were inconsistent. Added native form constraints, server validation, visible notices, empty states, focus rings, skip links, reduced-motion support, reduced-transparency fallbacks and responsive navigation.
- A default React test and title remained. Replaced both; added API workflow and access-control checks.

## Material direction

Use glass where it helps explain layering: navigation, floating illustration labels and modal backdrops. Keep reading/editing surfaces substantially opaque. The web treatment is CSS frosted glass inspired by Liquid Glass, not Apple's native refractive material. Soft shadows give buttons and cards depth without hiding edges or state. Do not add every “morphism” to one product.

Research:
- [Apple: Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Apple: Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)
- [Nielsen Norman Group: Glassmorphism](https://www.nngroup.com/articles/glassmorphism/)

Premium quality here means clear hierarchy, recognisable identity, careful type, honest content and complete interactions. Effects support those choices.

## Recommended next product work

1. **Trust before scale:** email verification/recovery, mentor credential review, reporting, blocking, clear privacy policy and account deletion. Only show a verified badge after a defined review.
2. **Make mentorship actionable:** availability, session requests, time-zone-aware scheduling and mutually agreed goals. Validate the flow with founders and mentors before building video calls.
3. **Improve relevance:** collect business stage, current challenge, language and mentor availability; show why a suggestion fits. Avoid opaque scoring until there is evidence it helps.
4. **Maintain resources:** assign an editor, add provider review dates and broken-link checks. Introduce eligibility filters only when authoritative criteria can be kept current.
5. **Measure outcomes:** request acceptance, time to first reply, completed sessions and goal progress. Member counts and glossy cards are not evidence of impact.
6. **Launch operations:** choose deployment, backup/restore, monitoring, abuse handling, pagination, and durable multi-instance storage. SQLite suits this local MVP; the initial MySQL schema remains a historical design document.

## Verification scope

Automated API checks exercise both roles, private messaging, duplicate requests/accounts, invalid roles/passwords, cross-origin rejection, logout, bookmark isolation and persistence across login. Frontend tests exercise role-aware signup/error handling and FAQ disclosure. A production build and local browser checks supplement these tests. The app does not claim a full accessibility audit, penetration test or production load test.

## Visual refinement follow-up

The final direction uses charcoal backgrounds, dusty rose actions and editorial Newsreader headings, with muted teal for supporting accents. Source Sans 3 remains the reading/form font. Both fonts are self-hosted with their licenses. A custom mH/leaf monogram replaces the star decoration; contours provide subtle ornamental motion.

Reviewed guest pages and both member roles at phone, tablet and desktop widths (320–1440px). Enlarged small text, ensured 16px form inputs, improved touch targets, added animated FAQ disclosure and reduced-motion fallbacks. Mobile navigation now locks background scrolling, supports Escape and restores focus. Unknown workspace tabs recover to Overview. Temporary audit accounts were removed. This is a responsive visual and workflow review, not a full assistive-technology certification.
