import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

export interface Work {
  id: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  projectUrl?: string
  githubUrl?: string
  date: Timestamp | null
  featured: boolean
}

export type WorkInput = Omit<Work, 'id' | 'date'> & { date: string }

export function useWorks() {
  async function fetchWorks(featuredOnly = false): Promise<Work[]> {
    const { db } = useFirebase()
    const ref = collection(db, 'works')
    const q = featuredOnly
      ? query(ref, where('featured', '==', true), orderBy('date', 'desc'))
      : query(ref, orderBy('date', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Work))
  }

  async function fetchWork(id: string): Promise<Work | null> {
    const { db } = useFirebase()
    const snap = await getDoc(doc(db, 'works', id))
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() } as Work
  }

  async function createWork(data: WorkInput, imageFile?: File): Promise<Work> {
    const { db, storage } = useFirebase()
    const docRef = await addDoc(collection(db, 'works'), {
      ...data,
      imageUrl: '',
      date: data.date ? Timestamp.fromDate(new Date(data.date)) : serverTimestamp()
    })

    if (imageFile) {
      const fileRef = storageRef(storage, `works/${docRef.id}/${imageFile.name}`)
      await uploadBytes(fileRef, imageFile)
      const imageUrl = await getDownloadURL(fileRef)
      await updateDoc(docRef, { imageUrl })
    }

    const snap = await getDoc(docRef)
    return { id: snap.id, ...snap.data() } as Work
  }

  async function updateWork(id: string, data: Partial<WorkInput>, imageFile?: File) {
    const { db, storage } = useFirebase()
    const { date: dateStr, ...rest } = data
    const updates: Record<string, unknown> = {
      ...rest,
      date: dateStr ? Timestamp.fromDate(new Date(dateStr)) : serverTimestamp()
    }

    if (imageFile) {
      const fileRef = storageRef(storage, `works/${id}/${imageFile.name}`)
      await uploadBytes(fileRef, imageFile)
      updates.imageUrl = await getDownloadURL(fileRef)
    }

    return updateDoc(doc(db, 'works', id), updates)
  }

  async function deleteWork(id: string) {
    const { db, storage } = useFirebase()
    const work = await fetchWork(id)
    await deleteDoc(doc(db, 'works', id))

    if (work?.imageUrl) {
      try {
        const fileRef = storageRef(storage, `works/${id}`)
        await deleteObject(fileRef)
      } catch {
        // 圖片刪除失敗不阻斷流程
      }
    }
  }

  return { fetchWorks, fetchWork, createWork, updateWork, deleteWork }
}
