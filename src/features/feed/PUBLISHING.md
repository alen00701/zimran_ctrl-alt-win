# Trusted publisher pipeline

The feed must use a **verified-publisher, review-first** publishing model. Clubs, leagues, governing bodies and established football newsrooms receive organization accounts only after domain and representative verification. Each organization manages its own owners and editors; there are no public creator accounts.

1. An owner or editor submits a link from the organization’s verified domain with title, summary, rights confirmation and relevant media URL.
2. Automated checks reject unknown domains, duplicate links, incomplete metadata, unsafe media and misleading dates. AI may suggest tags, a short summary and possible duplicates, but creates a **draft only**.
3. An editorial reviewer approves, requests changes or rejects the draft. Approved posts are published with an immutable publisher ID, source URL, reviewer ID and audit timestamp.
4. Urgent trusted feeds may use signed webhooks, but still run the same domain, media-rights and duplicate checks. Their posts remain reversible and auditable.

`publishers.ts` is the client-side mirror of the allow-list rule: `canSubmitForReview` refuses AI actors and unverified domains, while `isVerifiedPublisherPost` prevents untrusted cards from entering the reel. A production API must enforce these checks from its own database; browser code is never authorization.

To onboard a source such as 433, verify its legal entity, an official domain and at least one accountable representative. Add the approved domain and publisher record server-side, then expose the resulting verified profile to this catalogue. Do not treat a social handle alone as verification.
