<script lang="ts">
	import { get_mookuauhau_list } from '$lib/graphql-access';
	import { jwt_token } from '$lib/nhost';
	import { onMount } from 'svelte';

	// exported properties
	export let selectedId: number | undefined;

	let mookuauhauList: Array<any> = [];

	onMount(async () => {
		const data = await get_mookuauhau_list('user', $jwt_token);
		console.log('data: ', data);
		mookuauhauList = data?.mookuauhau;

		// set first
		selectedId = mookuauhauList[0].mookuauhau_id;
	});
</script>

{#if mookuauhauList}
	<div>
		{#each mookuauhauList as m}
			<label>
				<input type="radio" bind:group={selectedId} name="mookuauhau" value={m.mookuauhau_id} />
				{m.name}
				<!-- [load status: {m.load_status}] -->
			</label>
		{/each}
	</div>
{:else}
	<div>-</div>
{/if}
