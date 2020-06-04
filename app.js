let appIns

class App {
  globalData = {}
}

export function getApp() {
  return () => {
    if (!appIns) {
      appIns = new App()
    }

    return appIns
  }
}
