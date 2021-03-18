import auth from '@/middlewares/authMiddleware'
import guest from '@/middlewares/guestMiddleware'

const storedMiddlewares = {
  auth,
  guest,
}

function useMiddleware(context, ...listMiddleware) {
  const currentMiddleware = listMiddleware.shift()
  const middleware = storedMiddlewares[currentMiddleware]

  if (!middleware) {
    throw new Error(`The ${currentMiddleware} middleware not found.`)
  }

  const res = middleware(context)

  if (res === undefined) {
    return
  } else if (res === null && listMiddleware.length) {
    useMiddleware(context, listMiddleware)
  } else {
    context.next()
  }
}

export default (router, store) => {
  router.beforeEach((to, from, next) => {
    const context = { to, from, next, router, store }
    const middleware = to.meta?.middleware

    if (middleware) {
      useMiddleware(context, middleware)
    }
  })
}
