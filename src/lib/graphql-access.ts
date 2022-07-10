import { gqlRequest, gql } from './graphql-client.js';

export async function get_kanaka_relations_by_xrefid(xref_id: string|undefined, role: string, jwt_token: string) : Promise<any|undefined> {
    console.log(`get_kanaka_relations_by_xrefid(${xref_id}, role, jwt_token)`);

    if(!xref_id) {
        return undefined;
    }

    const query = gql`
query kanakaByXrefidRelations($xref_id: String!) {
  kanaka(where: {xref_id: {_eq: $xref_id}}) {
    kanaka_id
    name
    sex
    residence
    birth_date
    birth_place
    xref_id
    mookuauhau_id
    namakua {
      ohana {
        ohana_id
        xref_id
        kane_id
        wahine_id
        kane {
          kanaka_id
          xref_id
          name
        }
        wahine {
          kanaka_id
          xref_id
          name
        }
      }
    }
    makuakane {
      ohana_id
      xref_id
      kane_id
      wahine {
        kanaka_id
        name
        xref_id
      }
      nakamalii {
        kamalii_id
        ohana {
          ohana_id
          xref_id
        }
        kanaka {
          kanaka_id
          name
          xref_id
          sex
        }
      }
    }
    makuahine {
      ohana_id
      xref_id
      wahine_id
      kane {
        kanaka_id
        name
        xref_id
      }
      nakamalii {
        kamalii_id
        kanaka {
          kanaka_id
          name
          xref_id
          sex
        }
      }
    }
  }
}
    `;
    const variables = {
        xref_id: xref_id,
    };

    let addHeaders = {
        "x-hasura-role": role
    };

    return await gqlRequest(query, variables, jwt_token, addHeaders);
}

export async function get_ohana_by_pk(ohana_id: number, role: string, jwt_token: string) {
    console.log(`get_ohana_by_pk(${ohana_id}, role, jwt_token)`);

    const query = gql`
    query get_ohana_by_pk($ohana_id:Int!) {
        ohana_by_pk(ohana_id: $ohana_id) {
          birth_place
          burial_place
          change_date
          create_timestamp
          formal_name
          kane_id
          marriage_date
          marriage_date_dt
          ohana_id
          marriage_place
          residence
          residence_place
          source_uid
          wahine_id
          xref_id
          mookuauhau_id
        }
      }
    `;
    const variables = {
        ohana_id: ohana_id,
    };

    let addHeaders = {
        "x-hasura-role": role
    };

    return await gqlRequest(query, variables, jwt_token, addHeaders);
}

export async function get_kanaka_by_pk(kanaka_id: number, role: string, jwt_token: string) {
    console.log(`get_kanaka_by_pk(${kanaka_id}, role, jwt_token)`);

    const query = gql`
    query get_kanaka_by_pk($kanaka_id:Int!) {
        kanaka_by_pk(kanaka_id: $kanaka_id) {
          kanaka_id
          _uid
          birth_date
          birth_date_dt
          birth_place
          burial_place
          change_date
          family_child
          create_timestamp
          family_spouse
          formal_name
          name
          name_aka
          name_surname
          residence_place
          residence
          sex
          source_uid
          xref_id
          mookuauhau_id
        }
      }
    `;
    const variables = {
        kanaka_id: kanaka_id,
    };

    let addHeaders = {
        "x-hasura-role": role
    };

    return await gqlRequest(query, variables, jwt_token, addHeaders);
}

export async function get_kanaka_by_xrefid(xref_id: string|undefined, role: string, jwt_token: string) : Promise<any|undefined> {
    console.log(`get_kanaka_by_xrefid(${xref_id}, role, jwt_token)`);

    if(!xref_id) {
        return undefined;
    }

    const query = gql`
    query get_kanaka_by_xrefid($xref_id:String!) {
        kanaka(where: {xref_id: {_eq: $xref_id}}) {
            kanaka_id
            _uid
            birth_date
            birth_date_dt
            birth_place
            burial_place
            change_date
            family_child
            create_timestamp
            family_spouse
            formal_name
            name
            name_aka
            name_surname
            residence_place
            residence
            sex
            source_uid
            xref_id
            mookuauhau_id
        }
    }
    `;
    const variables = {
        xref_id: xref_id,
    };

    let addHeaders = {
        "x-hasura-role": role
    };

    return await gqlRequest(query, variables, jwt_token, addHeaders);
}

export async function get_ohana_by_xrefid(xref_id: string|undefined, role: string, jwt_token: string) : Promise<any|undefined> {
    console.log(`get_ohana_by_xrefid(${xref_id}, role, jwt_token)`);

    if(!xref_id) {
        return undefined;
    }

    const query = gql`
    query get_ohana_by_xrefid($xref_id:String!) {
        ohana(where: {xref_id: {_eq: $xref_id}}) {
            ohana_id
            change_date
            create_timestamp
            formal_name
            source_uid
            xref_id
            kane_id
            wahine_id
            marriage_date
            marriage_date_dt
            marriage_place
            mookuauhau_id
        }
    }
    `;
    const variables = {
        xref_id: xref_id,
    };

    let addHeaders = {
        "x-hasura-role": role
    };

    return await gqlRequest(query, variables, jwt_token, addHeaders);
}

export async function get_mookuauhau_list(role: string, jwt_token: string) : Promise<any|undefined> {
    console.log(`get_mookuauhau_list(role, jwt_token)`);

    const query = gql`
      query getMookuauhauList {
        mookuauhau {
          mookuauhau_id
          name
          filename
          owner_id
          file_id
          load_status
          create_timestamp
        }
      }
    `;
    const variables = {
    };

    let addHeaders = {
        "x-hasura-role": role
    };

    return await gqlRequest(query, variables, jwt_token, addHeaders);
}

export async function createGenealogy(genealogy: any, role: string, jwt_token: string) {
    console.log("createGenealogy()");

    // if (!jwt_token) {
    //     return;
    // }

    let params: { [key: string]: any } = {
        name: genealogy.name,
        owner_id: genealogy.owner_id,
    };

    if (genealogy.file_id) { params.file_id = genealogy.file_id; }
    if (genealogy.filename) { params.filename = genealogy.filename; }
    if (genealogy.load_status) { params.load_status = genealogy.load_status; }

    const query = gql`
    mutation insertMookuauhau($object: mookuauhau_insert_input!) {
        insert_mookuauhau_one(object: $object) {
            mookuauhau_id
            name
            owner_id
            filename
            file_id
            load_status
            create_timestamp
        }
    }
    `;
    const variables = {
        object: params,
    };

    let addHeaders = {
        "x-hasura-role": role
    };

    return await gqlRequest(query, variables, jwt_token, addHeaders);
}

