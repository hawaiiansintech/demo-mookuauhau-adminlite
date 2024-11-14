export async function load({ url }) {
	const xref_id = url.searchParams.get('xref_id');

	return {
		xref_id
	};
}
