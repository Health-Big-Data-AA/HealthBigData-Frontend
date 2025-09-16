//保存缓存
export function setStorage(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

//获取缓存
export function getStorage(name) {
  const data = localStorage.getItem(name);
  try {
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return data;
  }
}

//删除缓存
export function delStorage(name) {
  return localStorage.removeItem(name);
}
