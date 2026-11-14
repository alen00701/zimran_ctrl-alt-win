# Feed media

The November 14, 2026 feed uses full-height, scroll-snapped media posts. Videos are the team's own files in `assets/videos/` (H.264 MP4, bundled by Vite and played with a native `<video>` element). They autoplay muted while their card is on screen, rewind when it leaves, and can be paused or unmuted from the action rail. No video is loaded from the internet.

## Image credits and sources

- `assets/messi.png`: Inter Miami CF, [debut match recap](https://www.intermiamicf.com/news/match-recap-lionel-messi-scores-late-free-kick-winner-in-inter-miami-cf-debut).
- `assets/transfer.png`: Inter Miami CF, [signing announcement](https://www.intermiamicf.com/news/inter-miami-cf-signs-seven-time-ballon-d-or-winner-world-cup-champion-lionel-mes).
- `assets/liverpool.png`: UEFA, [Liverpool–Barcelona replay article](https://www.uefa.com/uefachampionsleague/news/025d-0f5553e09799-f2005c82c870-1000--watch-in-full-liverpool-4-0-barca/).
- `assets/lloyd.jpg`: U.S. Soccer, [Carli Lloyd’s greatest moments](https://www.ussoccer.com/stories/2025/05/top-10-carli-lloyd-best-uswnt-moments-fifa-world-cup-olympics).
- `assets/maradona.jpg`: FIFA video thumbnail, [Maradona’s Famous 8 Minutes](https://www.youtube.com/watch?v=FRAbNlPS2MI). FIFA authorship checked through YouTube oEmbed.
- `assets/preview.png`: MLS, [2026 playoff schedule](https://www.mlssoccer.com/news/audi-2026-mls-cup-playoffs-field-set-and-wild-card-match-schedule-announced). The source confirms Orlando–Cincinnati on November 19 at 7:30 PM ET.

Images are publisher preview artwork with credits shown in the interface. These credits do not confer a redistribution license; clear image rights before public commercial release.

## Videos (team-supplied)

| File | Post |
| --- | --- |
| `yamal.mp4` | Lamine Yamal clip (always first in the feed) |
| `goalyamal.mp4` | A Yamal goal |
| `barsapsglastmatch.mp4` | Barça vs PSG, the last match |
| `neymar.mp4` | Neymar |
| `coutihno.mp4` | Coutinho |
| `doue.mp4` | Désiré Doué |
| `olise.mp4` | Michael Olise |
| `taarabt.mp4` | Adel Taarabt |

Descriptions are written from the file names only; the event date is not known, so these posts show the edition date. Confirm rights to the footage before any public commercial release.

## Behavior

Five seconds on an active story or opening its details records one unique view using shared state. Opening a panel suspends its video. The feed inserts at most two optional quiz cards after the third and sixth video in a session; answering or skipping a card persists and removes it. Interest changes reorder the feed; recording views does not reset scroll. The browser appends a fresh material batch before the reader reaches the end. Share copies the story’s public URL rather than the generic feed URL. Arrow keys work when the feed region is focused; desktop also has previous/next controls. Promotions remain marked as demo placements.
