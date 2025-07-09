# Introduce

This project is a website frontend

## Website Template Reference: [🚀 View Free Demo](https://startup.nextjstemplates.com/) && [Github](https://github.com/NextJSTemplates/startup-nextjs)

## Prerequisites

### 1. Github Fork The Project

### 2. Install Project

```shell  
# download pnpm
npm install pnpm

# check version
pnpm -v

# download depndencise
pnpm install

```

### 3. Run NextJS  

```shell
# Run Project
pnpm run dev

```

### 4. Package Project

```shell
# Package Next Project
pnpm run build
    
```

### 5. The Project Use semantic-release

1.0.0 => major.minor.patch

支援以下提交類型

| 提交類型 | 描述 | 版本更新 |
|---------|------|---------|
| feat    | 新功能 | minor   |
| fix     | 修復錯誤 | patch  |
| docs    | 文檔更新 | patch  |
| refactor| 代碼重構 | patch  |
| perf    | 性能優化 | patch  |
| test    | 添加或修改測試 | patch |
| build   | 影響構建系統或外部依賴的更改 | patch |
| ci      | CI配置或腳本更改 | patch |
| chore   | 其他不修改src或測試文件的更改 | patch |
| style   | 不影響代碼含義的更改(空格、格式等) | patch |
| revert  | 撤銷之前的提交 | patch |
| feat!   | 包含破壞性變更的新功能 | major |
| fix!    | 包含破壞性變更的錯誤修復 | major |
| 任何類型 + BREAKING CHANGE: | 在提交訊息頁腳中標記的破壞性變更 | major |  

#### 提交訊息格式範例

```txt

feat: xxx

fix: xxx

docs: xxx

```

#### 破壞性變更範例

```txt
feat!: 新增不向後兼容的API

BREAKING CHANGE: 舊版API將不再支援

```
