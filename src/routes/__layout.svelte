<script>
	import LoginStatusBox from '$lib/components/LoginStatusBox.svelte';
</script>


<div>
	<h1>Demo Moʻokūʻauhau Browser</h1>
	<main>
		<slot />
	</main>
</div>
<div>
	<section class="nav">
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/search">Search</a></li>
			<li><a href="/login">Login</a></li>
			<li><a href="/register">Register</a></li>
		</ul>
	</section>
</div>

<LoginStatusBox />

<style>
    .nav {
        border-style: dotted;
        border-color: gray;
        display: flex;
        width:auto;
    }
</style>