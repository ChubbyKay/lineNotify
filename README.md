# Line Notify 爬蟲專案 
使用 Node.js、axios、cheerio 打造的 Line Notify，每小時會回傳 PTT soft-job 版，推文數超過 10 的文章。

## 實際運作示意圖
![image](https://github.com/ChubbyKay/lineNotify/blob/main/line%20Notify%20%E7%A4%BA%E6%84%8F%E5%9C%96.png)

## 安裝方式 
1. 開啟終端機，進入至欲儲存此專案的資料夾，並clone此專案
`git clone https://github.com/ChubbyKay/lineNotify.git`

2. 切換至專案資料夾
`cd notifyBot`

3. 安裝套件
`npm install`

4. 啟動專案
`npm run dev`

## 開發環境
・ Node.js v12.18.2<br>
・ Express v4.17.1<br>
・ Express-Handlebars v5.2.0<br>
・ axios v0.21.0<br>
・ cheerio v1.0.0-rc.3<br>
・ dotenv v8.2.0<br>
・ form-data v3.0.0<br>
