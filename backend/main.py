from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Sandbox Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Todo(BaseModel):
    id: str
    title: str
    done: bool = False


class TodoCreate(BaseModel):
    title: str


class TodoUpdate(BaseModel):
    title: str | None = None
    done: bool | None = None


todos: dict[str, Todo] = {}


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/todos", response_model=list[Todo])
def list_todos() -> list[Todo]:
    return list(todos.values())


@app.post("/api/todos", response_model=Todo, status_code=201)
def create_todo(payload: TodoCreate) -> Todo:
    todo = Todo(id=str(uuid4()), title=payload.title, done=False)
    todos[todo.id] = todo
    return todo


@app.patch("/api/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: str, payload: TodoUpdate) -> Todo:
    todo = todos.get(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    updated = todo.model_copy(update=payload.model_dump(exclude_unset=True))
    todos[todo_id] = updated
    return updated


@app.delete("/api/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: str) -> None:
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    del todos[todo_id]
