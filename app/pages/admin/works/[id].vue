<script setup lang="ts">
import 'md-editor-v3/lib/style.css'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const MdEditor = defineAsyncComponent(() => import('md-editor-v3').then(m => m.MdEditor))

const route = useRoute()
const { fetchWork, updateWork } = useWorks()
const router = useRouter()

const { data: work } = await useAsyncData(`admin-work-${route.params.id}`, () =>
  fetchWork(String(route.params.id)), { server: false })

const form = reactive({
  title: '',
  description: '',
  tags: '',
  projectUrl: '',
  githubUrl: '',
  date: '',
  featured: false
})

watch(work, (val) => {
  if (!val) return
  form.title = val.title
  form.description = val.description
  form.tags = val.tags.join(', ')
  form.projectUrl = val.projectUrl ?? ''
  form.githubUrl = val.githubUrl ?? ''
  form.date = val.date ? val.date.toDate().toISOString().slice(0, 7) : ''
  form.featured = val.featured
}, { immediate: true })

const imageFile = ref<File | null>(null)
const imagePreview = ref('')
const loading = ref(false)
const error = ref('')

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

async function handleSubmit() {
  if (!form.title || !form.description) {
    error.value = '請填寫標題和描述。'
    return
  }
  error.value = ''
  loading.value = true
  try {
    await updateWork(
      String(route.params.id),
      {
        title: form.title,
        description: form.description,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        imageUrl: work.value?.imageUrl ?? '',
        projectUrl: form.projectUrl || '',
        githubUrl: form.githubUrl || '',
        date: form.date,
        featured: form.featured
      },
      imageFile.value ?? undefined
    )
    router.push('/admin/works')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '儲存失敗'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-8">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink
        to="/admin/works"
        class="text-muted hover:text-primary transition-colors"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="size-4"
        />
      </NuxtLink>
      <h1 class="text-xl font-semibold">
        編輯作品
      </h1>
    </div>

    <div
      v-if="!work"
      class="py-20 text-center text-muted"
    >
      找不到此作品。
    </div>

    <form
      v-else
      class="max-w-2xl space-y-6"
      @submit.prevent="handleSubmit"
    >
      <UCard>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">標題 *</label>
            <UInput
              v-model="form.title"
              placeholder="作品名稱"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">描述 *</label>
            <ClientOnly>
              <MdEditor
                v-if="MdEditor"
                v-model="form.description"
                style="height: 300px"
              />
              <template #fallback>
                <UTextarea
                  v-model="form.description"
                  placeholder="作品描述"
                  :rows="6"
                  class="w-full font-mono text-sm"
                />
              </template>
            </ClientOnly>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">Tags（逗號分隔）</label>
            <UInput
              v-model="form.tags"
              placeholder="Vue, Nuxt, Firebase"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">Project URL</label>
            <UInput
              v-model="form.projectUrl"
              placeholder="https://example.com"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">GitHub URL</label>
            <UInput
              v-model="form.githubUrl"
              placeholder="https://github.com/..."
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">製作時間</label>
            <UInput
              v-model="form.date"
              type="month"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">封面圖片</label>
            <div
              v-if="work.imageUrl && !imagePreview"
              class="mb-3"
            >
              <img
                :src="work.imageUrl"
                alt="Current image"
                class="h-32 rounded-lg object-cover"
              >
            </div>
            <input
              type="file"
              accept="image/*"
              class="block w-full text-sm text-muted file:mr-4 file:py-1.5 file:px-3 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium"
              @change="handleFileChange"
            >
            <img
              v-if="imagePreview"
              :src="imagePreview"
              alt="Preview"
              class="mt-3 h-32 rounded-lg object-cover"
            >
          </div>

          <div class="flex items-center gap-3">
            <USwitch v-model="form.featured" />
            <span class="text-sm">顯示於首頁 Featured</span>
          </div>
        </div>
      </UCard>

      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :description="error"
        icon="i-lucide-alert-circle"
      />

      <div class="flex gap-3">
        <UButton
          type="submit"
          color="primary"
          :loading="loading"
        >
          儲存
        </UButton>
        <UButton
          to="/admin/works"
          color="neutral"
          variant="outline"
        >
          取消
        </UButton>
      </div>
    </form>
  </div>
</template>
