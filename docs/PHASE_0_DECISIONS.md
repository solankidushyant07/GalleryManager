# Gallery Manager — Phase 0 Product Decisions

Confirmed 2026-09-15:

- Minimum Android: API 29 / Android 10+
- Application ID / namespace: `com.coconutshell.gallerymanager`
- Public gallery storage: Android MediaStore
- My Albums: virtual app-managed collections; membership does not move/copy physical files
- Add to Album: album membership only; separate from Move/Copy
- Private: device authentication + PIN + pattern (final protected-storage mechanism still requires security implementation/verification)
- Private content: isolated from normal gallery/system-gallery discovery; public gallery must never index protected media
- Private recovery: device authentication
- Trash: delete-to-Trash, 30-day retention
- Supported media: common Android-decodable images/videos, including the requested common formats; compatibility testing remains required
- Recent: based on media metadata/date, not scan time
- Image editing: non-destructive default
- Composition: editable project plus export
- Share import: copy shared media into gallery-managed public storage
- Product priority: visual fidelity and functionality equally

Still intentionally unresolved:
- exact Private at-rest encryption/protected-storage mechanism
- whether one item may belong to multiple My Albums (virtual albums support this architecturally; UI confirmation can follow)
- exact Private sharing/favorites/album membership policy
- exact filters/actions from final UI reconciliation
- exact device compatibility for every media format
- composition source/project persistence details
