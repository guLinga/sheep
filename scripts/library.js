const loadLibraryBooksFromMd = require('./lib/loadLibraryBooksFromMd')

function isPdfReadUrl(readUrl) {
  if (!readUrl || typeof readUrl !== 'string') return false
  const pathOnly = readUrl.trim().split(/[?#]/)[0].toLowerCase()
  return pathOnly.endsWith('.pdf')
}

hexo.extend.generator.register('library', async function () {
  let books = []
  try {
    books = await loadLibraryBooksFromMd(this)
  } catch (e) {
    this.log.error('[library] 加载失败: %s', e)
  }

  const routes = [
    {
      path: 'library/index.html',
      layout: 'library',
      data: { books, title: '图书馆' },
    },
  ]

  books.forEach((book) => {
    const bookId = book.id
    if (!bookId) return
    const reflections = Array.isArray(book.reflections) ? book.reflections : []

    routes.push({
      path: `library/book/${bookId}/index.html`,
      layout: 'library_book',
      data: {
        title: book.name,
        book,
        bookId,
        introHtml: book.introHtml,
        reflections,
      },
    })

    if (isPdfReadUrl(book.readUrl)) {
      routes.push({
        path: `library/book/${bookId}/read/index.html`,
        layout: 'library_pdf_reader',
        data: {
          title: `${book.name} · 阅读`,
          book,
          bookId,
        },
      })
    }

    reflections.forEach((note) => {
      const noteId = note && note.id
      if (!noteId) return
      routes.push({
        path: `library/book/${bookId}/note/${noteId}/index.html`,
        layout: 'library_note',
        data: {
          title: note.title,
          book,
          bookId,
          note,
          contentHtml: note.contentHtml,
        },
      })
    })
  })

  return routes
})
