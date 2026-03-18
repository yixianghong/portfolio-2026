<script setup lang="ts">
const route = useRoute()
const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'MyWork', to: '/work' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact Me', to: '/contact' }
]
</script>

<template>
  <div>
    <UHeader :toggle="{ class: 'md:hidden' }">
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>

        <nav class="ml-6 hidden md:flex items-center gap-1">
          <UButton
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            color="neutral"
            variant="link"
            class="font-medium"
            :class="route.path === item.to ? 'text-primary' : undefined"
          >
            {{ item.label }}
          </UButton>
        </nav>
      </template>

      <template #right>
        <UColorModeButton />

        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>

      <template #content="{ close }">
        <div class="flex justify-end p-4">
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            aria-label="Close menu"
            @click="close?.()"
          />
        </div>
        <div class="flex grow items-center justify-center py-6">
          <div class="grid w-full max-w-xs gap-2">
            <UButton
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              color="neutral"
              variant="ghost"
              class="w-full justify-center text-center font-medium"
              :class="route.path === item.to ? 'text-primary' : undefined"
              @click="close?.()"
            >
              {{ item.label }}
            </UButton>
          </div>
        </div>
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Jason Hong. All rights reserved © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </div>
</template>
