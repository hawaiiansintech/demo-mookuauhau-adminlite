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

<h2>Supporting Documentation Update</h2>

<div>
	Uploading a GEDCOM file will queue it for processing to a new Moʻokūʻauhau (family tree) dataset.
</div>

<div style="color:red">{message}</div>

	<div id="app">
		<h3>Upload Supporting Documentation</h3>
	</div>
	<form on:submit|preventDefault={uploadFormSubmit}>
		<div class="form-item-wrapper">
			<label for="fam_name" class="form-label">Family Name</label>
			<input id="fam_name" name="fam_name" type="text" placeholder="Family Name" class="form-field" /><br />
			<label for="given_name" class="form-label">Given Name</label>
			<input id="given_name" name="given_name" type="text" placeholder="Given Name" class="form-field" /><br />
			<label for="birthplace" class="form-label">Birthplace</label>
			<input id="birthplace" name="birthplace" type="text" placeholder="Birthplace" class="form-field" /><br />
			<label for="birthdate" class="form-label">Birthdate</label>
			<input id="birthdate" name="birthdate" type="text" placeholder="Birthdate" class="form-field" /><br />
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

<GedcomFileList />

<style>
	.upload {
		display: flex;
		height: 50px;
		width: 50px;
		cursor: pointer;
	}
</style>
