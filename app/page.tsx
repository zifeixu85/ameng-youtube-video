"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, FileText, ArrowRight, BarChart3, Brain, Target, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [url, setUrl] = useState("")
  const router = useRouter()

  const handleAnalyze = () => {
    if (!url.trim()) return
    router.push(`/app?url=${encodeURIComponent(url)}`)
  }

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "AI智能分析",
      description: "使用先进的AI模型深度分析视频内容，提供专业的质量评估和改进建议",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "字幕提取",
      description: "自动提取视频字幕内容，支持多语言字幕的语义分析和内容理解",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "多维度评分",
      description: "从内容清晰度、信息价值、观众吸引力、表达风格等多个维度进行评分",
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "精准建议",
      description: "基于分析结果提供具体可行的改进建议，帮助提升视频质量和效果",
    },
  ]

  const steps = [
    {
      step: "01",
      title: "输入链接",
      description: "粘贴YouTube视频链接到输入框中",
    },
    {
      step: "02",
      title: "AI分析",
      description: "系统自动获取视频信息并进行智能分析",
    },
    {
      step: "03",
      title: "获得报告",
      description: "查看详细的分析报告和改进建议",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="secondary" className="px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                AI驱动的视频分析
              </Badge>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              让AI帮你分析
              <span className="text-primary"> YouTube视频</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              专业的YouTube视频内容分析平台，使用AI技术深度分析视频质量，提供多维度评分和精准改进建议，帮助创作者提升内容效果
            </p>

            {/* CTA Input */}
            <div className="max-w-2xl mx-auto mb-8">
              <Card className="p-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="粘贴YouTube视频链接，例如：https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 border-0 focus-visible:ring-0 text-base"
                  />
                  <Button onClick={handleAnalyze} disabled={!url.trim()} size="lg" className="px-8">
                    开始分析
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
              <p className="text-sm text-muted-foreground mt-3">免费分析 • 无需注册 • 即时获得结果</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">10,000+</div>
                <div className="text-sm text-muted-foreground">视频已分析</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">99%</div>
                <div className="text-sm text-muted-foreground">准确率</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">在线服务</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">强大的分析功能</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              我们的AI分析工具提供全面的视频内容评估，帮助你了解视频的优势和改进空间
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">简单三步，获得专业分析</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              无需复杂操作，只需几分钟即可获得详细的视频分析报告
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border z-0">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  <div className="relative z-10 bg-background">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">准备好提升你的视频质量了吗？</h2>
          <p className="text-lg mb-8 text-pretty max-w-2xl mx-auto opacity-90">
            立即开始使用我们的AI分析工具，获得专业的视频内容评估和改进建议
          </p>
          <Button size="lg" variant="secondary" className="px-8 py-3 text-lg" asChild>
            <Link href="/app">
              <Zap className="h-5 w-5 mr-2" />
              免费开始分析
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
