<script setup lang="ts">
import { marked } from 'marked'

import type { Work } from '~/composables/useWorks'

const route = useRoute()

const work = ref<Work | null>(null)
const pending = ref(true)

onMounted(async () => {
  try {
    const { fetchWork } = useWorks()
    work.value = await fetchWork(String(route.params.id))
  } finally {
    pending.value = false
  }
})

useSeoMeta({
  title: () => work.value?.title ? `${work.value.title} | Jason Hong` : 'Works | Jason Hong',
  description: () => work.value?.description?.slice(0, 160) ?? 'Jason Hong 的作品集。',
  ogTitle: () => work.value?.title ? `${work.value.title} | Jason Hong` : 'Works | Jason Hong',
  ogDescription: () => work.value?.description?.slice(0, 160) ?? 'Jason Hong 的作品集。'
})

const html = computed(() => {
  if (!work.value?.description) return ''
  return marked.parse(work.value.description) as string
})

function formatDate(ts: { toDate(): Date } | null | undefined) {
  if (!ts) return ''
  const d = ts.toDate()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
}
</script>

<template>
  <UPageSection>
    <div
      v-if="pending"
      class="flex justify-center py-20"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-muted"
      />
    </div>

    <div
      v-else-if="!work"
      class="py-20 text-center text-muted"
    >
      找不到此作品。
    </div>

    <div
      v-else
      class="mx-auto max-w-3xl"
    >
      <NuxtLink
        to="/work"
        class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="size-4"
        />
        回作品列表
      </NuxtLink>

      <div
        v-if="work.imageUrl"
        class="mt-6 overflow-hidden rounded-xl"
      >
        <img
          :src="work.imageUrl"
          :alt="work.title"
          class="w-full object-cover"
        >
      </div>

      <div class="mt-8">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
          {{ work.title }}
        </h1>

        <div class="mt-4 flex flex-wrap items-center gap-3">
          <span
            v-if="work.date"
            class="text-sm text-muted tabular-nums"
          >
            {{ formatDate(work.date) }}
          </span>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="tag in work.tags"
              :key="tag"
              color="neutral"
              variant="outline"
              class="rounded-full font-normal"
            >
              {{ tag }}
            </UBadge>
          </div>
        </div>

        <div
          v-if="work.projectUrl || work.githubUrl"
          class="mt-6 flex gap-3"
        >
          <UButton
            v-if="work.projectUrl"
            :to="work.projectUrl"
            target="_blank"
            color="primary"
            icon="i-lucide-external-link"
          >
            Demo
          </UButton>
          <UButton
            v-if="work.githubUrl"
            :to="work.githubUrl"
            target="_blank"
            color="neutral"
            variant="outline"
            icon="i-simple-icons-github"
          >
            GitHub
          </UButton>
        </div>
      </div>

      <div
        v-if="html"
        class="prose dark:prose-invert mt-10 max-w-none"
        v-html="html"
      />
    </div>
  </UPageSection>
</template>
