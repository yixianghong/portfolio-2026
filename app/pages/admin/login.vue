<script setup lang="ts">
definePageMeta({ layout: false })

const router = useRouter()

onMounted(async () => {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated.value) {
    await navigateTo('/admin/posts', { replace: true })
  }
})

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const { login } = useAuth()
    await login(email.value, password.value)
    router.replace('/admin/posts')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '登入失敗，請確認帳號密碼。'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold tracking-tight">
          Admin Login
        </h1>
        <p class="mt-2 text-sm text-muted">
          請使用 Firebase 帳號登入
        </p>
      </div>

      <UCard>
        <form
          class="space-y-4"
          @submit.prevent="handleLogin"
        >
          <div>
            <label class="block text-sm font-medium mb-1.5">Email</label>
            <UInput
              v-model="email"
              type="email"
              placeholder="admin@example.com"
              required
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">Password</label>
            <UInput
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full"
            />
          </div>

          <UAlert
            v-if="error"
            color="error"
            variant="subtle"
            :description="error"
            icon="i-lucide-alert-circle"
          />

          <UButton
            type="submit"
            color="primary"
            :loading="loading"
            class="w-full justify-center"
          >
            登入
          </UButton>
        </form>
      </UCard>
    </div>
  </div>
</template>
