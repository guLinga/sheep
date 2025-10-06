var pagination = require('hexo-pagination')

// scripts/custom-routes.js
hexo.extend.generator.register('task', function (locals) {
  const config = this.config
  let posts = locals.posts.sort(config.index_generator.order_by)

  posts.data.sort((a, b) => (b.sticky || 0) - (a.sticky || 0))

  posts.data = posts.data.filter((v) => v.index === 'task')

  posts.length = posts.data.length

  return pagination('/task', posts, {
    perPage: config.index_generator.per_page,
    format: 'task/%d%/',
    layout: 'task',
    data: {
      __index: true,
    },
  })
})
