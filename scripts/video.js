/**
 * Enhanced Video Tag Plugin for Hexo
 *
 * Syntax:
 * {% video src [poster] [width] [height] [autoplay] %}
 *
 * Examples:
 * {% video /path/to/video.mp4 %}
 * {% video /path/to/video.mp4 /path/to/poster.jpg %}
 * {% video /path/to/video.mp4 /path/to/poster.jpg 800px 450px %}
 * {% video /path/to/video.mp4 /path/to/poster.jpg 800px 450px true %}
 */

'use strict'

hexo.extend.tag.register(
  'video',
  function (args) {
    const src = args[0] || ''
    const poster = args[1] || ''
    const width = args[2] || '100%'
    const height = args[3] || '480px'
    const autoplay = args[4] === 'true' || false

    // 检查视频链接是否有效
    if (!src || src.trim() === '') {
      hexo.log.warn('Video tag error: Missing video source URL')
      return '<div class="video-error">视频源无效</div>'
    }

    // 生成唯一ID，使用时间戳和随机数组合确保唯一性
    const videoId = 'video-' + Date.now() + '-' + Math.floor(Math.random() * 1000000)

    // 构建HTML - 使用原生HTML5 video标签而非videojs
    let result = `
    <div class="video-container">
      <video
        id="${videoId}"
        class="html5-video"
        controls
        preload="metadata"
        width="${width}"
        height="${height}"
        poster="${poster}"
        ${autoplay ? 'autoplay muted' : ''}
      >
        <source src="${src}" type="video/mp4">
        <p>您的浏览器不支持HTML5视频播放，请考虑升级您的浏览器</p>
      </video>
    </div>
    <style>
      .video-container {
        margin: 20px 0;
        position: relative;
        width: 100%;
        overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .html5-video {
        min-height: 300px;
        width: 100%;
        height: auto;
        aspect-ratio: 16 / 9;
        background-color: #000;
        display: block;
      }

      /* 移动端优化 */
      @media (max-width: 768px) {
        .html5-video {
          min-height: 240px;
        }
      }

      /* 小屏幕设备优化 */
      @media (max-width: 480px) {
        .html5-video {
          min-height: 200px;
        }
      }

      .video-error {
        padding: 20px;
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        text-align: center;
        margin: 20px 0;
      }
    </style>
  `

    return result
  },
  { ends: false }
)