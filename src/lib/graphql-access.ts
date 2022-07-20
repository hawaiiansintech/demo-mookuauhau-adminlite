import { gqlRequest, gql } from './graphql-client.js';

export async function get_kanaka_relations_by_xrefid(mookuauhau_id: number|undefined, xref_id: string|undefined, role: string, jwt_token: string) : Promise<any|undefined> {
    console.log(`get_kanaka_relations_by_xrefid(${mookuauhau_id}, ${xref_id}, role, jwt_token)`);

    if(!mookuauhau_id) {
        return undefined;
    }
    if(!xref_id) {
        return undefined;
    }

    const query = gql`
      query kanakaByXrefidRelations($mookuauhau_id: Int!, $xref_id: String!) {
        kanaka(where: {xref_id: {_eq: $xref_id}, mookuauhau_id: {_eq: $mookuauhau_id}}) {
          kanaka_id
          name
          sex
          residence
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
              residence
              residence_place
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
              birth_date
              birth_date_dt
              birth_place
              death_date
              death_date_dt
              death_place
              burial_place
              formal_name
              name_aka
              name_surname
              residence_place
              residence
            }
            nakamalii {
              kamalii_id
              ohana {
                ohana_id
                xref_id
                residence_place
                residence
                marriage_date
                marriage_date_dt
                marriage_place
              }
              kanaka {
                kanaka_id
                name
                xref_id
                sex
                birth_date
                birth_date_dt
                birth_place
                death_date
                death_date_dt
                death_place
                burial_place
                formal_name
                name_aka
                name_surname
                residence_place
              }
            }
            residence
            residence_place
            marriage_place
            marriage_date_dt
            marriage_date
          }
          makuahine {
            ohana_id
            xref_id
            wahine_id
            kane {
              kanaka_id
              name
              xref_id
              birth_date
              birth_date_dt
              birth_place
              death_date
              death_date_dt
              death_place
              burial_place
              formal_name
              name_aka
              name_surname
              residence_place
            }
            nakamalii {
              kamalii_id
              kanaka {
                kanaka_id
                name
                xref_id
                sex
                birth_date
                birth_date_dt
                birth_place
                death_date
                death_date_dt
                death_place
                burial_place
                formal_name
                name_aka
                name_surname
                residence_place
              }
            }
            residence_place
            residence
            marriage_place
            marriage_date_dt
            marriage_date
          }
          birth_date
          birth_date_dt
          birth_place
          death_date
          death_date_dt
          death_place
          burial_place
          formal_name
          name_aka
          name_surname
          residence_place
          source_uid
        }
      }
        `;
    const variables = {
        mookuauhau_id: mookuauhau_id,
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

export async function delete_mookuauhau(mookuauhau_id: number|undefined, role: string, jwt_token: string) : Promise<any|undefined> {
    console.log(`delete_mookuauhau(${mookuauhau_id}, role, jwt_token)`);

    if(!mookuauhau_id) {
        return undefined;
    }

    const query = gql`
      mutation delete_mookuauhau($mookuauhau_id: Int!) {
        delete_mookuauhau(where: {mookuauhau_id: {_eq: $mookuauhau_id}}) {
          affected_rows
        }
      }
    `;
    const variables = {
        mookuauhau_id: mookuauhau_id,
    };

    let addHeaders = {
        "x-hasura-role": role
    };

    return await gqlRequest(query, variables, jwt_token, addHeaders);
}

