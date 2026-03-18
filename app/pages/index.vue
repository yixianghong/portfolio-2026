<script setup lang="ts">
import myPicUrl from '~/assets/image/mypic.jpg'

const { fetchWorks } = useWorks()

const { data: featuredWorks } = await useAsyncData('featured-works', () => fetchWorks(true), {
  server: false,
  default: () => []
})
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
        <NuxtLink
          v-for="work in featuredWorks"
          :key="work.id"
          :to="`/work/${work.id}`"
          class="group block"
        >
          <UCard class="h-full overflow-hidden transition will-change-transform group-hover:-translate-y-0.5 group-hover:shadow-lg">
            <div
              v-if="work.imageUrl"
              class="-mx-4 -mt-4 mb-4 aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800"
            >
              <img
                :src="work.imageUrl"
                :alt="work.title"
                class="h-full w-full object-cover transition group-hover:scale-105"
              >
            </div>

            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in work.tags"
                :key="tag"
                color="primary"
                variant="subtle"
                class="font-normal"
              >
                {{ tag }}
              </UBadge>
            </div>

            <div class="mt-3 flex items-baseline justify-between gap-3">
              <h3 class="text-base font-semibold tracking-tight">
                {{ work.title }}
              </h3>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </UPageSection>
  </div>
</template>
