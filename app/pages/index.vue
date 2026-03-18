<script setup lang="ts">
import myPicUrl from '~/assets/image/mypic.jpg'

const projects = [
  {
    title: 'EyeMall',
    date: '2021.02',
    tags: ['Vue2.0', 'Nuxt.js', 'RWD', 'Gitlab CI/CD', 'Google OAuth', 'FB OAuth', 'Node.js']
  },
  {
    title: 'CRM 後台系統',
    date: '2020.09',
    tags: ['Html5', 'CSS3', 'RWD', 'JavaScript', 'ES6', 'Vue2', 'Vue CLI', 'C#', 'M-SQL', 'ASP.NET Core 3.1']
  }
] as const
</script>

<template>
  <div>
    <section class="py-16 sm:py-24">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 class="text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
              Hello I'm Jason — 前端軟體工程師
            </h1>
            <p class="mt-6 text-muted text-pretty leading-relaxed">
              目前專注於 Vue.js、Nuxt.js 網頁開發，並持續研究主流技術。軟體開發帶給我很多的挑戰與成就感，未來也會持續吸收開發的技術和知識，期望能累積更多豐富有趣的作品！
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <UButton
                to="/#work"
                color="primary"
                size="xl"
                trailing-icon="i-lucide-arrow-down"
              >
                Selected projects
              </UButton>
              <UButton
                to="/work"
                color="neutral"
                variant="outline"
                size="xl"
                trailing-icon="i-lucide-arrow-right"
              >
                See all
              </UButton>
            </div>
          </div>

          <div class="flex justify-center md:justify-end">
            <div class="relative">
              <img
                :src="myPicUrl"
                alt="Jason"
                class="h-72 w-72 rounded-3xl object-cover shadow-lg ring-1 ring-gray-200 dark:ring-gray-800 sm:h-80 sm:w-80"
                loading="eager"
                decoding="async"
              >
              <div class="pointer-events-none absolute -inset-3 -z-10 rounded-2 bg-primary/5 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <UPageSection id="work">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-pretty">
            Selected projects
          </h2>
          <p class="mt-2 text-muted">
            以技術標籤為主軸，精選近期作品。
          </p>
        </div>

        <UButton
          to="/work"
          color="primary"
          variant="link"
          trailing-icon="i-lucide-arrow-right"
        >
          See all
        </UButton>
      </div>

      <div class="mt-8 grid gap-6 sm:grid-cols-2">
        <UCard
          v-for="project in projects"
          :key="project.title"
          class="group transition will-change-transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="tag in project.tags"
              :key="tag"
              color="primary"
              variant="subtle"
              class="font-normal"
            >
              {{ tag }}
            </UBadge>
          </div>

          <div class="mt-5 flex items-baseline justify-between gap-3">
            <h3 class="text-base font-semibold tracking-tight">
              作品 - {{ project.title }}
            </h3>
            <span class="text-sm text-muted tabular-nums">
              {{ project.date }}
            </span>
          </div>
        </UCard>
      </div>
    </UPageSection>
  </div>
</template>
