// ทำในไฟล์ TodoItem.jsx ในไดเร็กทอรี frontent/src/
import './App.css'
import { useState } from 'react'

function TodoItem({todo}) {
    const [newComment, setNewComment] = useState("");  


    return (
        <li>
        <span className={todo.done ? "done" : ""}>{todo.title}</span>
        <button onClick={() => {toggleDone(todo.id)}}>Toggle</button>
        <button onClick={() => {deleteTodo(todo.id)}}>❌</button>
        {todo.comments && todo.comments.length > 0 ? (
          <>
          <div>{todo.comments.length} comments</div>
          <ul>
            {todo.comments.map((comment) => (
              <li key={comment.id}>{comment.message}</li>
            ))}
          </ul>
          </>
        ) : (
          <span>No comments</span>
        )}
        <div className="new-comment-forms">
        <input
            type="text"

          // แก้บรรทัดด้านล่าง
            value={newComment}     // ของเก่าเป็น value={newComments[todo.id] || ""}


            onChange={(e) => {
            const value = e.target.value;

            // แก้บรรทัดด้านล่าง
            setNewComment(value);    // ของเดิม: setNewComments({ ...newComments, [todo.id]: value });
          }}
        />
        // ละไว้
        <button onClick={() => {                         // แก้ส่วนนี้
          addNewComment(todo.id, newComment);
          setNewComment("");
        }}>Add Comment</button>
        </div>
    </li>
    )
}

export default TodoItem