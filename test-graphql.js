const fetch = require('node-fetch');

const endpoint = 'https://dev-cannabissomelliersandbox.pantheonsite.io/graphql';
const query = `
  query GetProducts {
    products(first: 5) {
      nodes {
        databaseId
        name
        slug
      }
    }
  }
`;

async function test() {
    console.log('Testing endpoint:', endpoint);
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        console.log('Status:', res.status, res.statusText);
        const text = await res.text();
        console.log('Response body snippet:', text.substring(0, 500));

        if (res.ok) {
            const json = JSON.parse(text);
            if (json.data && json.data.products && json.data.products.nodes) {
                console.log('Successfully fetched', json.data.products.nodes.length, 'products');
            } else {
                console.log('Data structure unexpected:', json);
            }
        }
    } catch (e) {
        console.error('Fetch error:', e.message);
    }
}

test();
