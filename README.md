# Next.js 14 Message Box

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It displays a messaging box using Next.js 14 with Server Actions, Tailwind CSS, and Prisma, and is progressively enhanced with React 19 features.

A deployed, slightly altered version of the optimistic message box can be found [here](https://next15-remix-contacts-rebuild-v2.vercel.app/).

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Getting Started

First, force install the dependencies to make the React 19 Beta work:

```bash
npm install --force
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Prisma Setup

You need decide between prisma local development with `sqlite` or a real database with for example `sqlserver`. Define it in the `schema.prisma` file.

Consider adding a `.env` file to the root of the project and using these inside `schema.prisma` with `env("DATABASE_URL")`, refer to `.env.sample`.

After switching, delete the `prisma/migrations` folder before running the migration command.

When using sqlserver, you need to migrate the database schema with:

```bash
npm run prisma.migrate
```

When using sqllite, initialize with:

```bash
npm run prisma.push
```

Seed prisma/seed.ts for initial data:

```sh
npm run prisma.seed
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
