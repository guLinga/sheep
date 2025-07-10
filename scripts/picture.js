var pagination = require('hexo-pagination')

// scripts/custom-routes.js
hexo.extend.generator.register('picture', function (locals) {
  const config = this.config
  let posts = locals.posts.sort(config.index_generator.order_by)

  posts.data.sort((a, b) => (b.sticky || 0) - (a.sticky || 0))

  posts.data = posts.data.filter((v) => v.index === 'picture')

  return pagination('/picture', posts, {
    path: 'picture/index.html',
    format: 'picture/page/%d%',
    layout: 'picture',
  })
})

hexo.extend.generator.register('index', function (locals) {
  const config = this.config
  let posts = locals.posts.sort(config.index_generator.order_by)

  posts.data.sort((a, b) => (b.sticky || 0) - (a.sticky || 0))

  posts.data = posts.data.filter((v) => !v.index)

  const paginationDir =
    config.index_generator.pagination_dir || config.pagination_dir || 'page'
  const path = config.index_generator.path || ''

  return pagination(path, posts, {
    perPage: config.index_generator.per_page,
    layout: config.index_generator.layout || ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true,
    },
  })
})
