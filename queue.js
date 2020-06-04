import { getApp } from './app'

class QueueTask {
  taskId = {}

  list = {}

  /**
   * 入队
   * @param value
   */
  enqueue(type, value) {
    if (this.list[type] === undefined) {
      this.list[type] = new Map()
      this.taskId[type] = 0
    }

    this.taskId[type]++
    value.data.taskId = this.taskId[type]
    this.list[type].set(this.taskId[type], value)

    return this.taskId[type]
  }

  /**
   * 出队
   * @returns {*}
   */
  dequeue(type) {
    if (this.list[type] === undefined) return false

    for (let [key, value] of this.list[type].entries()) {
      this.list[type].delete(key)
      return value
    }

    return false
  }

  delete(type, taskId) {
    if (this.list[type] === undefined) return false

    this.list[type].delete(taskId)
  }
  /**
   * 队列是否为空
   * @returns {boolean}
   */
  isEmpty(type) {
    if (this.list[type] === undefined) return true

    return this.list[type].size === 0
  }

  /**
   * 返回队列长度
   * @returns {number}
   */
  size(type) {
    if (this.list[type] === undefined) return 0
    return this.list[type].size
  }

  /**
   * 清空队列
   */
  clear(type) {
    if (this.list[type] === undefined) {
      this.list[type] = new Map()
    } else {
      this.list[type].clear()
    }
    this.taskId[type] = 0
  }
}

export default QueueTask

/**
 * 添加任务
 * @param {*} fun 方法
 * @param {*} data 附带参数
 * @return int data 返回任务ID
 */
export function addTask(type, fun, data = {}) {
  const app = getApp()
  return app.globalData.task.enqueue(type, {
    fun,
    data
  })
}

/**
 * 获取任务，返回方法和参数
 */
export function getTask(type) {
  const app = getApp()

  if (app.globalData.task.isEmpty(type)) {
    return false
  }

  return app.globalData.task.dequeue(type)
}

/**
 * 自动获取一个任务，并处理
 * @param {*} arg 附加参数，与原参数合并
 */
export function handleTask(type, arg = {}) {
  let task = getTask(type)

  if (!task) return false

  task.fun(Object.assign({}, arg, task.data))
}

/**
 * 删除指定任务
 * @param {*} taskId addTask返回的任务Id
 */
export function deleteTask(type, taskId) {
  const app = getApp()

  app.globalData.task.delete(type, taskId)
}
