import { FastifySchema } from 'fastify';

export const createProductSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['name', 'description', 'price', 'stock'],
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
      },
      description: {
        type: 'string',
        minLength: 10,
        maxLength: 1000,
      },
      price: {
        type: 'number',
        minimum: 0,
      },
      stock: {
        type: 'integer',
        minimum: 0,
      },
      category: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
      },
    },
    additionalProperties: false,
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'integer' },
        category: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

export const updateProductSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
      },
      description: {
        type: 'string',
        minLength: 10,
        maxLength: 1000,
      },
      price: {
        type: 'number',
        minimum: 0,
      },
      stock: {
        type: 'integer',
        minimum: 0,
      },
      category: {
        type: 'string',
        minLength: 2,
        maxLength: 50,
      },
    },
    minProperties: 1,
    additionalProperties: false,
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'integer' },
        category: { type: 'string' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

export const getProductSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'integer' },
        category: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

export const listProductsSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
      category: { type: 'string' },
      minPrice: { type: 'number', minimum: 0 },
      maxPrice: { type: 'number', minimum: 0 },
      search: { type: 'string', minLength: 1 },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number' },
              stock: { type: 'integer' },
              category: { type: 'string' },
            },
          },
        },
        total: { type: 'integer' },
        page: { type: 'integer' },
        totalPages: { type: 'integer' },
      },
    },
  },
};
