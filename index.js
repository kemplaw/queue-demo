import { getApp } from './app'
import QueueTask, { addTask, deleteTask, handleTask } from './queue'

let taskId
const app = getApp()
app.globalData.task = new QueueTask()

// todo 逻辑获取数据之后的回调
function handleTodo(data) {
  // todo
}

// 准备处理 todo 逻辑
function readyTodo() {
  fetch('/demo')
    .then(res => res.json())
    .then(res => {
      // 任务入栈
      taskId = addTask('todo', handleTodo, res)
    })
    .catch(err => {
      // 异常任务要及时删除
      deleteTask('todo', taskId)
    })
}

// 完成 todo 逻辑
function finishTodo() {
  fetch('/demo1')
    .then(res => res.json())
    .then(res => {
      // 处理任务
      handleTask('todo', res)
    })
}
