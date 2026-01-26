#!/bin/bash

# 部署脚本 - 自动打包并使用 scp 上传文件
# 使用方法: ./deploy.sh user@server.com:/path/to/target

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 打印带颜色的消息
log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查参数
if [ -z "$1" ]; then
    log_error "请指定目标目录"
    echo ""
    echo "使用方法:"
    echo "  ./deploy.sh user@server.com:/path/to/target"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh root@192.168.1.100:/var/www/html"
    echo "  ./deploy.sh user@example.com:/usr/local/nginx/html"
    exit 1
fi

TARGET_DIR="$1"
BUILD_DIR="dist"

log_info "🚀 开始部署流程..."
echo ""

# 步骤 1: 构建项目
log_info "步骤 1: 构建项目..."
if npm run build; then
    log_success "构建完成！"
else
    log_error "构建失败！"
    exit 1
fi

echo ""

# 步骤 2: 检查构建输出
if [ ! -d "$BUILD_DIR" ]; then
    log_error "构建输出目录不存在: $BUILD_DIR"
    exit 1
fi

# 步骤 3: 使用 scp 上传文件
log_info "步骤 2: 使用 scp 上传文件到 $TARGET_DIR"
echo ""

if scp -r "$BUILD_DIR"/* "$TARGET_DIR/"; then
    log_success "文件已成功上传到 $TARGET_DIR"
else
    log_error "scp 上传失败！"
    exit 1
fi

echo ""
log_success "✨ 部署完成！"
