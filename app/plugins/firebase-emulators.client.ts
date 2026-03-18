import { connectFirestoreEmulator } from 'firebase/firestore'
import { connectAuthEmulator } from 'firebase/auth'
import { connectStorageEmulator } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  if (import.meta.env.PROD) return

  const { db, auth, storage } = useFirebase()

  try {
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
    connectStorageEmulator(storage, 'localhost', 9199)
  } catch {
    // 已連接過，忽略重複連線錯誤
  }
})
