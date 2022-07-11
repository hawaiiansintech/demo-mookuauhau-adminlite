<script>
import { isSignedIn, jwt_token, user } from "$lib/nhost";
</script>

<div class="loginstatus">

{#if $isSignedIn && $user}
<div>Aloha {$user.displayName}</div>
{:else}
<div>Aloha anonymous | <a href="/login">Login</a></div>
{/if}

{#if $jwt_token}
<div class="truncate" style="width: 200px;"> | jwt: {$jwt_token}</div>
{/if}

</div>

<style>
    .loginstatus {
        border-style: solid;
        border-color: gray;
        border-width: 1px;
        display: flex;
        width: fit-content;
    }
	.truncate {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>