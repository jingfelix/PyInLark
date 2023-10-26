# PyInLark: 在飞书多维表格中运行 Python 代码 🐍

PyInLark 是一个飞书多维表格插件，仅需在插件中编写 Python 代码，即可在多维表格中使用自定义的函数。


https://github.com/jingfelix/PyInLark/assets/72600955/eb79157e-6e00-4b77-ac69-23ceda4aa1be


## 安装

在飞书多维表格插件中选择新增插件，填写多维表格插件的 URL。

在需要使用函数的单元格中，输入 `=Py(函数(参数))`，在插件文本框中填写自定义函数，点击按钮运行。

计算结果将会显示在单元格中。

> **Note**  
可能的报错：当前单元格不是Py函数。请注意对单元格的修改是否进行了保存。

## 运行

```bash
npm install

npm install vite

npm run dev
```
