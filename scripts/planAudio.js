// 为 plan 页的讲道链接生成列表页：/planAudio/1, /planAudio/2 ...
// 文章放在 source/_posts/planAudio/{天数}/ 下；讲道天数见 scripts/lib/planData.js
const { sermonDays } = require('./lib/planData')
hexo.extend.generator.register('planAudio', function () {
  const posts = this.locals.get('posts').toArray()
  const dayRe = /_posts\/planAudio\/(\d+)\//
  const byDay = {}
  posts.forEach((post) => {
    const m = (post.source || '').match(dayRe)
    if (m) {
      const day = parseInt(m[1], 10)
      if (!byDay[day]) byDay[day] = []
      byDay[day].push(post)
    }
  })
  Object.keys(byDay).forEach((day) => {
    byDay[day].sort((a, b) => (a.date - b.date))
  })
  const daysWithPosts = Object.keys(byDay).map(Number)
  const days = [...new Set([...sermonDays, ...daysWithPosts])].sort((a, b) => a - b)
  return days.map((day) => ({
    path: `planAudio/${day}/index.html`,
    layout: 'planAudio',
    data: { day, posts: byDay[day] || [] },
  }))
})
