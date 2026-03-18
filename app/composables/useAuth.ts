import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

export function useAuth() {
  const user = useState('firebase-user')
  const isAuthenticated = computed(() => !!user.value)

  function login(email: string, password: string) {
    const { auth } = useFirebase()
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    const { auth } = useFirebase()
    return signOut(auth)
  }

  return { user, isAuthenticated, login, logout }
}
