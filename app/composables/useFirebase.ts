export function useFirebase() {
  const { $firebase } = useNuxtApp()
  return {
    db: $firebase.db,
    auth: $firebase.auth,
    storage: $firebase.storage
  }
}
