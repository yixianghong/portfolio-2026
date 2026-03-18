import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

export function useFirebase() {
  const app = useFirebaseApp()
  return {
    db: getFirestore(app),
    auth: getAuth(app),
    storage: getStorage(app)
  }
}
