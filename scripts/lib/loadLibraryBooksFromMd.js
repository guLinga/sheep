'use strict'

const fs = require('fs')
const path = require('path')
const matter = require('hexo-front-matter').parse

async function renderMd(hexo, text) {
  const t = (text || '').trim()
  if (!t) return ''
  return hexo.render.render({ text: t, engine: 'markdown' })
}

async function loadNote(hexo, filePath, noteId) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const data = matter(raw)
  const body = data._content || ''
  const id = data.id || noteId
  const title = data.title || id
  const author = data.author || ''
  const excerpt = data.excerpt || ''
  const contentHtml = await renderMd(hexo, body)
  return { id, title, author, excerpt, contentHtml }
}

async function loadBookDir(hexo, root, dirName) {
  const bookDir = path.join(root, dirName)
  const indexPath = path.join(bookDir, 'index.md')
  if (!fs.existsSync(indexPath)) return null

  const raw = fs.readFileSync(indexPath, 'utf8')
  const data = matter(raw)
  const body = data._content || ''
  const bookId = dirName
  const cover = data.cover
  if (!cover) {
    hexo.log.warn('[library] 跳过 %s：index.md 缺少 front matter 字段 cover', bookId)
    return null
  }

  const name = data.name || data.title || bookId
  const introHtml = await renderMd(hexo, body)
  const reflections = []
  const entries = fs.readdirSync(bookDir, { withFileTypes: true })
  for (const ent of entries) {
    if (!ent.isFile() || !ent.name.endsWith('.md')) continue
    if (ent.name.toLowerCase() === 'index.md') continue
    if (ent.name.startsWith('_') || ent.name.startsWith('.')) continue
    const base = ent.name.replace(/\.md$/i, '')
    reflections.push(await loadNote(hexo, path.join(bookDir, ent.name), base))
  }
  reflections.sort((a, b) => String(a.id).localeCompare(String(b.id)))

  return {
    id: bookId,
    name,
    cover,
    author: data.author || '',
    listTag: data.listTag || '',
    readUrl: data.readUrl,
    introHtml,
    reflections,
  }
}

/** 从 source/_library/<书籍目录>/index.md 加载书目；同目录其它 .md 为心得（Hexo 会忽略 _ 前缀目录，不会复制到 public） */
module.exports = async function loadLibraryBooksFromMd(hexo) {
  const root = path.join(hexo.source_dir, '_library')
  if (!fs.existsSync(root)) {
    hexo.log.info('[library] 未找到目录 %s', root)
    return []
  }

  const books = []
  const dirs = fs.readdirSync(root, { withFileTypes: true })
  for (const ent of dirs) {
    if (!ent.isDirectory() || ent.name.startsWith('.')) continue
    const b = await loadBookDir(hexo, root, ent.name)
    if (b) books.push(b)
  }
  books.sort((a, b) => a.id.localeCompare(b.id))
  return books
}
