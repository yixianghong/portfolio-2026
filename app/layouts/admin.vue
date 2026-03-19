<script setup lang="ts">
const { logout } = useAuth()
const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)

watch(() => route.path, () => { sidebarOpen.value = false })

async function handleLogout() {
  await logout()
  router.push('/admin/login')
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- 手機 overlay 遮罩 -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 md:hidden"
      @click="sidebarOpen = false"
    />

    <!-- 側邊欄 -->
    <aside
      :class="[
        'flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900',
        'fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-200',
        'md:relative md:w-56 md:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
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
        <NuxtLink
          to="/admin/contact"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          active-class="bg-primary/10 text-primary"
        >
          <UIcon
            name="i-lucide-mail"
            class="size-4 shrink-0"
          />
          Contact
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

    <!-- 主內容區 -->
    <main class="flex-1 overflow-auto min-w-0">
      <!-- 手機版頂部 bar -->
      <div class="flex items-center h-12 px-4 border-b border-gray-200 dark:border-gray-800 md:hidden bg-white dark:bg-gray-900">
        <UButton
          variant="ghost"
          :icon="sidebarOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          @click="sidebarOpen = !sidebarOpen"
        />
        <span class="ml-3 text-sm font-semibold">Admin Panel</span>
      </div>
      <slot />
    </main>
  </div>
</template>
