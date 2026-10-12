
import { Elysia, t } from 'elysia'

// Tipe data produk
type Product = {
  id: number
  name: string
  price: number
  stock: number
  category: string
}

// Data sementara (in-memory)
let products: Product[] = [
  {
    id: 1,
    name: 'Laptop',
    price: 7500000,
    stock: 5,
    category: 'Elektronik'
  },
  {
    id: 2,
    name: 'Mouse',
    price: 150000,
    stock: 20,
    category: 'Aksesoris'
  }
]

let nextId = 3

const app = new Elysia()
  // GET: informasi API
  .get('/', () => ({
    message: 'REST API Manajemen Produk',
    version: '1.0.0',
    endpoints: [
      'GET /products',
      'GET /products/:id',
      'POST /products',
      'PUT /products/:id',
      'PATCH /products/:id',
      'DELETE /products/:id',
      'CONNECT /proxy'
    ]
  }))

  // GET: semua produk
  .get('/products', () => ({
    success: true,
    total: products.length,
    data: products
  }))

  // GET: satu produk berdasarkan ID
  .get('/products/:id', ({ params, set }) => {
    const id = Number(params.id)
    const product = products.find((p) => p.id === id)

    if (!product) {
      set.status = 404
      return {
        success: false,
        message: 'Produk tidak ditemukan'
      }
    }

    return {
      success: true,
      data: product
    }
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1 })
    })
  })

  // POST: menambahkan produk
  .post('/products', ({ body, set }) => {
    const product: Product = {
      id: nextId++,
      ...body
    }

    products.push(product)
    set.status = 201

    return {
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: product
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      price: t.Number({ minimum: 0 }),
      stock: t.Number({ minimum: 0 }),
      category: t.String({ minLength: 1 })
    })
  })

  // PUT: mengganti seluruh data produk
  .put('/products/:id', ({ params, body, set }) => {
    const id = Number(params.id)
    const index = products.findIndex((p) => p.id === id)

    if (index === -1) {
      set.status = 404
      return {
        success: false,
        message: 'Produk tidak ditemukan'
      }
    }

    const updatedProduct: Product = {
      id,
      ...body
    }

    products[index] = updatedProduct

    return {
      success: true,
      message: 'Seluruh data produk berhasil diperbarui',
      data: updatedProduct
    }
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1 })
    }),
    body: t.Object({
      name: t.String({ minLength: 1 }),
      price: t.Number({ minimum: 0 }),
      stock: t.Number({ minimum: 0 }),
      category: t.String({ minLength: 1 })
    })
  })

  // PATCH: mengubah sebagian data produk
  .patch('/products/:id', ({ params, body, set }) => {
    const id = Number(params.id)
    const index = products.findIndex((p) => p.id === id)

    if (index === -1) {
      set.status = 404
      return {
        success: false,
        message: 'Produk tidak ditemukan'
      }
    }

    products[index] = {
      ...products[index]!,
      ...body
    }

    return {
      success: true,
      message: 'Sebagian data produk berhasil diperbarui',
      data: products[index]
    }
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1 })
    }),
    body: t.Object({
      name: t.Optional(t.String({ minLength: 1 })),
      price: t.Optional(t.Number({ minimum: 0 })),
      stock: t.Optional(t.Number({ minimum: 0 })),
      category: t.Optional(t.String({ minLength: 1 }))
    })
  })

  // DELETE: menghapus produk
  .delete('/products/:id', ({ params, set }) => {
    const id = Number(params.id)
    const index = products.findIndex((p) => p.id === id)

    if (index === -1) {
      set.status = 404
      return {
        success: false,
        message: 'Produk tidak ditemukan'
      }
    }

    const deletedProduct = products[index]!
    products = products.filter((p) => p.id !== id)

    return {
      success: true,
      message: 'Produk berhasil dihapus',
      data: deletedProduct
    }
  }, {
    params: t.Object({
      id: t.Numeric({ minimum: 1 })
    })
  })

  // CONNECT: demonstrasi custom HTTP method
  .route('CONNECT', '/proxy', () => ({
    success: true,
    message:
      'Endpoint CONNECT terdaftar. Ini hanya demonstrasi method, bukan proxy tunnel.'
  }))

  .listen(3000)

console.log(
  `REST API berjalan di http://localhost:${app.server?.port}`
)
