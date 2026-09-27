# claude-sandbox-app-v1

FastAPI + React (Vite) によるシンプルなTodoアプリのサンドボックス構成です。

## 構成

- `backend/` — FastAPI製のTodo API（インメモリ保存）
- `frontend/` — React (Vite) 製のフロントエンド

```mermaid
flowchart LR
    subgraph Browser["ブラウザ"]
        UI["React (Vite)\nlocalhost:5173"]
    end

    subgraph Server["バックエンド"]
        API["FastAPI\nlocalhost:8000"]
        Store[("インメモリ\nTodoストア")]
    end

    UI -- "fetch /api/todos\nGET / POST / PATCH / DELETE" --> API
    API -- "JSON" --> UI
    API --> Store
```

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as React (frontend)
    participant B as FastAPI (backend)

    U->>F: タスクを入力して「追加」
    F->>B: POST /api/todos {title}
    B-->>F: 201 Created (todo)
    F->>B: GET /api/todos
    B-->>F: 200 OK (todo一覧)
    F-->>U: 一覧を再描画
```

## バックエンドの起動

```bash
cd backend
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
./venv/bin/uvicorn main:app --reload --port 8000
```

- ヘルスチェック: `GET http://localhost:8000/api/health`
- Todo一覧: `GET http://localhost:8000/api/todos`
- Todo作成: `POST http://localhost:8000/api/todos` (`{"title": "..."}`)
- Todo更新: `PATCH http://localhost:8000/api/todos/{id}` (`{"done": true}` など)
- Todo削除: `DELETE http://localhost:8000/api/todos/{id}`

## フロントエンドの起動

```bash
cd frontend
npm install
npm run dev
```

デフォルトで `http://localhost:8000` のAPIを利用します。変更する場合は
`frontend/.env` に `VITE_API_BASE_URL=http://example.com` を設定してください。

ブラウザで `http://localhost:5173` を開くとTodoアプリが表示されます。
