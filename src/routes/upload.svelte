<script lang="ts">
	import GedcomFileList from '$lib/components/GedcomFileList.svelte';
	import { createGenealogy } from '$lib/graphql-access';
	import { isSignedIn, jwt_token, nhost, user } from '$lib/nhost';

	let message = '';

	let fileinput;

	function onFileSelected(e) {
		console.log('onFileSelected(e)');
		// let filepathToUpload = e.target.files[0];
		// let reader = new FileReader();
		// reader.readAsDataURL(filepathToUpload);
		// reader.onload = e => {
		// };
	}
	async function uploadFormSubmit(e) {
		console.log('uploadFormSubmit()');
		const formData = new FormData(e.target);
		const submitData = {};
		for (let field of formData) {
			const [key, value] = field;
			submitData[key] = value;
		}
		console.log('submitData: ', submitData);

		console.log("submitData['gedcomfile']: ", submitData['gedcomfile']);

		try {
			const data = await nhost.storage.upload({ file: submitData['gedcomfile'] });
			console.log(data);
			if (data.error) {
				console.log('data.error: ', data.error);
				message = data.error.message;
			} else {
				message = 'success';

				//fileMetadata: Object { id: "0cc3058c-85cd-4a4f-87e6-c1833860e6d1", name: "kekoolani_07-10-2011.ged", size: 1493829, … }

				// if fileupload works, also insert mookuauhau record with reference
				if ($user && $user.id) {
					const genealogy = {
						name: submitData['name'] || data?.fileMetadata?.name,
						owner_id: $user.id,
						filename: data?.fileMetadata?.name,
						file_id: data?.fileMetadata?.id,
						load_status: 'new'
					};
					await createGenealogy(genealogy, 'user', $jwt_token);
				} else {
					throw Error('missing user id');
				}
			}
		} catch (error) {
			console.log('error: ', error);
			message = message + '; ' + error?.message;
		}
	}
</script>

<h2>GEDCOM file upload</h2>

<div>
	Uploading a GEDCOM file will queue it for processing to a new Moʻokūʻauhau (family tree) dataset.
</div>

<div style="color:red">{message}</div>

{#if $isSignedIn && $user}
	<div>you are signed in, {$user.displayName}</div>

	<div id="app">
		<h3>Upload GEDCOM File</h3>
	</div>
	<form on:submit|preventDefault={uploadFormSubmit}>
		<div class="form-item-wrapper">
			<label for="name" class="form-label">Family Tree Name</label>
			<input id="name" name="name" type="text" placeholder="Family Tree Name" class="form-field" />
		</div>
		<input type="hidden" name="" bind:this={fileinput} />

		<img
			class="upload"
			src="https://static.thenounproject.com/png/625182-200.png"
			alt=""
			on:click={() => {
				fileinput.click();
			}}
		/>
		<div
			class="chan"
			on:click={() => {
				fileinput.click();
			}}
		>
			Choose GEDCOM file
		</div>
		<input
			name="gedcomfile"
			type="file"
			accept=".ged, .gedcom"
			on:change={(e) => onFileSelected(e)}
			bind:this={fileinput}
		/>
		<input type="submit" value="Submit/Upload" />
	</form>
{:else if $isSignedIn === false}
	<div>
		please log in to upload files. The files need to be tied to a logged in user 
		(unless you load using gedcomloader in <a href="https://github.com/hawaiiansintech/mookuauhau-backend">hawaiiansintech/mookuauhau-backend</a>).
	</div>
{:else}
	<div>Page loading...</div>
{/if}

<GedcomFileList />

<style>
	.upload {
		display: flex;
		height: 50px;
		width: 50px;
		cursor: pointer;
	}
</style>
