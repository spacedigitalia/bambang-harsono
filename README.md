### Website Bambang Harsono

Pratinjau tampilan desktop:

![Tampilan Desktop](public/dekstop.png)

## Tech Stack

- **Framework**: Next.js (App Router)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **DB/Service**: MongoDB, ImageKit

## Menjalankan Secara Lokal

1. Install dependencies:
   ```bash
   npm install
   ```
2. Jalankan dev server:
   ```bash
   npm run dev
   ```
3. Buka `http://localhost:3000` di browser.

## Struktur Folder (ringkas)

```txt
.
├─ app/
│  ├─ (auth)/
│  │  ├─ signin/page.tsx
│  │  └─ signup/page.tsx
│  ├─ [slug]/page.tsx
│  ├─ api/
│  │  ├─ achievements/route.ts
│  │  ├─ achievements/upload/route.ts
│  │  ├─ auth/{signin,signout,signup}/route.ts
│  │  ├─ categories/route.ts
│  │  ├─ contact/{route.ts,[id]/route.ts,send-reply/route.ts}
│  │  ├─ frameworks/{route.ts,upload/route.ts}
│  │  ├─ home/{route.ts,upload/route.ts}
│  │  ├─ projects/{route.ts,[slug]/route.ts,categories/route.ts,frameworks/route.ts,edit/route.ts,upload/route.ts}
│  │  └─ skills/{route.ts,tech/{route.ts,upload/route.ts}}
│  ├─ dashboard/
│  │  ├─ achievements/page.tsx
│  │  ├─ contacts/page.tsx
│  │  ├─ home/page.tsx
│  │  ├─ projects/{page.tsx,categories/page.tsx,frameworks/page.tsx}
│  │  ├─ skills/{page.tsx,tech/page.tsx}
│  │  ├─ data.json
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ manifest.json/route.ts
│  └─ sitemap.xml/route.ts
├─ assets/ (gambar statis non-public)
│  ├─ pesawat.png
│  └─ signin.jpg
├─ components/
│  ├─ auth/{signin/SignInLayout.tsx,signup/SignupLayout.tsx}
│  ├─ content/{home/Home.tsx,skills/Skills.tsx,contact/Contact.tsx,projects/...}
│  ├─ dashboard/{home,projects,achievement,contact,skill}/...
│  ├─ layout/{Header.tsx,Footer.tsx}
│  ├─ ui/ (komponen UI: button, input, dialog, dsb.)
│  ├─ app-sidebar.tsx
│  ├─ data-table.tsx
│  ├─ nav-main.tsx
│  ├─ nav-user.tsx
│  ├─ section-cards.tsx
│  └─ site-header.tsx
├─ hooks/
│  ├─ LoadingOverlayWrapper.tsx
│  ├─ QuillEditor.tsx
│  ├─ pagination.tsx
│  ├─ Pathname.tsx
│  ├─ use-mobile.ts
│  └─ Metadata.ts
├─ models/ (schema/data model)
│  ├─ Account.ts
│  ├─ Achievement.ts
│  ├─ Category.ts
│  ├─ Contact.ts
│  ├─ Framework.ts
│  ├─ Home.ts
│  ├─ Projects.ts
│  └─ Skill.ts, TechSkill.ts
├─ utils/
│  ├─ auth/token.ts
│  ├─ context/{AuthContext.tsx,LoadingContext.tsx,ThemaContext.tsx}
│  ├─ fetching/{FetchAchievement.ts,FetchHome.ts,FetchProjects.ts,FetchTechSkills.ts}
│  ├─ imagekit/imagekit.ts
│  ├─ mongodb/mongodb.ts
│  └─ jwt.ts
├─ types/ (*.d.ts tipe global)
├─ lib/utils.ts
├─ public/
│  ├─ dekstop.png  ← digunakan di pratinjau README
│  └─ favicon.ico
├─ next.config.ts
├─ eslint.config.mjs
├─ postcss.config.mjs
├─ tsconfig.json
├─ package.json
└─ README.md
```

## Catatan

- Gambar pratinjau berada di `public/dekstop.png`. Jika ingin mengganti, cukup timpa file tersebut.
- Direktori `.next`, `node_modules`, dan `.git` diabaikan pada struktur ringkas di atas.
# bambang-harsono
