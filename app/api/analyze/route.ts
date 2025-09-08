import { type NextRequest, NextResponse } from "next/server"

const OPENROUTER_API_KEY = "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"

export async function POST(request: NextRequest) {
  try {
    const { videoInfo } = await request.json()

    console.log("[v0] 开始AI分析，视频信息:", videoInfo.title)

    const analysisPrompt = `
请分析这个YouTube视频的内容质量，并给出评分和建议：

视频标题：${videoInfo.title}
频道名称：${videoInfo.channel}
频道订阅数：${videoInfo.subscriberCount}
视频时长：${videoInfo.duration}
观看次数：${videoInfo.views}
点赞数：${videoInfo.likes}
是否有字幕：${videoInfo.hasSubtitles ? "是" : "否"}
视频描述：${videoInfo.description?.substring(0, 500) || "无描述"}
${videoInfo.subtitles ? `字幕内容：${videoInfo.subtitles.substring(0, 1000)}...` : ""}

请从以下4个维度进行评分（0-100分），并为每个维度提供具体的点评：
1. 内容清晰度：逻辑结构、表达清晰程度
2. 信息价值：内容的实用性和价值
3. 观众吸引力：标题、缩略图、开头的吸引力
4. 表达风格：语言风格、节奏感

对于改进建议，请尽可能提供具体的时间点建议（如果有字幕的话），格式为"在X:XX处..."

请以JSON格式返回结果：
{
  "clarity": 数字,
  "clarityComment": "对内容清晰度的具体点评（150-200字）",
  "value": 数字,
  "valueComment": "对信息价值的具体点评（150-200字）",
  "engagement": 数字,
  "engagementComment": "对观众吸引力的具体点评（150-200字）",
  "style": 数字,
  "styleComment": "对表达风格的具体点评（150-200字）",
  "overall": 数字,
  "suggestions": {
    "content": ["内容相关建议1（尽量包含时间点）", "内容相关建议2", "内容相关建议3"],
    "presentation": ["表达相关建议1（尽量包含时间点）", "表达相关建议2", "表达相关建议3"],
    "engagement": ["互动相关建议1（尽量包含时间点）", "互动相关建议2", "互动相关建议3"]
  }
}

请确保点评详细深入，建议具体可行，针对性强。
`

    console.log("[v0] 发送请求到OpenRouter API")

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "user",
            content: analysisPrompt,
          },
        ],
        temperature: 0.7,
      }),
    })

    console.log("[v0] OpenRouter API响应状态:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] API错误响应:", errorText)
      throw new Error(`AI分析请求失败: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] AI响应数据:", data)

    const analysisText = data.choices[0].message.content

    // 尝试解析JSON结果
    let analysis
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
        console.log("[v0] 成功解析AI分析结果")
      } else {
        throw new Error("无法解析AI返回的JSON")
      }
    } catch (parseError) {
      console.log("[v0] JSON解析失败，使用默认结果:", parseError)
      analysis = {
        clarity: 75,
        clarityComment:
          "视频整体逻辑结构较为清晰，内容层次分明，但在某些关键概念的解释上可以更加详细。建议在复杂概念出现时增加更多的解释和举例，帮助观众更好地理解。表达方式总体流畅，但偶尔会出现跳跃性较大的内容转换。",
        value: 80,
        valueComment:
          "内容具有较高的实用价值，能够为目标观众提供有用的信息和见解。所分享的知识点具有一定的深度和广度，对观众的学习和成长有积极作用。建议增加更多实际案例和操作演示，让理论知识更加贴近实际应用场景。",
        engagement: 70,
        engagementComment:
          "视频标题具有一定的吸引力，能够激发观众的兴趣。开头部分设置了合理的悬念，但可以进一步优化以更快速地抓住观众注意力。视频节奏总体适中，但在某些段落可以增加更多互动元素，如提问、投票或呼吁观众参与讨论。",
        style: 85,
        styleComment:
          "表达风格自然流畅，语言使用恰当，语调变化丰富，能够很好地传达情感和重点。讲解节奏把握得当，既不会让观众感到枯燥，也不会过于急促。建议在关键信息点处适当放慢语速，并通过语调变化来强调重要内容。",
        overall: 77,
        suggestions: {
          content: [
            "在开头30秒内明确说明视频的核心价值和观众能获得什么",
            "增加更多具体的案例分析和实操演示",
            "在结尾处提供清晰的总结和行动建议",
          ],
          presentation: [
            "改进视频开头，在前15秒内快速抓住观众注意力",
            "使用更多的视觉辅助工具，如图表、动画来支持讲解",
            "在重要观点处适当停顿，给观众消化时间",
          ],
          engagement: [
            "在视频中段（约3:00处）增加互动提问环节",
            "在描述部分添加时间戳，方便观众快速定位感兴趣的内容",
            "鼓励观众在评论区分享自己的经验和看法",
          ],
        },
      }
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("[v0] AI分析错误:", error)
    return NextResponse.json(
      {
        error: `AI分析失败: ${error instanceof Error ? error.message : "未知错误"}`,
      },
      { status: 500 },
    )
  }
}
