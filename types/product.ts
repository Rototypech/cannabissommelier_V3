export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText: string;
  };
}

export interface MetaDataValue {
  value: string;
}

export interface ProductBase {
  databaseId: number;
  name: string;
  slug: string;
  description: string;
  featuredImage?: FeaturedImage | null;
  unitPrice?: MetaDataValue[] | null;
  legalNotes?: MetaDataValue[] | null;
}

export interface SimpleProduct extends ProductBase {
  __typename: 'SimpleProduct';
  price?: string | null;
  stockStatus?: string | null;
}

export interface VariableProduct extends ProductBase {
  __typename: 'VariableProduct';
  price?: string | null;
  variations?: {
    nodes: Array<{
      name: string;
      price: string | null;
      stockStatus: string | null;
      unitPrice?: MetaDataValue[] | null;
    }>;
  };
}

export interface ExternalProduct extends ProductBase {
  __typename: 'ExternalProduct';
  price?: string | null;
  externalUrl?: string | null;
}

export type Product = SimpleProduct | VariableProduct | ExternalProduct;

export interface ProductListItem {
  databaseId: number;
  name: string;
  slug: string;
  price?: string | null;
  featuredImage?: FeaturedImage | null;
  unitPrice?: MetaDataValue[] | null;
}

export interface Category {
  databaseId: number;
  name: string;
  slug: string;
  count: number | null;
  parent?: {
    node: {
      databaseId: number;
      slug: string;
    };
  } | null;
}
