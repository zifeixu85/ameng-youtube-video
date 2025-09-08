import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json()

    if (!videoId) {
      return NextResponse.json({ error: "视频ID不能为空" }, { status: 400 })
    }

    console.log("[v0] 开始获取字幕，视频ID:", videoId)

    const response = await fetch(`https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=${videoId}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "youtube-transcript3.p.rapidapi.com",
        "x-rapidapi-key": "7f55334bfemshe9b2046b1397113p1e5b64jsnf3d42cbc3399",
      },
    })

    if (!response.ok) {
      console.log("[v0] 字幕API请求失败:", response.status, response.statusText)
      throw new Error(`字幕API请求失败: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] 字幕API响应:", data)

    if (!data.success || !data.transcript) {
      return NextResponse.json(
        {
          success: false,
          error: "该视频没有可用的字幕",
        },
        { status: 404 },
      )
    }

    // 格式化字幕内容
    const formattedSubtitles = data.transcript
      .map((item: any) => {
        const minutes = Math.floor(item.offset / 60)
        const seconds = Math.floor(item.offset % 60)
        const timestamp = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        return `[${timestamp}] ${item.text}`
      })
      .join("\n")

    return NextResponse.json({
      success: true,
      subtitles: formattedSubtitles,
      transcript: data.transcript,
    })
  } catch (error) {
    console.error("[v0] 获取字幕失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "获取字幕失败",
      },
      { status: 500 },
    )
  }
}
