/**
 * Storefront API GraphQL query documents. Kept as plain tagged strings
 * (no codegen) to avoid adding a build-time dependency for three
 * products — see the "DEPENDENCIES" constraint on this integration.
 */

const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          sku
          barcode
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
          selectedOptions {
            name
            value
          }
          weight
          weightUnit
        }
      }
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFields
    }
  }
`;

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              product {
                id
                handle
                title
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  ${CART_FIELDS}
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`;

export { CART_FIELDS };

/**
 * Journal (Shopify Blog/Article) queries. Shopify's Storefront API only
 * ever returns published articles — there is no draft/unpublished
 * concept exposed here (that's Admin-API-only), so no extra
 * published-status filtering is needed to satisfy "only published
 * articles appear".
 */
const ARTICLE_FIELDS = /* GraphQL */ `
  fragment ArticleFields on Article {
    id
    handle
    title
    excerpt
    contentHtml
    publishedAt
    authorV2 {
      name
    }
    image {
      url
      altText
      width
      height
    }
    seo {
      title
      description
    }
    tags
  }
`;

export const BLOG_ARTICLES_QUERY = /* GraphQL */ `
  ${ARTICLE_FIELDS}
  query BlogArticles($blogHandle: String!, $first: Int!) {
    blog(handle: $blogHandle) {
      id
      title
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            ...ArticleFields
          }
        }
      }
    }
  }
`;

export const ARTICLE_BY_HANDLE_QUERY = /* GraphQL */ `
  ${ARTICLE_FIELDS}
  query ArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        ...ArticleFields
      }
    }
  }
`;

/**
 * Last-resort fallback when the configured/default blog handle doesn't
 * resolve to an actual blog (e.g. a store whose blog isn't named
 * "journal" and hasn't set SHOPIFY_BLOG_HANDLE) — see
 * src/lib/shopify/journal.ts.
 */
export const FIRST_BLOG_HANDLE_QUERY = /* GraphQL */ `
  query FirstBlogHandle {
    blogs(first: 1) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;
