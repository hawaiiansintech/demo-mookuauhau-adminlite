// nhost client

import { NhostClient, type NhostClientConstructorParams } from "@nhost/nhost-js";
import { writable, type Writable } from "svelte/store";

export const VITE_NHOST_BACKEND_URL = import.meta.env.VITE_NHOST_BACKEND_URL as string;
export const VITE_PROFILE_REDIRECTTO = import.meta.env.VITE_PROFILE_REDIRECTTO as string;

export const config: NhostClientConstructorParams = {
    backendUrl: VITE_NHOST_BACKEND_URL,
};

export const nhost = new NhostClient(config);

// store
export const isSignedIn = writable(null);
export const user = writable(null);
export const jwt_token = writable('');

// claims / roles
export const claimUserId: Writable<string|undefined> = writable('');
export const claimRole: Writable<string|undefined> = writable('');
export const claimRoleDefault: Writable<string|undefined> = writable('');
export const claimRoleAllowed: Writable<Array<string>|undefined> = writable([]);
export const claimRoleSelectable: Writable<Array<string>|undefined> = writable([]);
// export const active_role: Writable<string|undefined> = writable('');

nhost.auth.onAuthStateChanged(
    (event, session) => {
        console.log(`auth state changed. State is now ${event} with session: `, session);
        const jwt = session?.accessToken;

		claimUserId.set(session?.user?.id); // auth.getClaim('x-hasura-user-id');
		claimRole.set(session?.user?.defaultRole); //auth.getClaim('x-hasura-role');
		claimRoleDefault.set(session?.user?.defaultRole); // auth.getClaim('x-hasura-default-role');
		claimRoleAllowed.set(session?.user?.roles);  // auth.getClaim('x-hasura-allowed-roles');

		// active_role.set(Cookie.get('active_role'));

        if (event === 'SIGNED_IN') {
            isSignedIn.set(true);
            user.set(session?.user);
            if(session?.accessToken) {
                jwt_token.set(session.accessToken);
                console.log("set $jwt_token ", session.accessToken.substring(0,6) + '...');
            }
        }
        else {
            isSignedIn.set(false);
            user.set(null);
            jwt_token.set('');
        }
    }
);

nhost.auth.onTokenChanged((session) => {
    console.log('auth.onTokenChanged() The access and refresh token has changed');
    console.log("session: ", session);
    const jwt = session?.accessToken;
    if(jwt) {
        jwt_token.set(session.accessToken);
        console.log("set $jwt_token ", session.accessToken.substring(0,6) + '...');
    }
});

export async function signIn(parameters) {
    // console.log("signIn(parameters): ", parameters);

    let params = {
        email: parameters.email,
        password: parameters.password,
        options: {
            redirectTo: VITE_PROFILE_REDIRECTTO,
        },
    };

    // TODO: sanitize inputs

    const data = await nhost.auth.signIn(params);

    return {
        ...data,
    };
}

export async function signUp(parameters) {
    // console.log("signUp(parameters): ", parameters);

    let params = {
        email: parameters.email,
        password: parameters.password,
        options: {
            redirectTo: VITE_PROFILE_REDIRECTTO,
        },
    };

    // TODO: sanitize inputs

    const data = await nhost.auth.signUp(params);

    return {
        ...data,
    };
}
