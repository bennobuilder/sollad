# Turborepo starter

This is an official Yarn v1 starter turborepo.

## What's inside?

This turborepo uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager. 
It includes the following packages/apps:

### Apps and Packages

- `@sl/docs`: A [Next.js](https://nextjs.org) app
- `@sl/web`: Another [Next.js](https://nextjs.org) app
- `@sl/ui`: A stub React component library shared by both `web` and `docs` applications
- `@sl/discord`: A discord bot
- `eslint-config-sl`: `eslint` configurations (includes `@typescript-eslint/eslint-plugin` and `eslint-config-prettier`)
- `@sl/config`: `tsconfig.json`s and other configuration files used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Setup

This repository is used in the `npx create-turbo` command, and selected when choosing which package manager you wish to use with your monorepo (Yarn).

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
yarn run dev
```

## Useful Links

Learn more about the power of Turborepo:

- [Pipelines](https://turborepo.org/docs/core-concepts/pipelines)
- [Caching](https://turborepo.org/docs/core-concepts/caching)
- [Remote Caching (Beta)](https://turborepo.org/docs/core-concepts/remote-caching)
- [Scoped Tasks](https://turborepo.org/docs/core-concepts/scopes)
- [Configuration Options](https://turborepo.org/docs/reference/configuration)
- [CLI Usage](https://turborepo.org/docs/reference/command-line-reference)
