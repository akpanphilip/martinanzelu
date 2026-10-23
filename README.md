# Martina Nzelu: Portfolio

An animated, fully editable portfolio for a product and UI/UX designer, built with React, Chakra UI and Framer Motion.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Edit content

1. Open `/admin` (there is also a small "Admin" link in the footer).
2. Log in with the default passcode `admin123`, then change it under **Settings**.
3. Use the editors to manage the profile, projects and case studies, services, skills and tools, experience, testimonials and messages. You can also set the accent colour and site options there.

Changes are saved in the current browser and show up on the site straight away.

## Publish changes for every visitor

The admin panel saves to the browser it runs in. To make edits public:

1. Go to **Settings → Export content.json**.
2. Save the file as `public/content.json` in this project.
3. Rebuild and redeploy.

Visitors with no local edits load `public/content.json` automatically. The built-in sample content in `src/data/defaultContent.ts` is used when that file is missing.

## Contact form

Add a form endpoint, such as Formspree, under **Settings → Contact form endpoint** so visitor messages reach your inbox. Without one, the form opens the visitor's email app with the message filled in.

## Deploy

The app works on any static host. SPA rewrites are included for Vercel in `vercel.json` and for Netlify in `public/_redirects`.

## Security note

The admin passcode is checked in the browser. It keeps casual visitors out, but it is not real authentication. Edits only become public once you redeploy them, so nobody can change the live site through `/admin`.
