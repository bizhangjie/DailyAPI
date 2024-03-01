const fs = require('fs');
const path = require('path');

// 指定文件夹路径
const folderPath = '../lsp/txt/';

// 获取文件夹下的所有文件
const files = fs.readdirSync(folderPath);

// 存储所有文件内容的数组
const fileContents = [];

// 读取每个txt文件的内容
files.forEach(file => {
  if (file.endsWith('.txt')) {
    const filePath = path.join(folderPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // 使用文件名前缀替换分隔符中的“中央”
    const prefix = file.split('.')[0];
    const separator = `\n💘${prefix},#genre#\n`;

    fileContents.push(separator + content);
  }
});

// 合并内容
const mergedContent = fileContents.join('');

// 写入合并后的内容到新文件
const outputPath = '../../public/tvbox/slive.txt';
fs.writeFileSync(outputPath, mergedContent);

console.log(`合并完成，结果已保存到文件：${outputPath}`);
