<script lang="ts">
    import { isSignedIn, nhost, signUp, user } from '$lib/nhost';

    let message = '';

    async function registerFormSubmit(e) {
		console.log('registerFormSubmit()');
		const formData = new FormData(e.target);
		const submitData = {};
		for (let field of formData) {
			const [key, value] = field;
			submitData[key] = value;
		}
		console.log("submitData: ", submitData);
		const data = await signUp(submitData);
		console.log(data);
        if(data.error) {
            message = data.error.message;
        }
        else {
            message = "register success";
        }
	}

</script>

<h2>register</h2>

<div style="color:red">{message}</div>

{#if $isSignedIn && $user}
    <div>you are signed in, {$user.displayName}</div>
    <div>sign out to register as another user</div>
    <div><a href="#signout" on:click={()=> nhost.auth.signOut()}>sign out</a></div>
{:else if $isSignedIn === false}
    <div>please register below</div>

    <form on:submit|preventDefault={registerFormSubmit}>
        <div class="form-item-wrapper">
			<label for="email" class="form-label">Email</label>
			<input name="email" type="text" placeholder="Email" class="form-field" />
		</div>
		<div class="form-item-wrapper">
			<label for="password" class="form-label">Password</label>
			<input name="password" type="password" placeholder="Password" class="form-field" />
		</div>

		<input type="submit" value="Sign Up" />
    </form>

{:else}
    <div>Page loading...</div>
{/if}

<style>
	.form-label {
		display: inline-block;
		min-width: 6em;
	}
</style>