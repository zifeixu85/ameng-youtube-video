import Link from "next/link"
import { Play, Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Play className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-foreground">YouTube 分析工具</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              专业的YouTube视频内容分析平台，帮助创作者提升视频质量和观众参与度。
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">产品功能</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/app" className="hover:text-foreground transition-colors">
                  视频分析
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  字幕提取
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  AI评分
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  改进建议
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">资源</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#about" className="hover:text-foreground transition-colors">
                  使用指南
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-foreground transition-colors">
                  API文档
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-foreground transition-colors">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-foreground transition-colors">
                  更新日志
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">联系我们</h3>
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Github className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Twitter className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="mailto:contact@example.com"
                className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">有问题或建议？随时联系我们</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2025 YouTube 分析工具. 保留所有权利.</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link href="#privacy" className="hover:text-foreground transition-colors">
                隐私政策
              </Link>
              <Link href="#terms" className="hover:text-foreground transition-colors">
                服务条款
              </Link>
              <Link href="#cookies" className="hover:text-foreground transition-colors">
                Cookie政策
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
