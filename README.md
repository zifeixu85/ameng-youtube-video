# YouTube 视频分析工具

一个基于 AI 的 YouTube 视频内容分析工具，能够智能分析视频内容并提供专业的改进建议。

## 📖 相关文章

本项目是文章《AI工具站拆解系列05：零基础复刻月访问 360 万的 Youtube 视频分析工具》的完整实现案例。

**📝 阅读原文：** https://ameng.blog/blog/ai-05-youtube-video-analysis

## 🚀 在线体验

**🔗 项目地址：** https://ameng-youtube-video.vercel.app

## ✨ 功能特性

- 📊 **智能视频分析** - 基于 AI 对 YouTube 视频进行多维度分析
- 🎯 **专业评分系统** - 从内容清晰度、信息价值、观众吸引力、表达风格四个维度评分
- 💡 **个性化建议** - 提供具体可执行的改进建议
- 📝 **字幕提取** - 支持视频字幕的提取和下载
- 📚 **分析历史** - 本地缓存分析记录，方便回顾
- 🎨 **现代化界面** - 简洁美观的用户界面设计

## 🛠️ 技术栈

- **前端框架**: Next.js 14
- **样式方案**: Tailwind CSS
- **UI 组件**: Radix UI
- **开发工具**: TypeScript
- **AI 服务**: OpenRouter (Google Gemini)
- **视频数据**: YouTube Data API v3
- **字幕服务**: RapidAPI YouTube Transcript

## 📦 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn 或 pnpm

### 1. 克隆项目

```bash
git clone https://github.com/zifeixu85/ameng-youtube-video.git
cd ameng-youtube-video
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 环境变量配置

复制环境变量模板文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 API 密钥：

```env
# YouTube API Key
# 获取方式：访问 https://console.developers.google.com/ 创建项目并启用YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key_here

# RapidAPI Key  
# 获取方式：访问 https://rapidapi.com/ 注册并订阅YouTube Transcript API
RAPIDAPI_KEY=your_rapidapi_key_here

# OpenRouter API Key
# 获取方式：访问 https://openrouter.ai/ 注册并获取API密钥，用于AI分析功能
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🔑 API 密钥获取指南

### YouTube Data API v3

1. 访问 [Google Cloud Console](https://console.developers.google.com/)
2. 创建新项目或选择现有项目
3. 启用 YouTube Data API v3
4. 创建凭据 → API 密钥
5. 将密钥填入 `YOUTUBE_API_KEY`

### RapidAPI (字幕服务)

1. 访问 [RapidAPI](https://rapidapi.com/)
2. 注册账号并登录
3. 搜索 "YouTube Transcript" API
4. 订阅服务（通常有免费额度）
5. 将密钥填入 `RAPIDAPI_KEY`

### OpenRouter (AI 分析)

1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册账号并登录
3. 获取 API 密钥
4. 将密钥填入 `OPENROUTER_API_KEY`

## 🚀 部署

### Vercel 部署（推荐）

1. Fork 本仓库到你的 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 导入你的 GitHub 仓库
4. 配置环境变量
5. 部署完成

### 其他平台

项目基于 Next.js 构建，支持部署到任何支持 Node.js 的平台：

- Netlify
- Railway  
- Render
- 自托管服务器

## 📱 使用方法

1. **输入视频链接** - 在首页输入框中粘贴 YouTube 视频链接
2. **等待分析** - 系统自动获取视频信息并进行 AI 分析
3. **查看结果** - 获得多维度评分和专业改进建议
4. **查看字幕** - 点击查看字幕按钮获取视频字幕内容
5. **历史记录** - 在左侧面板查看之前的分析记录

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证。

## 📞 联系作者

**微信公众号：A梦进化论**

<img src="https://ameng-image-upload.oss-cn-shanghai.aliyuncs.com/img/qrcode_for_gh_d4934fa7c031_258.jpg" width="200" alt="A梦进化论公众号二维码">

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
