// `as: 'url'` đã bị gỡ khỏi Vite 8. Nếu vẫn dùng, tuỳ chọn bị bỏ qua và mỗi entry
// trả về Module object thay vì chuỗi URL, khiến src của ảnh thành "[object Module]".
// Cách viết thay thế: query '?url' + import 'default' để lấy thẳng chuỗi URL.
const orchidImages = import.meta.glob('../assets/*.{png,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const imageMap = Object.entries(orchidImages).reduce((map, [filePath, url]) => {
  const fileName = filePath.split('/').pop();
  if (fileName) map[fileName] = url;
  return map;
}, {});

export function resolveOrchidImage(imagePath) {
  if (!imagePath) return 'https://via.placeholder.com/600x400?text=No+Image';

  const normalizedPath = imagePath.replace(/^\.{0,2}\/?/, '').replace(/^src\//, '');
  const fileName = normalizedPath.split('/').pop();
  if (fileName && imageMap[fileName]) {
    return imageMap[fileName];
  }

  if (normalizedPath.startsWith('assets/')) {
    return `/${normalizedPath}`;
  }

  return imagePath;
}
