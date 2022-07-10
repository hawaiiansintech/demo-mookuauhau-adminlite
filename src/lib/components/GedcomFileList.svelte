<script lang="ts">
    import { get_mookuauhau_list } from "$lib/graphql-access";
    import { jwt_token } from "$lib/nhost";
    import { onMount } from "svelte";

    let mookuauhauList: Array<any> = [];

	onMount(async() => {
        const data = await get_mookuauhau_list('user', $jwt_token);
        console.log("data: ", data);
        mookuauhauList = data?.mookuauhau;
	});
</script>

{#if mookuauhauList}
<ul>
    {#each mookuauhauList as m}
    <li>
        {m.mookuauhau_id}
        {m.filename}
        {m.file_id}
        {m.owner_id}
        {m.load_status}
    </li>
    {/each}
</ul>
{:else}
<div>no m list</div>
{/if}