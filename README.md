# Just For You — a little birthday/anniversary surprise site

A single-page interactive surprise: lock screen → loading → "years together"
counter → photo memories carousel → a wax-seal letter reveal → celebration
confetti burst.

## How to open it
Just double-click `index.html` (or open it in any browser). No build step,
no install — it's plain HTML/CSS/JS.

## How to personalize it (the only file you need to touch)
Open **`js/script.js`** and edit the `CONFIG` object at the very top of the
file. Every line is commented with `REPLACE`:

| Setting | What it does |
|---|---|
| `passkey` | The code typed on the lock screen keypad |
| `hintPhoto` | The circular photo on the lock screen (tap it for a hint) |
| `togetherSince` | Start date used to calculate the years/months/days counter |
| `counterTitle` / `counterSubtitle` | Headline text on the counter screen |
| `photos` | Array of `{ src, caption }` for the memories carousel — add or remove as many as you like |
| `letter` | The full text of the letter — blank lines start new paragraphs |

You do **not** need to touch `index.html`, `css/style.css`, or the rest of
`js/script.js` — those just render whatever is in `CONFIG`.

## Where to put your photos
Drop your image files into the **`images/`** folder, then point to them from
`CONFIG` using a relative path like `images/your-file.jpg` — that's it.

Currently included are placeholder images so you can see the layout:
- `images/hint-photo.jpg` — the lock-screen photo
- `images/photo-1.jpg`, `photo-2.jpg`, `photo-3.jpg` — the memories carousel

Replace these files (keep the same names, or update the paths in `CONFIG`)
with your real photos. Any reasonable JPG/PNG works; photos roughly in a
4:5 portrait ratio will look best in the carousel.

## Notes
- Everything runs locally in the browser — nothing is uploaded anywhere.
- Works on mobile and desktop; the whole thing is one continuous scroll-free
  flow with swipeable photos.
- To host it for free so you can send a link (e.g. to open on someone else's
  phone), you can drag this whole folder onto a static host like Cloudflare
  Pages, Netlify, or GitHub Pages.
