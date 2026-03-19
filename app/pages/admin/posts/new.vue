<script setup lang="ts">
import 'md-editor-v3/lib/style.css'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const MdEditor = defineAsyncComponent(() => import('md-editor-v3').then(m => m.MdEditor))

const { onUploadImg } = useEditorUpload()
const router = useRouter()

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  tags: '',
  published: false
})

const loading = ref(false)
const error = ref('')

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

watch(() => form.title, (val) => {
  if (!form.slug) {
    form.slug = slugify(val)
  }
})

async function handleSubmit() {
  if (!form.title || !form.slug || !form.content) {
    error.value = '請填寫標題、Slug 和內容。'
    return
  }
  error.value = ''
  loading.value = true
  try {
    const { createPost } = usePosts()
    await createPost({
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      published: form.published
    })
    clearNuxtData('admin-posts')
    router.push('/admin/posts')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '儲存失敗'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-4">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink
        to="/admin/posts"
        class="text-muted hover:text-primary transition-colors"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="size-4"
        />
      </NuxtLink>
      <h1 class="text-xl font-semibold">
        新增文章
      </h1>
    </div>

    <form
      class="space-y-6"
      @submit.prevent="handleSubmit"
    >
      <UCard>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">標題 *</label>
            <UInput
              v-model="form.title"
              placeholder="文章標題"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">Slug *</label>
            <UInput
              v-model="form.slug"
              placeholder="my-post-slug"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">摘要</label>
            <UTextarea
              v-model="form.excerpt"
              placeholder="文章摘要"
              :rows="3"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">Tags（逗號分隔）</label>
            <UInput
              v-model="form.tags"
              placeholder="Vue, Nuxt, TypeScript"
              class="w-full"
            />
          </div>

          <div class="flex items-center gap-3">
            <USwitch v-model="form.published" />
            <span class="text-sm">立即發布</span>
          </div>
        </div>
      </UCard>

      <div>
        <label class="block text-sm font-medium mb-1.5">內容 *</label>
        <ClientOnly>
          <MdEditor
            v-if="MdEditor"
            v-model="form.content"
            style="height: 500px"
            @on-upload-img="onUploadImg"
          />
          <template #fallback>
            <UTextarea
              v-model="form.content"
              :rows="20"
              class="w-full font-mono text-sm"
            />
          </template>
        </ClientOnly>
      </div>

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
          to="/admin/posts"
          color="neutral"
          variant="outline"
        >
          取消
        </UButton>
      </div>
    </form>
  </div>
</template>
