# Cicerchie Svelte-SWR

A _stale-while-revalidate_ data fetching library for Svelte.

<br>

![Lastest release](https://badgen.net/github/release/cicerchie/svelte-swr)
![License](https://badgen.net/github/license/cicerchie/svelte-swr)
![Github repo dependents](https://badgen.net/github/dependents-repo/cicerchie/svelte-swr)
![Github pkg dependents](https://badgen.net/github/dependents-pkg/cicerchie/svelte-swr)
![Github open issues](https://badgen.net/github/open-issues/cicerchie/svelte-swr)
![Github status](https://badgen.net/github/checks/cicerchie/svelte-swr/master/Release)
![Bundlephobia MinZip](https://badgen.net/bundlephobia/minzip/@cicerchie/svelte-swr)
![Bundlephobia dependency count](https://badgen.net/bundlephobia/dependency-count/@cicerchie/svelte-swr)
![Snyk](https://badgen.net/snyk/cicerchie/svelte-swr)
![Npm version](https://badgen.net/npm/v/@cicerchie/svelte-swr)
![Npm DT](https://badgen.net/npm/dt/@cicerchie/svelte-swr)
![Npm dependents](https://badgen.net/npm/dependents/@cicerchie/svelte-swr)
![Npm types](https://badgen.net/npm/types/@cicerchie/svelte-swr)
![David DM dep](https://badgen.net/david/dep/cicerchie/svelte-swr)
![David DM dev-dep](https://badgen.net/david/dev/cicerchie/svelte-swr)
![David DM peer-dep](https://badgen.net/david/peer/cicerchie/svelte-swr)

---

### <span style="color:red">WARNING!</span>

These components are still "experimental" (`v0.x.x`).<br>
Some of them are not tested as rigourously as it should be and none of them have been through code review.<br>
Use them at your own risk and check that them do what you want them to do.

---

## Installation

```
npm install @cicerchie/svelte-swr
```

## Usage

```svelte
<script>
  import { newSWR } from "@cicerchie/svelte-swr";

  const players = newSWR<PlayerList>();

  $: players.update({
    key: `players?page=${page}&filter=${JSON.stringify(filter)}`,
    fn: () => playersService.list({ page, filter }),
  });
</script>

{#if $players.isLoading}
  Loading...
{:else if $players.error}
  {$players.error}
{:else}
  {#each $players.data.players as player (player.id)}
    ID: {player.id}
  {:else}
    No players yet
  {/each}
{/if}
```

## Changelog

Is automagically updated with each release and [you can read it here](https://github.com/cicerchie/svelte-swr/blob/master/CHANGELOG.md).

## Features

- [x] Transport and protocol agnostic
- [x] Jamstack oriented
- [x] Fast, lightweight and reusable data fetching (fast page navigation, fast UI)
- [x] Built-in cache
- [x] Cache data and retrieve it when needed
- [x] Initial immediate data (offline or already cached)
- [ ] Typescript ready (still incomplete and so many `any`!)
- [ ] Pagination (done, docs needed)
- [ ] Requests deduplication
- [ ] Enable and disable it with a prop
- [ ] Polling on interval
- [ ] Revalidation on window focus
- [ ] Revalidation on network recovery
- [ ] Local mutation (Optimistic UI)
- [ ] Smart error retry
- [ ] Scroll position recovery
- [ ] Persist and restore from LocalStorage/IndexedDB
- [ ] Clear cache when you need to invalidate all data or specific keys

## TODO

- [ ] Docs (HELP!)
- [ ] Tests (HELP!)
- [ ] Demo site (using `routes` dir: it's a SvelteKit app!)
