import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export function useEditorUpload() {
  const { storage } = useFirebase()

  async function onUploadImg(files: File[], callback: (urls: string[]) => void) {
    const urls = await Promise.all(
      files.map(async (file) => {
        const path = `editor-images/${Date.now()}-${file.name}`
        const ref = storageRef(storage, path)
        await uploadBytes(ref, file)
        return getDownloadURL(ref)
      })
    )
    callback(urls)
  }

  return { onUploadImg }
}
