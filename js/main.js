// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const previewArea = document.getElementById('previewArea');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 上传区域点击事件
uploadArea.addEventListener('click', () => {
    imageInput.click();
});

// 拖拽上传
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#0071e3';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ccc';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ccc';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImage(file);
    }
});

// 文件选择处理
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImage(file);
    }
});

// 处理图片文件
function handleImage(file) {
    // 显示原图大小
    originalSize.textContent = formatFileSize(file.size);
    
    // 创建文件预览
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        compressImage(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // 显示预览区域
    previewArea.style.display = 'block';
}

// 压缩图片
function compressImage(dataUrl) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置画布尺寸
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 绘制图片
        ctx.drawImage(img, 0, 0);
        
        // 压缩图片
        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // 显示压缩后的图片
        compressedImage.src = compressedDataUrl;
        
        // 计算压缩后的大小
        const compressedBytes = atob(compressedDataUrl.split(',')[1]).length;
        compressedSize.textContent = formatFileSize(compressedBytes);
        
        // 更新下载按钮
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = 'compressed-image.jpg';
            link.href = compressedDataUrl;
            link.click();
        };
    };
    img.src = dataUrl;
}

// 质量滑块变化事件
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = e.target.value + '%';
    if (originalImage.src) {
        compressImage(originalImage.src);
    }
});

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 