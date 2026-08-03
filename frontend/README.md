# Angular frontend

The complete project setup, content-replacement guidance, test commands, Docker instructions, and Azure delivery notes live in the repository-level [`README.md`](../README.md).

From this directory:

```bash
npm ci
npm start
npm run lint
npm test -- --watch=false
npm run build -- --configuration production
```

There is no end-to-end test target yet. Project case studies are lazy-loaded at `/projects/:slug`, while the main recruiter experience uses anchored sections.
