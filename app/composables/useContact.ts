import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import type { Timestamp } from 'firebase/firestore'

export interface ContactDoc {
  content: string
  updatedAt: Timestamp | null
}

export function useContact() {
  const { db } = useFirebase()

  async function fetchContact(): Promise<string> {
    const snap = await getDoc(doc(db, 'settings', 'contact'))
    return snap.exists() ? (snap.data() as ContactDoc).content : ''
  }

  async function saveContact(content: string) {
    await setDoc(doc(db, 'settings', 'contact'), {
      content,
      updatedAt: serverTimestamp()
    })
  }

  return { fetchContact, saveContact }
}
