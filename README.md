# Drowsie

A cozy alarm app for people who want to wake up **consistently** without dreading mornings.

Traditional alarms optimize for “wake at any cost.” Drowsie optimizes for **emotional comfort**, **sustainable wake habits**, and a **calm, intentional** experience—more bedside companion than drill sergeant.

---

## Vision in one line

> Help users wake up consistently **without hating mornings**.

Full product framing, differentiators, design language, feature map, and success metrics live in [`docs/prodStrategy.md`](docs/prodStrategy.md).

---

## What we’re building (MVP focus)

The long-term roadmap is rich; the near-term slice is narrow. Sequencing and scope discipline are spelled out in [`docs/productGuidelines.md`](docs/productGuidelines.md).

**Must work first**

- Set alarm → fires on time → snooze / dismiss → recurring schedules aligned with basic alarm behavior.
- **Reliability** on real devices (background, battery optimizations, reboots)—the product is only as good as the alarm showing up.

**Must feel like Drowsie**

- At least one calm default path: e.g. volume fade-in and an ambient-leaning wake experience, in the spirit of gradual wake even before “adaptive” intelligence ships.

**Explicitly later (Phase 2+)**

- Adaptive wake intelligence, widgets, bedtime mode, wake verification, and the rest of the feature list—until core alarm UX and sound prove the emotional promise.

---

## Principles (filters for every change)

From the product docs:

1. **Reduce stress** — every screen should answer: does this reduce anxiety or add it?
2. **Intentional simplicity** — especially for half-awake users; shallow settings, one primary flow.
3. **Calm first** — comfort over hyper-productivity aesthetics; subtle haptics; audio as product, not garnish.
4. **Minimal surveillance** — align analytics with what matters (e.g. fired vs dismissed, snooze patterns), not a wall of charts.

---

## Tech stack

| Layer        | Choice                                      |
| ------------ | ------------------------------------------- |
| App runtime  | [Expo](https://expo.dev) (~54)              |
| UI           | React Native, [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routes in `app/`) |
| Styling      | [NativeWind](https://www.nativewind.dev/) (Tailwind) |
| Tooling      | TypeScript, ESLint (Expo config), Prettier  |

This repo is the **mobile client**. Backend and push services are optional follow-ons per [`docs/prodStrategy.md`](docs/prodStrategy.md) (Section 6).

---

## Getting started

**Requirements:** Node.js and npm (or your preferred compatible package manager).

```bash
npm install
npm start
```

Then open the dev menu and run on **iOS simulator**, **Android emulator**, or a **development build**. For day-to-day UI work, [Expo Go](https://expo.dev/go) may be enough; **alarm reliability** must eventually be validated on real devices and, where needed, [development builds](https://docs.expo.dev/develop/development-builds/introduction/).

Other scripts:

| Script            | Command              |
| ----------------- | -------------------- |
| Start dev server  | `npm start`          |
| iOS               | `npm run ios`        |
| Android           | `npm run android`    |
| Web               | `npm run web`        |
| Lint              | `npm run lint`       |
| Reset starter layout | `npm run reset-project` |

---

## Project layout (high level)

- **`app/`** — routes and screens (Expo Router).
- **`src/`** — shared components, hooks, and app-specific modules.
- **`assets/`** — images, fonts, and static assets.
- **`docs/`** — product strategy and execution guidelines (source of truth for *what* and *why*).

---

## Documentation

| Document | Purpose |
| -------- | ------- |
| [`docs/prodStrategy.md`](docs/prodStrategy.md) | Vision, audience, positioning, design system, features, accessibility, monetization, notifications |
| [`docs/productGuidelines.md`](docs/productGuidelines.md) | MVP slice, sequencing, platform risk, sound/haptics, verification vs later, metrics |

---

## Contributing mindset

Every product decision should reinforce:

> **A calm transition between sleep and life.**

If a feature, copy choice, or interaction feels harsh, cluttered, or guilt-driven, it probably does not belong—see [`docs/prodStrategy.md`](docs/prodStrategy.md) Sections 5, 9, and 14.

---

## License

Private project (`"private": true` in `package.json`). Add a public license here if the repo is opened up.
