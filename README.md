# Blog

Next.js + Markdownファイル + MySQL(いいね機能のみ) + Dockerで構築したブログアプリケーション

## 機能

- ブログ記事の一覧表示
- 記事の詳細表示
- いいね機能（MySQLに保存）
- 記事はMarkdownファイルで管理

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **記事ストレージ**: Markdownファイル (gray-matter)
- **データベース**: MySQL 8.0 (いいね機能のみ)
- **インフラ**: Docker, Docker Compose

## セットアップ

### 前提条件

- Docker Desktop がインストールされていること

### 起動方法

1. Dockerコンテナを起動

```bash
docker-compose up --build
```

2. ブラウザで開く

```
http://localhost:3000
```

MySQLは自動的に初期データが投入されます。

### 開発モード（ローカル）

```bash
# 依存関係のインストール
npm install

# MySQLのみDockerで起動
docker-compose up mysql -d

# 開発サーバー起動
npm run dev
```

## データベース構造

### posts ディレクトリ
記事はMarkdownファイルとして`posts/`ディレクトリに保存されます。

ファイル形式:
```markdown
---
id: 1
title: 記事タイトル
created_at: 2026-02-08T00:00:00.000Z
updated_at: 2026-02-08T00:00:00.000Z
---

記事本文をここに書きます。
```

### likes テーブル
- id: INT (PRIMARY KEY)
- post_id: INT
- user_id: VARCHAR(255)
- created_at: TIMESTAMP
- UNIQUE制約: (post_id, user_id)

## API エンドポイント

### 記事関連
- `GET /api/posts` - 記事一覧取得（いいね数含む）
- `GET /api/posts/[id]` - 記事詳細取得
- `POST /api/posts` - 記事作成

### いいね関連
- `POST /api/likes` - いいね追加
- `DELETE /api/likes` - いいね削除

## 環境変数

`.env.local`ファイルで以下を設定：

```
DATABASE_URL=mysql://bloguser:blogpassword@localhost:3306/blog
```

## ライセンス

MIT