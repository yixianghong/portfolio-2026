import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import type { Timestamp } from 'firebase/firestore'

export interface AboutDoc {
  content: string
  updatedAt: Timestamp | null
}

export function useAbout() {
  const { db } = useFirebase()

  async function fetchAbout(): Promise<string> {
    const snap = await getDoc(doc(db, 'settings', 'about'))
    return snap.exists() ? (snap.data() as AboutDoc).content : ''
  }

  async function saveAbout(content: string) {
    await setDoc(doc(db, 'settings', 'about'), {
      content,
      updatedAt: serverTimestamp()
    })
  }

  return { fetchAbout, saveAbout }
}
