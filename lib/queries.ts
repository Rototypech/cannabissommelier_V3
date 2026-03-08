// ---------------------------------------------------------------------------
// Shared fragment (reused in list and detail queries)
// ---------------------------------------------------------------------------

const FEATURED_IMAGE_FRAGMENT = /* GraphQL */ `
  fragment FeaturedImageFields on NodeWithFeaturedImage {
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Shop page – product list with optional category filter
// ---------------------------------------------------------------------------

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${FEATURED_IMAGE_FRAGMENT}

  query GetProducts($first: Int!, $category: String, $search: String) {
    products(
      first: $first
      where: { status: "publish", category: $category, search: $search }
    ) {
      nodes {
        databaseId
        name
        slug
        ... on NodeWithFeaturedImage {
          ...FeaturedImageFields
        }
        ... on SimpleProduct {
          price
          unitPrice: metaData(key: "_unit_price") {
            value
          }
        }
        ... on VariableProduct {
          price
        }
        ... on ExternalProduct {
          price
        }
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Sidebar – category list
// ---------------------------------------------------------------------------

export const CATEGORIES_QUERY = /* GraphQL */ `
  query GetProductCategories {
    productCategories(first: 100, where: { hideEmpty: true }) {
      nodes {
        databaseId
        name
        slug
        count
        parent {
          node {
            databaseId
            slug
          }
        }
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// generateStaticParams – collect all slugs at build time
// ---------------------------------------------------------------------------

export const SLUGS_QUERY = /* GraphQL */ `
  query GetProductSlugs {
    products(first: 100, where: { status: "publish" }) {
      nodes {
        slug
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Product detail page
// ---------------------------------------------------------------------------

export const PRODUCT_QUERY = /* GraphQL */ `
  query GetProduct($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      __typename
      databaseId
      name
      slug
      description
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      ... on SimpleProduct {
        price
        stockStatus
        unitPrice: metaData(key: "_unit_price") {
          value
        }
        legalNotes: metaData(key: "_legal_notes") {
          value
        }
      }
      ... on VariableProduct {
        price
        variations(first: 50) {
          nodes {
            name
            price
            stockStatus
            unitPrice: metaData(key: "_unit_price") {
              value
            }
          }
        }
      }
      ... on ExternalProduct {
        price
        externalUrl
      }
    }
  }
`;
