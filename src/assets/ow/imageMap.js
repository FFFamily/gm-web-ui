// 使用 import.meta.glob 批量导入所有图片
// 这样 Vite 在构建时会正确处理这些资源
const imageModules = import.meta.glob('./*.jpg', { eager: true })

// 创建图片名称到 URL 的映射
export const imageMap = {}

// 遍历导入的图片模块，创建映射
Object.keys(imageModules).forEach(path => {
  // 从路径中提取文件名（不包含扩展名）
  // 例如: './武器润滑油.jpg' -> '武器润滑油'
  const fileName = path.replace('./', '').replace('.jpg', '')
  imageMap[fileName] = imageModules[path].default || imageModules[path]
})
