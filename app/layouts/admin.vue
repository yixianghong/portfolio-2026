<script setup lang="ts">
const { logout } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  router.push('/admin/login')
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-950">
    <aside class="w-56 shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-800">
        <NuxtLink
          to="/"
          class="text-sm font-bold tracking-tight text-primary"
        >
          ← 回首頁
        </NuxtLink>
        <p class="mt-1 text-xs text-muted">
          Admin Panel
        </p>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <NuxtLink
          to="/admin/posts"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          active-class="bg-primary/10 text-primary"
        >
          <UIcon
            name="i-lucide-file-text"
            class="size-4 shrink-0"
          />
          Posts
        </NuxtLink>
        <NuxtLink
          to="/admin/works"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          active-class="bg-primary/10 text-primary"
        >
          <UIcon
            name="i-lucide-layers"
            class="size-4 shrink-0"
          />
          Works
        </NuxtLink>
        <NuxtLink
          to="/admin/about"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          active-class="bg-primary/10 text-primary"
        >
          <UIcon
            name="i-lucide-user"
            class="size-4 shrink-0"
          />
          About
        </NuxtLink>
      </nav>

      <div class="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-log-out"
          class="w-full justify-start"
          @click="handleLogout"
        >
          登出
        </UButton>
      </div>
    </aside>

    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>
