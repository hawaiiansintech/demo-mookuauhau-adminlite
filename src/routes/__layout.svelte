<script>
	import LoginStatusBox from '$lib/components/LoginStatusBox.svelte';
	import Nav from '$lib/components/Nav.svelte';
</script>

<div>
	<h1>Demo Moʻokūʻauhau Admin Lite</h1>
	<main>
		<slot />
	</main>
</div>
<div>
	<Nav />
</div>

<LoginStatusBox />
