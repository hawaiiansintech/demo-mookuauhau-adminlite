<script lang="ts">
	import MookuauhauSelect from '$lib/components/MookuauhauSelect.svelte';
	import { isSignedIn, nhost, signUp, user } from '$lib/nhost';

	let message = '';
</script>

profile

<div style="color:red">{message}</div>

{#if $isSignedIn && $user}
	<div>{$user.displayName}</div>
{:else if $isSignedIn === false}
	<div>anonymous</div>
{:else}
	<div>Page loading...</div>
{/if}
