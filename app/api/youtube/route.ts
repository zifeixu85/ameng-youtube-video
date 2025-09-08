import { type NextRequest, NextResponse } from "next/server"

const YOUTUBE_API_KEY = "AIzaSyCId1M9bnEslmW5zSBDkPB3cnBEYjD-PPM"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    // 从YouTube URL中提取视频ID
    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json({ error: "无效的YouTube链接" }, { status: 400 })
    }

    // 获取视频基本信息
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics,contentDetails&key=${YOUTUBE_API_KEY}`,
    )

    if (!videoResponse.ok) {
      throw new Error("YouTube API请求失败")
    }

    const videoData = await videoResponse.json()

    if (!videoData.items || videoData.items.length === 0) {
      return NextResponse.json({ error: "视频不存在或无法访问" }, { status: 404 })
    }

    const video = videoData.items[0]

    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?id=${video.snippet.channelId}&part=statistics,snippet&key=${YOUTUBE_API_KEY}`,
    )

    let subscriberCount = "未知"
    if (channelResponse.ok) {
      const channelData = await channelResponse.json()
      if (channelData.items && channelData.items.length > 0) {
        subscriberCount = formatNumber(channelData.items[0].statistics.subscriberCount || "0")
      }
    }

    const captionsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?videoId=${videoId}&part=snippet&key=${YOUTUBE_API_KEY}`,
    )

    const captionsData = await captionsResponse.json()
    const captionsDetected = captionsData.items && captionsData.items.length > 0

    // 尝试获取字幕内容（注意：YouTube Data API v3需要OAuth认证才能下载字幕）
    let subtitles = ""
    let hasSubtitles = false

    if (captionsDetected) {
      try {
        // 查找自动生成的字幕或第一个可用字幕
        const caption =
          captionsData.items.find(
            (item: any) =>
              item.snippet.language === "zh" || item.snippet.language === "zh-CN" || item.snippet.language === "en",
          ) || captionsData.items[0]

        if (caption) {
          console.log("[v0] 尝试获取字幕，caption ID:", caption.id)

          const captionResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/captions/${caption.id}?key=${YOUTUBE_API_KEY}`,
            {
              headers: {
                Accept: "text/plain",
              },
            },
          )

          console.log("[v0] 字幕请求状态:", captionResponse.status)

          if (captionResponse.ok) {
            subtitles = await captionResponse.text()
            hasSubtitles = subtitles.length > 0
            console.log("[v0] 成功获取字幕，长度:", subtitles.length)
          } else {
            console.log("[v0] 字幕获取失败，状态码:", captionResponse.status)
            hasSubtitles = false
          }
        }
      } catch (captionError) {
        console.log("[v0] 获取字幕内容失败:", captionError)
        hasSubtitles = false
      }
    }

    const videoInfo = {
      title: video.snippet.title,
      channel: video.snippet.channelTitle,
      subscriberCount,
      thumbnail:
        video.snippet.thumbnails.maxres?.url ||
        video.snippet.thumbnails.high?.url ||
        video.snippet.thumbnails.medium?.url,
      duration: formatDuration(video.contentDetails.duration),
      views: formatNumber(video.statistics.viewCount),
      likes: formatNumber(video.statistics.likeCount || "0"),
      hasSubtitles,
      captionsDetected, // 添加一个字段表示检测到字幕轨道
      description: video.snippet.description,
      subtitles,
      videoId, // 添加videoId字段用于第三方字幕API
    }

    return NextResponse.json({ videoInfo })
  } catch (error) {
    console.error("YouTube API错误:", error)
    return NextResponse.json({ error: "获取视频信息失败" }, { status: 500 })
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return "0:00"

  const hours = Number.parseInt(match[1] || "0")
  const minutes = Number.parseInt(match[2] || "0")
  const seconds = Number.parseInt(match[3] || "0")

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function formatNumber(num: string): string {
  const number = Number.parseInt(num)
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M"
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K"
  }
  return number.toLocaleString()
}
