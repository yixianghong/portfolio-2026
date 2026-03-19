<script setup lang="ts">
import 'md-editor-v3/lib/style.css'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const MdEditor = defineAsyncComponent(() => import('md-editor-v3').then(m => m.MdEditor))

const { onUploadImg } = useEditorUpload()

const content = ref('')
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const { fetchAbout } = useAbout()
    content.value = await fetchAbout()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '載入失敗'
  } finally {
    loading.value = false
  }
})

async function handleSave() {
  error.value = ''
  success.value = false
  saving.value = true
  try {
    const { saveAbout } = useAbout()
    await saveAbout(content.value)
    success.value = true
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '儲存失敗'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold">
        About 頁面
      </h1>
      <UButton
        color="primary"
        :loading="saving"
        icon="i-lucide-save"
        @click="handleSave"
      >
        儲存
      </UButton>
    </div>

    <div
      v-if="loading"
      class="flex justify-center py-20"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-muted"
      />
    </div>

    <template v-else>
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :description="error"
        icon="i-lucide-alert-circle"
        class="mb-4"
      />
      <UAlert
        v-if="success"
        color="success"
        variant="subtle"
        description="已成功儲存。"
        icon="i-lucide-check-circle"
        class="mb-4"
      />

      <ClientOnly>
        <MdEditor
          v-if="MdEditor"
          v-model="content"
          style="height: 600px"
          @on-upload-img="onUploadImg"
        />
        <template #fallback>
          <UTextarea
            v-model="content"
            :rows="24"
            class="w-full font-mono text-sm"
          />
        </template>
      </ClientOnly>
    </template>
  </div>
</template>
