<script setup lang="ts">
type Project = {
  title: string
  date: string
  tags: string[]
  image?: string
}

const projects = ref<Project[]>([
  {
    title: 'EyeMall',
    date: '2021.03',
    tags: ['Vue2.0', 'Nuxt.js', 'RWD', 'Gitlab CI/CD', 'Google OAuth', 'FB OAuth', 'Node.js']
  },
  {
    title: 'CRM 系統',
    date: '2020.09',
    tags: ['RWD', 'Vue2', 'Vue CLI', 'C#', 'M-SQL', 'Firebase', 'SignalR']
  }
])

const sortDesc = ref(true)

function toSortableDate(value: string) {
  const normalized = value.replace(/[^\d]/g, '')
  const year = normalized.slice(0, 4)
  const month = normalized.slice(4, 6) || '01'
  return Number(`${year}${month}`)
}

const sortedProjects = computed(() => {
  return [...projects.value].sort((a, b) => {
    const da = toSortableDate(a.date)
    const db = toSortableDate(b.date)
    return sortDesc.value ? db - da : da - db
  })
})
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

    <div class="mt-10 grid gap-10 sm:grid-cols-2">
      <UCard
        v-for="project in sortedProjects"
        :key="project.title"
        class="transition will-change-transform hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div class="flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900/40 h-56">
          <img
            v-if="project.image"
            :src="project.image"
            :alt="project.title"
            class="max-h-44 w-auto object-contain"
            loading="lazy"
          >
          <div
            v-else
            class="text-muted flex items-center gap-2"
          >
            <UIcon
              name="i-lucide-image"
              class="size-5"
            />
            <span class="text-sm">
              Preview
            </span>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-2">
          <UBadge
            v-for="tag in project.tags"
            :key="tag"
            color="neutral"
            variant="outline"
            class="rounded-full font-normal"
          >
            {{ tag }}
          </UBadge>
        </div>

        <p class="mt-6 text-sm text-muted">
          作品 - {{ project.title }} - <span class="tabular-nums">{{ project.date }}</span>
        </p>
      </UCard>
    </div>
  </UPageSection>
</template>
