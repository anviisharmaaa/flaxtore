/**
 * Minimal typed subset of the Shopify Storefront API GraphQL schema —
 * only the fields this app's queries in `queries.ts`/`mutations.ts`
 * actually select. Not a full schema mirror.
 */

export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type ShopifySelectedOption = {
  name: string;
  value: string;
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  sku: string | null;
  barcode: string | null;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  image: ShopifyImage | null;
  selectedOptions: ShopifySelectedOption[];
  weight: number | null;
  weightUnit: string | null;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyProductVariant }[] };
};

export type ShopifyProductsQueryResult = {
  products: { edges: { node: ShopifyProduct }[] };
};

export type ShopifyProductByHandleQueryResult = {
  productByHandle: ShopifyProduct | null;
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
  };
  merchandise: {
    id: string;
    title: string;
    image: ShopifyImage | null;
    price: ShopifyMoney;
    selectedOptions: ShopifySelectedOption[];
    product: {
      id: string;
      handle: string;
      title: string;
    };
  };
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  lines: { edges: { node: ShopifyCartLine }[] };
};

export type ShopifyUserError = {
  field?: string[] | null;
  message: string;
  code?: string | null;
};

export type CartCreateResult = {
  cartCreate: { cart: ShopifyCart | null; userErrors: ShopifyUserError[] };
};

export type CartQueryResult = {
  cart: ShopifyCart | null;
};

export type CartLinesAddResult = {
  cartLinesAdd: { cart: ShopifyCart | null; userErrors: ShopifyUserError[] };
};

export type CartLinesUpdateResult = {
  cartLinesUpdate: { cart: ShopifyCart | null; userErrors: ShopifyUserError[] };
};

export type CartLinesRemoveResult = {
  cartLinesRemove: { cart: ShopifyCart | null; userErrors: ShopifyUserError[] };
};
