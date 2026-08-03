# Contributing to benni-nexus

Thanks for your interest! All contributions are welcome.

## Setup

```bash
git clone https://github.com/benni-os/benni-nexus
cd benni-nexus
npm install
```

## Development

```bash
npm run dev        # start with ts-node
npm test           # run tests
npm run typecheck  # type check
npm run lint       # lint
```

## Guidelines

- All new code must pass `npm run typecheck` with zero errors
- Add tests for new features
- Update CHANGELOG.md under `[Unreleased]`
- Follow existing code style (Prettier)
