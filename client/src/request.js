const endpointURL = 'http://localhost:9000/graphql';
import {getAccessToken, isLoggedIn} from './auth';

async function graphqlRequest(query, variables){
    const request = {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    if((isLoggedIn())){
        request.headers['authorization'] = 'Bearer ' + getAccessToken();
    }
    const response = await fetch(endpointURL, request );

    const resBody = await response.json();
    if(resBody.errors){
        const msg = resBody.errors.map( err => err.message).join('\n');
        throw new Error(msg);
    }
    return resBody.data;
}

export async function loadJob(id){
    const query = `
    query JobQuery($id: ID!){
        job(id: $id){
            id
            title
            company{
                id
                name
            }
            description
        }
    }
    `
    const data = await graphqlRequest(query, {id});

    return data.job;
}

export async function loadJobs(){
    const query = `
    {
        jobs{
            id
            title
            company{
                id
                name
            }
        }
    }
    `;
    const data = await graphqlRequest(query);
    return data.jobs;
}

export async function loadCompany(id){
    const query = `
        query CompanyQuery($id: ID!){
            company(id: $id){
                id
                name
                description
                jobs {
                    id
                    title
                }
            }
        }
    `;

    const data = await graphqlRequest(query, {id});
    return data.company;
}

export function createJob(input){
    const mutation = `
        mutation CreateJob($input: CreateJobInput){
            job: createJob(input: $input){
                id
                title
                company {
                    id
                    name
                }
            }
        }
    `;

    const data = await graphqlRequest(query, {input});
    return data.job;
};