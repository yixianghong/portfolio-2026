<script setup lang="ts">
import type { Work } from '~/composables/useWorks'

useSeoMeta({
  title: 'Works | Jason Hong',
  description: 'Jason Hong 的作品集。',
  ogTitle: 'Works | Jason Hong',
  ogDescription: 'Jason Hong 的作品集。'
})

const works = ref<Work[]>([])
const pending = ref(true)

onMounted(async () => {
  try {
    const { fetchWorks } = useWorks()
    works.value = await fetchWorks()
  } finally {
    pending.value = false
  }
})

const sortDesc = ref(true)

function toSortableDate(ts: { toDate(): Date } | null | undefined): number {
  if (!ts) return 0
  return ts.toDate().getTime()
}

const sortedWorks = computed(() => {
  return [...works.value].sort((a, b) => {
    const da = toSortableDate(a.date)
    const db = toSortableDate(b.date)
    return sortDesc.value ? db - da : da - db
  })
})

function formatDate(ts: { toDate(): Date } | null | undefined) {
  if (!ts) return ''
  const d = ts.toDate()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
}
</script>

<template>
  <UPageSection>
    <div class="flex items-end justify-between gap-4">
      <h1 class="text-2xl font-semibold tracking-tight">
        My Works
      </h1>

      <UButton
        color="neutral"
        variant="link"
        :trailing-icon="sortDesc ? 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-wide-narrow'"
        @click="sortDesc = !sortDesc"
      >
        Sort Date
      </UButton>
    </div>

    <div
      v-if="pending"
      class="mt-10 flex justify-center py-20"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-muted"
      />
    </div>

    <div
      v-else-if="sortedWorks.length === 0"
      class="mt-10 py-20 text-center text-muted"
    >
      目前還沒有作品。
    </div>

    <div
      v-else
      class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <NuxtLink
        v-for="work in sortedWorks"
        :key="work.id"
        :to="`/work/${work.id}`"
        class="group block"
      >
        <UCard class="h-full overflow-hidden transition will-change-transform group-hover:-translate-y-0.5 group-hover:shadow-lg">
          <div class="-mx-4 -mt-4 mb-4 aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              v-if="work.imageUrl"
              :src="work.imageUrl"
              :alt="work.title"
              class="h-full w-full object-cover transition group-hover:scale-105"
              loading="lazy"
            >
            <div
              v-else
              class="flex h-full items-center justify-center gap-2 text-muted"
            >
              <UIcon
                name="i-lucide-image"
                class="size-5"
              />
              <span class="text-sm">Preview</span>
            </div>
          </div>

          <h3 class="font-semibold tracking-tight">
            {{ work.title }}
          </h3>
          <p class="mt-1 text-xs text-muted tabular-nums">
            {{ formatDate(work.date) }}
          </p>

          <div class="mt-3 flex flex-wrap gap-1.5">
            <UBadge
              v-for="tag in work.tags"
              :key="tag"
              color="neutral"
              variant="outline"
              size="sm"
              class="rounded-full font-normal"
            >
              {{ tag }}
            </UBadge>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </UPageSection>
</template>
