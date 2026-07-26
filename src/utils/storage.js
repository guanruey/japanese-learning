/**
 * 防禦型 Storage 水合工具 - 防止無效 JSON 或類型不符合引發全站 TypeError 崩潰
 */

export function safeLoadArray(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch (err) {
    console.warn(`[SafeStorage] Failed parsing array for key "${key}":`, err)
    return fallback
  }
}

export function safeLoadObject(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback
  } catch (err) {
    console.warn(`[SafeStorage] Failed parsing object for key "${key}":`, err)
    return fallback
  }
}

export function safeLoadBoolean(key, fallback = false) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null || raw === undefined) return fallback
    return raw === 'true'
  } catch {
    return fallback
  }
}

export function safeSaveStorage(key, value) {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(key, serialized)
  } catch (err) {
    console.error(`[SafeStorage] Failed writing key "${key}":`, err)
  }
}
