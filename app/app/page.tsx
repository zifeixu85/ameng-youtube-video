"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Play,
  Clock,
  Eye,
  Users,
  MessageSquare,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  UserCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Sparkles,
  Download,
  CheckCircle,
  History,
} from "lucide-react"
import Image from "next/image"

interface VideoInfo {
  title: string
  channel: string
  subscriberCount: string
  thumbnail: string
  duration: string
  views: string
  likes: string
  hasSubtitles: boolean
  captionsDetected?: boolean
  description?: string
  subtitles?: string
  videoId?: string
}

interface AnalysisResult {
  clarity: number
  clarityComment: string
  value: number
  valueComment: string
  engagement: number
  engagementComment: string
  style: number
  styleComment: string
  overall: number
  suggestions: {
    content: string[]
    presentation: string[]
    engagement: string[]
  }
}

interface AnalysisHistory {
  id: string
  url: string
  videoInfo: VideoInfo
  analysis: AnalysisResult
  timestamp: number
}

export default function AppPage() {
  const searchParams = useSearchParams()
  const initialUrl = searchParams.get("url") || ""

  const [url, setUrl] = useState(initialUrl)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingSubtitles, setIsLoadingSubtitles] = useState(false)
  const [subtitlesError, setSubtitlesError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [history, setHistory] = useState<AnalysisHistory[]>([])
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)

  const [expandedSections, setExpandedSections] = useState({
    clarity: true,
    value: false,
    engagement: false,
    style: false,
    subtitles: false,
    suggestions: {
      content: true,
      presentation: false,
      engagement: false,
    },
  })

  useEffect(() => {
    const savedHistory = localStorage.getItem("youtube-analysis-history")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        const validHistory = parsedHistory.filter(
          (record: any) =>
            record && record.id && record.videoInfo && record.analysis && typeof record.timestamp === "number",
        )
        setHistory(validHistory)

        if (validHistory.length !== parsedHistory.length) {
          localStorage.setItem("youtube-analysis-history", JSON.stringify(validHistory))
        }
      } catch (error) {
        console.error("Failed to parse history:", error)
        localStorage.removeItem("youtube-analysis-history")
      }
    }

    if (initialUrl && initialUrl.trim() && !isAnalyzing) {
      console.log("[v0] Auto-analyzing URL from search params:", initialUrl)
      handleAnalyze()
    }
  }, [])

  const saveToHistory = (videoInfo: VideoInfo, analysis: AnalysisResult, url: string) => {
    const newRecord: AnalysisHistory = {
      id: Date.now().toString(),
      url,
      videoInfo,
      analysis,
      timestamp: Date.now(),
    }

    const updatedHistory = [newRecord, ...history.slice(0, 9)]
    setHistory(updatedHistory)
    setSelectedHistoryId(newRecord.id)

    try {
      localStorage.setItem("youtube-analysis-history", JSON.stringify(updatedHistory))
      console.log("[v0] History saved successfully, total records:", updatedHistory.length)
    } catch (error) {
      console.error("[v0] Failed to save history to localStorage:", error)
      try {
        const reducedHistory = updatedHistory.slice(0, 5)
        localStorage.setItem("youtube-analysis-history", JSON.stringify(reducedHistory))
        setHistory(reducedHistory)
        console.log("[v0] History saved with reduced size:", reducedHistory.length)
      } catch (retryError) {
        console.error("[v0] Failed to save reduced history:", retryError)
      }
    }
  }

  const loadFromHistory = (record: AnalysisHistory) => {
    setVideoInfo(record.videoInfo)
    setAnalysis(record.analysis)
    setUrl(record.url)
    setSelectedHistoryId(record.id)
    setError(null)
  }

  const deleteHistoryRecord = (id: string) => {
    const updatedHistory = history.filter((record) => record.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem("youtube-analysis-history", JSON.stringify(updatedHistory))

    if (selectedHistoryId === id) {
      setSelectedHistoryId(null)
      setVideoInfo(null)
      setAnalysis(null)
    }
  }

  const loadingSteps = [
    { message: "解析视频链接", icon: "🔍", description: "正在验证YouTube链接格式" },
    { message: "获取视频基本信息", icon: "📊", description: "获取标题、时长、播放量等数据" },
    { message: "检测字幕可用性", icon: "📝", description: "检查视频是否包含字幕内容" },
    { message: "提取字幕内容", icon: "🎯", description: "下载并处理字幕文本" },
    { message: "AI深度分析", icon: "🤖", description: "使用AI模型分析内容质量" },
    { message: "生成改进建议", icon: "✨", description: "基于分析结果生成专业建议" },
  ]

  const handleAnalyze = async () => {
    if (!url.trim()) return

    console.log("[v0] Starting analysis for URL:", url)
    setIsAnalyzing(true)
    setError(null)
    setVideoInfo(null)
    setAnalysis(null)
    setSelectedHistoryId(null)
    setCurrentStep(0)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 1500)

    try {
      setCurrentStep(0)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setCurrentStep(1)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCurrentStep(2)

      const videoResponse = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!videoResponse.ok) {
        const errorData = await videoResponse.json()
        throw new Error(errorData.error || "获取视频信息失败")
      }

      const { videoInfo: fetchedVideoInfo } = await videoResponse.json()
      setVideoInfo(fetchedVideoInfo)

      setCurrentStep(3)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setCurrentStep(4)

      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoInfo: fetchedVideoInfo }),
      })

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json()
        throw new Error(errorData.error || "AI分析失败")
      }

      const { analysis: analysisResult } = await analysisResponse.json()
      setCurrentStep(5)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setAnalysis(analysisResult)

      saveToHistory(fetchedVideoInfo, analysisResult, url)
    } catch (err) {
      console.error("分析错误:", err)
      setError(err instanceof Error ? err.message : "分析过程中发生错误")
    } finally {
      clearInterval(stepInterval)
      setIsAnalyzing(false)
    }
  }

  const fetchSubtitles = async () => {
    if (!videoInfo?.videoId) return

    setIsLoadingSubtitles(true)
    setSubtitlesError(null)

    try {
      const response = await fetch("/api/subtitles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId: videoInfo.videoId }),
      })

      const data = await response.json()

      if (data.success) {
        setVideoInfo((prev) =>
          prev
            ? {
                ...prev,
                subtitles: data.subtitles,
                hasSubtitles: true,
              }
            : null,
        )
      } else {
        setSubtitlesError(data.error || "获取字幕失败")
      }
    } catch (error) {
      console.error("获取字幕错误:", error)
      setSubtitlesError("网络错误，请稍后重试")
    } finally {
      setIsLoadingSubtitles(false)
    }
  }

  const downloadSubtitles = () => {
    if (!videoInfo?.subtitles) return

    const blob = new Blob([videoInfo.subtitles], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${videoInfo.title.replace(/[^\w\s]/gi, "")}_subtitles.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }))
  }

  const toggleSuggestionSection = (section: keyof typeof expandedSections.suggestions) => {
    setExpandedSections((prev) => ({
      ...prev,
      suggestions: {
        ...prev.suggestions,
        [section]: !prev.suggestions[section],
      },
    }))
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    if (score >= 55) return "text-yellow-600"
    return "text-red-600"
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  分析历史
                </CardTitle>
                <CardDescription>最近分析的视频记录</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {history.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">暂无分析记录</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {history.map((record) => (
                        <div
                          key={record.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedHistoryId === record.id ? "bg-primary/10 border-primary" : "bg-card"
                          }`}
                          onClick={() => loadFromHistory(record)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="aspect-video w-16 rounded overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={record.videoInfo.thumbnail || "/placeholder.svg"}
                                alt={record.videoInfo.title}
                                width={64}
                                height={36}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium line-clamp-2 mb-1">{record.videoInfo.title}</h4>
                              <p className="text-xs text-muted-foreground mb-1">{record.videoInfo.channel}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{formatDate(record.timestamp)}</span>
                                <span className={`text-xs font-medium ${getScoreColor(record.analysis.overall)}`}>
                                  {record.analysis.overall}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  视频链接输入
                </CardTitle>
                <CardDescription>请粘贴YouTube视频链接，我们将为您分析视频内容质量</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAnalyze} disabled={isAnalyzing || !url.trim()} className="px-8">
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        分析中...
                      </div>
                    ) : (
                      "开始分析"
                    )}
                  </Button>
                </div>

                {isAnalyzing && (
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Sparkles className="h-6 w-6 text-blue-500 animate-pulse" />
                          <div className="absolute inset-0 animate-ping">
                            <Sparkles className="h-6 w-6 text-blue-300 opacity-75" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-blue-700 font-medium">
                            {loadingSteps[currentStep]?.icon} {loadingSteps[currentStep]?.message}
                          </p>
                          <p className="text-blue-600 text-sm">{loadingSteps[currentStep]?.description}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-blue-600">
                          <span>
                            步骤 {currentStep + 1} / {loadingSteps.length}
                          </span>
                          <span>{Math.round(((currentStep + 1) / loadingSteps.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${((currentStep + 1) / loadingSteps.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {loadingSteps.map((step, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-2 p-2 rounded ${
                              index < currentStep
                                ? "bg-green-100 text-green-700"
                                : index === currentStep
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {index < currentStep ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : index === currentStep ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <div className="h-3 w-3 rounded-full border border-current opacity-50" />
                            )}
                            <span>
                              {step.icon} {step.message}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            {videoInfo && analysis && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Video Info */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Video Info Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>视频信息</span>
                        <Badge
                          variant={
                            videoInfo.hasSubtitles ? "default" : videoInfo.captionsDetected ? "secondary" : "outline"
                          }
                        >
                          {videoInfo.hasSubtitles ? "有字幕" : videoInfo.captionsDetected ? "字幕受限" : "无字幕"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={videoInfo.thumbnail || "/placeholder.svg"}
                          alt={videoInfo.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-balance">{videoInfo.title}</h3>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">频道：{videoInfo.channel}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <UserCheck className="h-4 w-4" />
                            <span>{videoInfo.subscriberCount} 订阅者</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{videoInfo.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{videoInfo.views}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{videoInfo.likes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{videoInfo.hasSubtitles ? "语义分析" : "通用分析"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Overall Score Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">综合评分</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-6 bg-muted/30 rounded-lg">
                        <div className="text-4xl font-bold mb-2">
                          <span className={getScoreColor(analysis.overall)}>{analysis.overall}</span>
                          <span className="text-muted-foreground text-xl">/100</span>
                        </div>
                        <p className="text-muted-foreground">基于多维度综合评估</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subtitles Card */}
                  <Card>
                    <CardHeader>
                      <Collapsible open={expandedSections.subtitles} onOpenChange={() => toggleSection("subtitles")}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            字幕内容
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {videoInfo.subtitles && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  downloadSubtitles()
                                }}
                                className="h-8 px-3"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                下载
                              </Button>
                            )}
                            {expandedSections.subtitles ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-4">
                            {videoInfo.subtitles ? (
                              <div className="max-h-64 overflow-y-auto bg-muted/30 p-3 rounded-lg">
                                <pre className="text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
                                  {videoInfo.subtitles}
                                </pre>
                              </div>
                            ) : (
                              <div className="text-center p-6 bg-muted/30 rounded-lg">
                                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                {isLoadingSubtitles ? (
                                  <div className="space-y-2">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                    <p className="text-muted-foreground text-sm">正在获取字幕内容...</p>
                                  </div>
                                ) : subtitlesError ? (
                                  <div className="space-y-2">
                                    <p className="text-red-600 text-sm">{subtitlesError}</p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={fetchSubtitles}
                                      className="mt-2 bg-transparent"
                                    >
                                      重试获取
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <p className="text-muted-foreground text-sm">点击下方按钮获取字幕内容</p>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={fetchSubtitles}
                                      className="bg-primary hover:bg-primary/90"
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      获取字幕
                                    </Button>
                                    <p className="text-muted-foreground text-xs">
                                      使用第三方服务获取字幕，支持大部分YouTube视频
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardHeader>
                  </Card>
                </div>

                {/* Right Column - Analysis Results */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Detailed Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        详细分析结果
                      </CardTitle>
                      <CardDescription>基于多个维度的专业评估和点评</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-6">
                        <Collapsible open={expandedSections.clarity} onOpenChange={() => toggleSection("clarity")}>
                          <div className="space-y-3">
                            <CollapsibleTrigger className="flex justify-between items-center w-full group">
                              <span className="font-medium">内容清晰度</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold ${getScoreColor(analysis.clarity)}`}>
                                  {analysis.clarity}/100
                                </span>
                                {expandedSections.clarity ? (
                                  <ChevronUp className="h-4 w-4 group-hover:text-primary" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 group-hover:text-primary" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            <Progress value={analysis.clarity} className="h-2" />
                            <CollapsibleContent>
                              <p className="text-sm text-muted-foreground leading-relaxed">{analysis.clarityComment}</p>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>

                        <Separator />

                        <Collapsible open={expandedSections.value} onOpenChange={() => toggleSection("value")}>
                          <div className="space-y-3">
                            <CollapsibleTrigger className="flex justify-between items-center w-full group">
                              <span className="font-medium">信息价值</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold ${getScoreColor(analysis.value)}`}>
                                  {analysis.value}/100
                                </span>
                                {expandedSections.value ? (
                                  <ChevronUp className="h-4 w-4 group-hover:text-primary" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 group-hover:text-primary" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            <Progress value={analysis.value} className="h-2" />
                            <CollapsibleContent>
                              <p className="text-sm text-muted-foreground leading-relaxed">{analysis.valueComment}</p>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>

                        <Separator />

                        <Collapsible
                          open={expandedSections.engagement}
                          onOpenChange={() => toggleSection("engagement")}
                        >
                          <div className="space-y-3">
                            <CollapsibleTrigger className="flex justify-between items-center w-full group">
                              <span className="font-medium">观众吸引力</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold ${getScoreColor(analysis.engagement)}`}>
                                  {analysis.engagement}/100
                                </span>
                                {expandedSections.engagement ? (
                                  <ChevronUp className="h-4 w-4 group-hover:text-primary" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 group-hover:text-primary" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            <Progress value={analysis.engagement} className="h-2" />
                            <CollapsibleContent>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {analysis.engagementComment}
                              </p>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>

                        <Separator />

                        <Collapsible open={expandedSections.style} onOpenChange={() => toggleSection("style")}>
                          <div className="space-y-3">
                            <CollapsibleTrigger className="flex justify-between items-center w-full group">
                              <span className="font-medium">表达风格</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold ${getScoreColor(analysis.style)}`}>
                                  {analysis.style}/100
                                </span>
                                {expandedSections.style ? (
                                  <ChevronUp className="h-4 w-4 group-hover:text-primary" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 group-hover:text-primary" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            <Progress value={analysis.style} className="h-2" />
                            <CollapsibleContent>
                              <p className="text-sm text-muted-foreground leading-relaxed">{analysis.styleComment}</p>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Suggestions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-accent" />
                        改进建议
                      </CardTitle>
                      <CardDescription>基于分析结果提供的分类优化建议</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <Collapsible
                          open={expandedSections.suggestions.content}
                          onOpenChange={() => toggleSuggestionSection("content")}
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full group">
                            <h4 className="font-semibold text-primary">📝 内容优化</h4>
                            {expandedSections.suggestions.content ? (
                              <ChevronUp className="h-4 w-4 group-hover:text-primary" />
                            ) : (
                              <ChevronDown className="h-4 w-4 group-hover:text-primary" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="space-y-3 mt-3">
                              {analysis.suggestions.content.map((suggestion, index) => (
                                <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                                  <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                  <p className="text-sm leading-relaxed">{suggestion}</p>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>

                        <Collapsible
                          open={expandedSections.suggestions.presentation}
                          onOpenChange={() => toggleSuggestionSection("presentation")}
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full group">
                            <h4 className="font-semibold text-primary">🎭 表达呈现</h4>
                            {expandedSections.suggestions.presentation ? (
                              <ChevronUp className="h-4 w-4 group-hover:text-primary" />
                            ) : (
                              <ChevronDown className="h-4 w-4 group-hover:text-primary" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="space-y-3 mt-3">
                              {analysis.suggestions.presentation.map((suggestion, index) => (
                                <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                                  <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                  <p className="text-sm leading-relaxed">{suggestion}</p>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>

                        <Collapsible
                          open={expandedSections.suggestions.engagement}
                          onOpenChange={() => toggleSuggestionSection("engagement")}
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full group">
                            <h4 className="font-semibold text-primary">🚀 互动提升</h4>
                            {expandedSections.suggestions.engagement ? (
                              <ChevronUp className="h-4 w-4 group-hover:text-primary" />
                            ) : (
                              <ChevronDown className="h-4 w-4 group-hover:text-primary" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="space-y-3 mt-3">
                              {analysis.suggestions.engagement.map((suggestion, index) => (
                                <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                                  <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                  <p className="text-sm leading-relaxed">{suggestion}</p>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
