# Asset Uploads

To manage your personal files (like your headshot and CV), add them directly to this `assets` directory.

## How to use:
1. Place your headshot image here (e.g., `headshot.jpg`).
2. Place your CV PDF here (e.g., `CV.pdf`).
3. Update `src/data/content.ts` to point to these files:
   ```typescript
   export const content = {
     // ...
     headshot: "/assets/headshot.jpg",
     cv: "/assets/CV.pdf",
   };
   ```

Because these files are in your `public` folder, Vite will automatically serve them from the root domain, making them easily accessible!
