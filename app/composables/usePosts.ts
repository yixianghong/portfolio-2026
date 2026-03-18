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
  type Timestamp
} from 'firebase/firestore'

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  tags: string[]
  published: boolean
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}

export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>

export function usePosts() {
  async function fetchPosts(adminMode = false): Promise<Post[]> {
    const { db } = useFirebase()
    const ref = collection(db, 'posts')
    const q = adminMode
      ? query(ref, orderBy('createdAt', 'desc'))
      : query(ref, where('published', '==', true), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Post))
  }

  async function fetchPost(id: string): Promise<Post | null> {
    const { db } = useFirebase()
    const snap = await getDoc(doc(db, 'posts', id))
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() } as Post
  }

  async function fetchPostBySlug(slug: string): Promise<Post | null> {
    const { db } = useFirebase()
    const q = query(collection(db, 'posts'), where('slug', '==', slug), where('published', '==', true))
    const snap = await getDocs(q)
    if (snap.empty) return null
    const first = snap.docs[0]
    if (!first) return null
    return { id: first.id, ...first.data() } as Post
  }

  async function createPost(data: PostInput) {
    const { db } = useFirebase()
    return addDoc(collection(db, 'posts'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  async function updatePost(id: string, data: Partial<PostInput>) {
    const { db } = useFirebase()
    return updateDoc(doc(db, 'posts', id), {
      ...data,
      updatedAt: serverTimestamp()
    })
  }

  async function deletePost(id: string) {
    const { db } = useFirebase()
    return deleteDoc(doc(db, 'posts', id))
  }

  return { fetchPosts, fetchPost, fetchPostBySlug, createPost, updatePost, deletePost }
}
