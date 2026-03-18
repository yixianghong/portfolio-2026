import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const app = initializeApp({
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  })

  const auth = getAuth(app)
  const db = getFirestore(app)
  const storage = getStorage(app)

  const currentUser = useState<User | null>('firebase-user', () => null)
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
  })

  return {
    provide: {
      firebase: { app, auth, db, storage }
    }
  }
})
