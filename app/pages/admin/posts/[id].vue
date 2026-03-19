<script setup lang="ts">
import 'md-editor-v3/lib/style.css'

import type { Post } from '~/composables/usePosts'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const MdEditor = defineAsyncComponent(() => import('md-editor-v3').then(m => m.MdEditor))

const route = useRoute()
const { onUploadImg } = useEditorUpload()
const router = useRouter()

const post = ref<Post | null>(null)
const pending = ref(true)

onMounted(async () => {
  pending.value = true
  try {
    const { fetchPost } = usePosts()
    post.value = await fetchPost(String(route.params.id))
  } finally {
    pending.value = false
  }
})

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  tags: '',
  published: false
})

watch(post, (val) => {
  if (!val) return
  form.title = val.title
  form.slug = val.slug
  form.excerpt = val.excerpt
  form.content = val.content
  form.tags = val.tags.join(', ')
  form.published = val.published
}, { immediate: true })

const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!form.title || !form.slug || !form.content) {
    error.value = '請填寫標題、Slug 和內容。'
    return
  }
  error.value = ''
  loading.value = true
  try {
    const { updatePost } = usePosts()
    await updatePost(String(route.params.id), {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      published: form.published
    })
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
        編輯文章
      </h1>
    </div>

    <div
      v-if="pending"
      class="py-20 text-center text-muted"
    >
      載入中...
    </div>

    <div
      v-else-if="!post"
      class="py-20 text-center text-muted"
    >
      找不到此文章。
    </div>

    <form
      v-else
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
            <span class="text-sm">已發布</span>
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
