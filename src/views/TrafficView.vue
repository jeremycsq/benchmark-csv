<template>
  <div class="min-h-screen">
    <!-- Metrics Section avec fond blanc -->
    <transition name="fade-scale" mode="out-in">
      <DataOverview
        pageType="traffic"
        :trafficStore="trafficStore"
        class="reveal-up reveal-fade"
        :key="$route.path"
      />
    </transition>

    <!-- Tout le reste de la page avec fond #F5FFF0 -->
    <section class="bg-[#F5FFF0] reveal-up">
      <!-- Traffic Section -->
      <div class="max-w-7xl mx-auto px-8 py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div class="flex flex-col">
            <h3 class="text-3xl font-newedge text-[#000000]">Traffic</h3>
            <span class="text-gray-600 font-normal pt-1">
              Compare your metrics to specific peers in the traffic category
            </span>
          </div>
          <div class="flex items-center gap-4">
            <span class="bg-[#307A57] text-white px-3 py-1 rounded-full text-sm font-semibold">
              {{ headerText }}
            </span>
            <span class="text-3xl font-newedge text-[#000000]">{{ headerValue }}%</span>
          </div>
        </div>
        <span
          class="bg-[#C1E3B1] text-[#43745D] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block"
        >
          Overview
        </span>
        <div class="mb-8 reveal-up">
          <div class="flex flex-col md:flex-row mt-4">
            <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
              <div
                class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
              >
                <div class="h-2 w-8 rounded bg-[#C1E3B1]"></div>
                <div class="text-gray-600 font-newedge pt-1 font-medium">All Devices</div>
              </div>
              <div
                class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
              >
                <div class="h-2 w-8 rounded bg-[#6D9A7A]"></div>
                <div class="text-gray-600 font-newedge pt-1 font-medium">Desktop</div>
              </div>
              <div class="flex flex-row items-center justify-start gap-4">
                <div class="h-2 w-8 rounded bg-[#2F654B]"></div>
                <div class="text-gray-600 font-newedge pt-1 font-medium">Mobile</div>
              </div>
            </div>

            <div
              class="w-full bg-white rounded-xl shadow-sm p-6 h-[320px] md:w-2/3 mt-6 md:mt-0 border border-[#E9F5E4] flex flex-col justify-between"
            >
              <div class="flex-1 flex w-full">
                <!-- Labels pourcentages à gauche -->
                <!-- Chart.js Line Chart -->
                <div class="flex-1 flex flex-col items-center justify-between">
                  <LineChart
                    :data="chartData"
                    labelColor="#B9C7B3"
                    gridColor="#E9F5E4"
                    class="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Nouveau bloc benchmark graphique -->
        <span
          class="bg-[#C1E3B1] text-[#43745D] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
        >
          Traffic share by types
        </span>
        <div class="flex flex-col md:flex-row mt-8 reveal-up">
          <div class="w-full md:w-1/3 flex flex-col items-start gap-4 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
            >
              <div class="text-gray-600 font-newedge pt-1 font-medium">Traffic share by device</div>
            </div>
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
            >
              <div class="text-gray-600 font-newedge pt-1 font-medium">New vs Returning</div>
            </div>
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
            >
              <div class="text-gray-600 font-newedge pt-1 font-medium">Paid vs Unpaid</div>
            </div>
          </div>
          <div
            class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-6 md:mt-0 border border-[#E9F5E4] flex flex-col gap-8 justify-center"
          >
            <!-- By Device -->
            <div>
              <div class="flex justify-between text-[#B9C7B3] text-xs font-medium mb-1 px-2">
                <span>Mobile</span>
                <span>Desktop</span>
              </div>
              <div
                class="relative w-full h-8 bg-[#E9F5E4] rounded-full flex items-center overflow-hidden"
              >
                <div
                  class="h-full bg-[#6D9A7A] flex items-center justify-center text-white text-xs"
                  :style="{ width: benchmarkData.mobile + '%' }"
                >
                  {{ benchmarkData.mobile }}%
                </div>
                <div
                  class="h-full bg-[#2F654B] flex items-center justify-center text-white text-xs"
                  :style="{ width: benchmarkData.desktop + '%' }"
                >
                  {{ benchmarkData.desktop }}%
                </div>
              </div>
            </div>
            <!-- New vs Returning -->
            <div>
              <div class="flex justify-between text-[#B9C7B3] text-xs font-medium mb-1 px-2">
                <span>New</span>
                <span>Returning</span>
              </div>
              <div
                class="relative w-full h-8 bg-[#E9F5E4] rounded-full flex items-center overflow-hidden"
              >
                <div
                  class="h-full bg-[#6D9A7A] flex items-center justify-center text-white text-xs"
                  :style="{ width: benchmarkData.new + '%' }"
                >
                  {{ benchmarkData.new }}%
                </div>
                <div
                  class="h-full bg-[#2F654B] flex items-center justify-center text-white text-xs"
                  :style="{ width: benchmarkData.returning + '%' }"
                >
                  {{ benchmarkData.returning }}%
                </div>
              </div>
            </div>
            <!-- Paid vs Unpaid -->
            <div>
              <div class="flex justify-between text-[#B9C7B3] text-xs font-medium mb-1 px-2">
                <span>Paid</span>
                <span>Unpaid</span>
              </div>
              <div
                class="relative w-full h-8 bg-[#E9F5E4] rounded-full flex items-center overflow-hidden"
              >
                <div
                  class="h-full bg-[#6D9A7A] flex items-center justify-center text-white text-xs"
                  :style="{ width: benchmarkData.paid + '%' }"
                >
                  {{ benchmarkData.paid }}%
                </div>
                <div
                  class="h-full bg-[#2F654B] flex items-center justify-center text-white text-xs"
                  :style="{ width: benchmarkData.unpaid + '%' }"
                >
                  {{ benchmarkData.unpaid }}%
                </div>
              </div>
            </div>
            <!-- Graduation -->
            <div class="flex justify-between text-[#B9C7B3] text-xs mt-2 px-2">
              <span>0%</span>
              <span>10%</span>
              <span>20%</span>
              <span>30%</span>
              <span>40%</span>
              <span>50%</span>
              <span>60%</span>
            </div>
          </div>
        </div>
        <!-- Nouveau bloc "Change" -->
        <span
          class="bg-[#C1E3B1] text-[#43745D] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
        >
          Traffic change by type
        </span>
        <div class="flex flex-col md:flex-row mt-8 reveal-up">
          <!-- Labels à gauche -->
          <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
            >
              <div class="text-gray-600 font-newedge pt-1 font-medium">
                Year-on-Year traffic variations by type
              </div>
            </div>
          </div>
          <!-- Valeurs random pour le bloc Change
          const changeData = ref({
            overall: 0,
            desktop: 0,
            mobile: 0,
            unpaid: 0,
            new: 0,
            returning: 0,
          })

          function randomizeChange() {
            // Overall : -20 à +20
            changeData.value.overall = Math.floor(Math.random() * 41) - 20
            // Desktop : -20 à +20
            changeData.value.desktop = Math.floor(Math.random() * 41) - 20
            // Mobile : -20 à +20
            changeData.value.mobile = Math.floor(Math.random() * 41) - 20
            // Unpaid : -10 à +20
            changeData.value.unpaid = Math.floor(Math.random() * 31) + 10
            // New : -10 à +20
            changeData.value.new = Math.floor(Math.random() * 31) + 10
            // Returning : 0 à +20
            changeData.value.returning = Math.floor(Math.random() * 21)
          }

          watch(
            () => [
              trafficStore.selectedCountry,
              trafficStore.selectedIndustry,
              trafficStore.selectedMonth,
              trafficStore.selectedDevice,
            ],
            () => {
              randomizeBenchmark()
              randomizeChange()
            },
            { immediate: true }
          ) -->
          <!-- Graphique à droite -->
          <div
            class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-6 md:mt-0 border border-[#E9F5E4] flex flex-col justify-center"
          >
            <div class="flex flex-col gap-4">
              <!-- Ligne 1 -->
              <div class="flex items-center gap-4">
                <span class="w-24 text-[#B9C7B3] text-xs font-medium">Overall</span>
                <div class="relative flex-1 flex items-center">
                  <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#E9F5E4] z-0"></div>
                  <!-- Partie négative -->
                  <div class="flex justify-end w-1/2 pr-2">
                    <div
                      v-if="changeData.overall < 0"
                      class="bg-[#6D9A7A] rounded-l-full h-6 flex items-center justify-end text-white text-xs px-4"
                      :style="{ width: (Math.abs(changeData.overall) / 20) * 100 + '%' }"
                    >
                      {{ changeData.overall }}%
                    </div>
                  </div>
                  <!-- Partie positive -->
                  <div class="w-1/2 pl-2 flex">
                    <div
                      v-if="changeData.overall > 0"
                      class="bg-[#2F654B] rounded-r-full h-6 flex items-center justify-start text-white text-xs px-4"
                      :style="{ width: (changeData.overall / 20) * 100 + '%' }"
                    >
                      +{{ changeData.overall }}%
                    </div>
                  </div>
                </div>
              </div>
              <!-- Ligne 2 -->
              <div class="flex items-center gap-4">
                <span class="w-24 text-[#B9C7B3] text-xs font-medium">Desktop</span>
                <div class="relative flex-1 flex items-center">
                  <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#E9F5E4] z-0"></div>
                  <!-- Partie négative -->
                  <div class="flex justify-end w-1/2 pr-2">
                    <div
                      v-if="changeData.desktop < 0"
                      class="bg-[#6D9A7A] rounded-l-full h-6 flex items-center justify-end text-white text-xs px-4"
                      :style="{ width: (Math.abs(changeData.desktop) / 20) * 100 + '%' }"
                    >
                      {{ changeData.desktop }}%
                    </div>
                  </div>
                  <!-- Partie positive -->
                  <div class="w-1/2 pl-2 flex">
                    <div
                      v-if="changeData.desktop > 0"
                      class="bg-[#2F654B] rounded-r-full h-6 flex items-center justify-start text-white text-xs px-4"
                      :style="{ width: (changeData.desktop / 20) * 100 + '%' }"
                    >
                      +{{ changeData.desktop }}%
                    </div>
                  </div>
                </div>
              </div>
              <!-- Ligne 3 -->
              <div class="flex items-center gap-4">
                <span class="w-24 text-[#B9C7B3] text-xs font-medium">Mobile</span>
                <div class="relative flex-1 flex items-center">
                  <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#E9F5E4] z-0"></div>
                  <!-- Partie négative -->
                  <div class="flex justify-end w-1/2 pr-2">
                    <div
                      v-if="changeData.mobile < 0"
                      class="bg-[#6D9A7A] rounded-l-full h-6 flex items-center justify-end text-white text-xs px-4"
                      :style="{ width: (Math.abs(changeData.mobile) / 20) * 100 + '%' }"
                    >
                      {{ changeData.mobile }}%
                    </div>
                  </div>
                  <!-- Partie positive -->
                  <div class="w-1/2 pl-2 flex">
                    <div
                      v-if="changeData.mobile > 0"
                      class="bg-[#2F654B] rounded-r-full h-6 flex items-center justify-start text-white text-xs px-4"
                      :style="{ width: (changeData.mobile / 20) * 100 + '%' }"
                    >
                      +{{ changeData.mobile }}%
                    </div>
                  </div>
                </div>
              </div>
              <!-- Ligne 4 -->
              <div class="flex items-center gap-4">
                <span class="w-24 text-[#B9C7B3] text-xs font-medium">Unpaid</span>
                <div class="relative flex-1 flex items-center">
                  <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#E9F5E4] z-0"></div>
                  <!-- Partie négative -->
                  <div class="flex justify-end w-1/2 pr-2">
                    <div
                      v-if="changeData.unpaid < 0"
                      class="bg-[#6D9A7A] rounded-l-full h-6 flex items-center justify-end text-white text-xs px-4"
                      :style="{ width: (Math.abs(changeData.unpaid) / 20) * 100 + '%' }"
                    >
                      {{ changeData.unpaid }}%
                    </div>
                  </div>
                  <!-- Partie positive -->
                  <div class="w-1/2 pl-2 flex">
                    <div
                      v-if="changeData.unpaid > 0"
                      class="bg-[#2F654B] rounded-r-full h-6 flex items-center justify-start text-white text-xs px-4"
                      :style="{ width: (changeData.unpaid / 20) * 100 + '%' }"
                    >
                      +{{ changeData.unpaid }}%
                    </div>
                  </div>
                </div>
              </div>
              <!-- Ligne 5 -->
              <div class="flex items-center gap-4">
                <span class="w-24 text-[#B9C7B3] text-xs font-medium">New</span>
                <div class="relative flex-1 flex items-center">
                  <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#E9F5E4] z-0"></div>
                  <!-- Partie négative -->
                  <div class="flex justify-end w-1/2 pr-2">
                    <div
                      v-if="changeData.new < 0"
                      class="bg-[#6D9A7A] rounded-l-full h-6 flex items-center justify-end text-white text-xs px-4"
                      :style="{ width: (Math.abs(changeData.new) / 20) * 100 + '%' }"
                    >
                      {{ changeData.new }}%
                    </div>
                  </div>
                  <!-- Partie positive -->
                  <div class="w-1/2 pl-2 flex">
                    <div
                      v-if="changeData.new > 0"
                      class="bg-[#2F654B] rounded-r-full h-6 flex items-center justify-start text-white text-xs px-4"
                      :style="{ width: (changeData.new / 10) * 100 + 5 + '%' }"
                    >
                      +{{ changeData.new }}%
                    </div>
                  </div>
                </div>
              </div>
              <!-- Ligne 6 -->
              <div class="flex items-center gap-4">
                <span class="w-24 text-[#B9C7B3] text-xs font-medium">Returning</span>
                <div class="relative flex-1 flex items-center">
                  <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#E9F5E4] z-0"></div>
                  <!-- Partie négative -->
                  <div class="flex justify-end w-1/2 pr-2">
                    <div
                      v-if="changeData.returning < 0"
                      class="bg-[#6D9A7A] rounded-l-full h-6 flex items-center justify-end text-white text-xs px-4"
                      :style="{ width: (Math.abs(changeData.returning) / 20) * 100 + '%' }"
                    >
                      {{ changeData.returning }}%
                    </div>
                  </div>
                  <!-- Partie positive -->
                  <div class="w-1/2 pl-2 flex">
                    <div
                      v-if="changeData.returning > 0"
                      class="bg-[#2F654B] rounded-r-full h-6 flex items-center justify-start text-white text-xs px-4"
                      :style="{ width: (changeData.returning / 20) * 100 + '%' }"
                    >
                      +{{ changeData.returning }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Graduation -->
            <div class="flex justify-between text-[#B9C7B3] text-xs mt-4 px-2 ml-24">
              <span>-20%</span>
              <span>-10%</span>
              <span>0%</span>
              <span>10%</span>
              <span>20%</span>
            </div>
          </div>
        </div>
        <!-- Nouveau bloc "Change - Traffic Share" -->
        <span
          class="bg-[#C1E3B1] text-[#43745D] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
        >
          Traffic share by major acquisition source
        </span>
        <div class="flex flex-col md:flex-row mt-8 reveal-up">
          <!-- Labels à gauche -->
          <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
            >
              <div class="text-gray-600 font-newedge pt-1 font-medium">
                Traffic share by acquisition channel<br />(YoY Variation)
              </div>
            </div>
          </div>
          <!-- Valeurs random pour le bloc Change - Traffic Share
          const trafficShareData = ref({
            direct: 0,
            display: 0,
            email: 0,
            organic_search: 0,
            organic_social: 0,
            paid_search: 0,
          })

          function randomizeTrafficShare() {
            // Chaque valeur entre 10% et 55%
            trafficShareData.value.direct = Math.floor(Math.random() * 46) + 10
            trafficShareData.value.display = Math.floor(Math.random() * 46) + 10
            trafficShareData.value.email = Math.floor(Math.random() * 46) + 10
            trafficShareData.value.organic_search = Math.floor(Math.random() * 46) + 10
            trafficShareData.value.organic_social = Math.floor(Math.random() * 46) + 10
            trafficShareData.value.paid_search = Math.floor(Math.random() * 46) + 10
          }

          watch(
            () => [
              trafficStore.selectedCountry,
              trafficStore.selectedIndustry,
              trafficStore.selectedMonth,
              trafficStore.selectedDevice,
            ],
            () => {
              randomizeBenchmark()
              randomizeChange()
              randomizeTrafficShare()
            },
            { immediate: true }
          ) -->
          <!-- Graphique à droite -->
          <div
            class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-6 md:mt-0 border border-[#E9F5E4] flex flex-col justify-center"
          >
            <div class="flex flex-col gap-4">
              <!-- Ligne 1 -->
              <div class="flex items-center gap-4">
                <span class="w-32 text-[#B9C7B3] text-xs font-medium">Direct</span>
                <div class="flex-1">
                  <div
                    class="bg-[#6D9A7A] h-6 rounded-r-full flex items-center text-white text-xs px-4"
                    :style="{ width: ((trafficShareData.direct - 10) / 45) * 100 + '%' }"
                  >
                    {{ trafficShareData.direct }}%
                  </div>
                </div>
              </div>
              <!-- Ligne 2 -->
              <div class="flex items-center gap-4">
                <span class="w-32 text-[#B9C7B3] text-xs font-medium">Display, ads, etc..</span>
                <div class="flex-1">
                  <div
                    class="bg-[#6D9A7A] h-6 rounded-r-full flex items-center text-white text-xs px-4"
                    :style="{ width: ((trafficShareData.display - 8) / 45) * 100 + '%' }"
                  >
                    {{ trafficShareData.display }}%
                  </div>
                </div>
              </div>
              <!-- Ligne 3 -->
              <div class="flex items-center gap-4">
                <span class="w-32 text-[#B9C7B3] text-xs font-medium">Email</span>
                <div class="flex-1">
                  <div
                    class="bg-[#6D9A7A] h-6 rounded-r-full flex items-center text-white text-xs px-4"
                    :style="{ width: ((trafficShareData.email - 8) / 45) * 100 + '%' }"
                  >
                    {{ trafficShareData.email }}%
                  </div>
                </div>
              </div>
              <!-- Ligne 4 -->
              <div class="flex items-center gap-4">
                <span class="w-32 text-[#B9C7B3] text-xs font-medium">Organic search</span>
                <div class="flex-1">
                  <div
                    class="bg-[#6D9A7A] h-6 rounded-r-full flex items-center text-white text-xs px-4"
                    :style="{ width: ((trafficShareData.organic_search - 8) / 45) * 100 + '%' }"
                  >
                    {{ trafficShareData.organic_search }}%
                  </div>
                </div>
              </div>
              <!-- Ligne 5 -->
              <div class="flex items-center gap-4">
                <span class="w-32 text-[#B9C7B3] text-xs font-medium">Organic social</span>
                <div class="flex-1">
                  <div
                    class="bg-[#6D9A7A] h-6 rounded-r-full flex items-center text-white text-xs px-4"
                    :style="{ width: ((trafficShareData.organic_social - 8) / 45) * 100 + '%' }"
                  >
                    {{ trafficShareData.organic_social }}%
                  </div>
                </div>
              </div>
              <!-- Ligne 6 -->
              <div class="flex items-center gap-4">
                <span class="w-32 text-[#B9C7B3] text-xs font-medium">Paid search</span>
                <div class="flex-1">
                  <div
                    class="bg-[#6D9A7A] h-6 rounded-r-full flex items-center text-white text-xs px-4"
                    :style="{ width: ((trafficShareData.paid_search - 8) / 45) * 100 + '%' }"
                  >
                    {{ trafficShareData.paid_search }}%
                  </div>
                </div>
              </div>
            </div>
            <!-- Graduation -->
            <div class="flex justify-between text-[#B9C7B3] text-xs mt-4 px-2 ml-32">
              <span>10%</span>
              <span>20%</span>
              <span>30%</span>
              <span>40%</span>
              <span>50%</span>
              <span>55%</span>
            </div>
          </div>
        </div>
        <!-- Nouveau bloc "Change - Traffic Share YoY" -->
        <span
          class="bg-[#C1E3B1] text-[#43745D] px-2 py-1 rounded-xl text-sm font-semibold mt-4 inline-block reveal-up"
        >
          Traffic share by acquisition channel YoY change
        </span>
        <div class="flex flex-col md:flex-row mt-8 reveal-up">
          <!-- Labels à gauche -->
          <div class="w-full md:w-1/3 flex flex-col items-start gap-10 justify-center">
            <div
              class="flex flex-row items-center justify-start gap-4 border-b border-[#E9F5E4] pb-4 w-full"
            >
              <div class="text-gray-600 font-newedge pt-1 font-medium">
                Traffic YoY Change by Acquisition Channel
              </div>
            </div>
          </div>
          <!-- Bloc custom à droite -->
          <div
            class="w-full bg-white rounded-xl shadow-sm p-6 h-auto md:w-2/3 mt-6 md:mt-0 border border-[#E9F5E4] flex flex-col justify-center"
          >
            <div class="flex flex-col gap-4">
              <div
                v-for="item in acquisitionChannelsData"
                :key="item.label"
                class="flex items-center gap-4"
              >
                <span class="w-40 text-[#B9C7B3] text-xs font-medium">{{ item.label }}</span>
                <div class="relative flex-1 flex items-center">
                  <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#E9F5E4] z-0"></div>
                  <!-- Partie négative -->
                  <div class="flex justify-end w-1/2 pr-2">
                    <div
                      v-if="item.values[1] < 0"
                      class="bg-[#6D9A7A] rounded-l-full h-6 flex items-center justify-end text-white text-sm px-4"
                      :style="{ width: (Math.abs(item.values[1]) / 10) * 100 + '%' }"
                    >
                      {{ item.values[1] }}%
                    </div>
                  </div>
                  <!-- Partie positive -->
                  <div class="w-1/2 pl-2 flex">
                    <div
                      v-if="item.values[1] > 0"
                      class="bg-[#2F654B] rounded-r-full h-6 flex items-center justify-start text-white text-xs px-4"
                      :style="{ width: (item.values[1] / 1) * 100 + '%' }"
                    >
                      +{{ item.values[1] }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Graduation -->
            <div class="flex justify-between text-[#B9C7B3] text-xs mt-4 px-2 ml-40">
              <span>-4%</span>
              <span>-2%</span>
              <span>0%</span>
              <span>2%</span>
              <span>4%</span>
              <span>8%</span>
              <span>12%</span>
              <span>16%</span>
            </div>
          </div>
        </div>
        <!-- Nouveau bloc "Change - Bounce rates" -->
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useTrafficDataStore } from '@/stores/trafficData'
import DataOverview from '@/components/DataOverview.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { LineChart } from '@/components/charts'
import { useGlobalFiltersStore } from '@/stores/globalFilters'

// Animation générale
useScrollReveal('.reveal-up', {
  origin: 'top',
  distance: '20px',
  delay: 150,
  interval: 100,
})

// Animation fade custom pour DataOverview
useScrollReveal('.reveal-fade', {
  distance: '20px',
  opacity: 0,
  duration: 700,
  delay: 50,
  scale: 1,
  easing: 'ease-in-out',
})

const trafficStore = useTrafficDataStore()
const globalFilters = useGlobalFiltersStore()

// Valeurs random pour le benchmark
const benchmarkData = ref({
  mobile: 0,
  desktop: 0,
  new: 0,
  returning: 0,
  paid: 0,
  unpaid: 0,
})

function randomizeBenchmark() {
  // Mobile/Desktop (somme = 100)
  benchmarkData.value.mobile = Math.floor(Math.random() * 61) + 20 // 20 à 80
  benchmarkData.value.desktop = 100 - benchmarkData.value.mobile

  // New/Returning (somme = 100)
  benchmarkData.value.new = Math.floor(Math.random() * 61) + 20
  benchmarkData.value.returning = 100 - benchmarkData.value.new

  // Paid/Unpaid (somme = 100)
  benchmarkData.value.paid = Math.floor(Math.random() * 41) + 10 // 10 à 50
  benchmarkData.value.unpaid = 100 - benchmarkData.value.paid
}

// Valeurs random pour le bloc Change
const changeData = ref({
  overall: 0,
  desktop: 0,
  mobile: 0,
  unpaid: 0,
  new: 0,
  returning: 0,
})

function randomizeChange() {
  // Toutes les valeurs : -20 à +20
  changeData.value.overall = Math.floor(Math.random() * 41) - 20
  changeData.value.desktop = Math.floor(Math.random() * 41) - 20
  changeData.value.mobile = Math.floor(Math.random() * 41) - 20
  changeData.value.unpaid = Math.floor(Math.random() * 41) - 20
  changeData.value.new = Math.floor(Math.random() * 41) - 20
  changeData.value.returning = Math.floor(Math.random() * 41) - 20
}

// Valeurs random pour le bloc Change - Traffic Share
const trafficShareData = ref({
  direct: 0,
  display: 0,
  email: 0,
  organic_search: 0,
  organic_social: 0,
  paid_search: 0,
})

function randomizeTrafficShare() {
  // Chaque valeur entre 10% et 55%
  trafficShareData.value.direct = Math.floor(Math.random() * 46) + 10
  trafficShareData.value.display = Math.floor(Math.random() * 46) + 10
  trafficShareData.value.email = Math.floor(Math.random() * 46) + 10
  trafficShareData.value.organic_search = Math.floor(Math.random() * 46) + 10
  trafficShareData.value.organic_social = Math.floor(Math.random() * 46) + 10
  trafficShareData.value.paid_search = Math.floor(Math.random() * 46) + 10
}

// Valeurs randomisées pour le bloc Change - Bounce rates
const bounceRatesData = ref({
  paid_search: 0,
  direct: 0,
  organic_search: 0,
  paid_social: 0,
  display: 0,
  email: 0,
})

function randomizeBounceRates() {
  // Chaque valeur entre 10% et 90%
  bounceRatesData.value.paid_search = Math.floor(Math.random() * 81) + 10
  bounceRatesData.value.direct = Math.floor(Math.random() * 81) + 10
  bounceRatesData.value.organic_search = Math.floor(Math.random() * 81) + 10
  bounceRatesData.value.paid_social = Math.floor(Math.random() * 81) + 10
  bounceRatesData.value.display = Math.floor(Math.random() * 81) + 10
  bounceRatesData.value.email = Math.floor(Math.random() * 81) + 10
}

// Points de base pour chaque courbe (Y)
const baseCurves = {
  byDevice: [180, 60, 120, 80, 200],
  newReturning: [200, 100, 120, 40, 120],
  paidUnpaid: [120, 220, 80, 110, 120, 160],
}

// Points randomisés
const curves = ref({
  byDevice: [...baseCurves.byDevice],
  newReturning: [...baseCurves.newReturning],
  paidUnpaid: [...baseCurves.paidUnpaid],
})

function randomizeCurves() {
  // Ajoute un offset aléatoire raisonnable à chaque point
  curves.value.byDevice = baseCurves.byDevice.map((y) => y + Math.floor(Math.random() * 21) - 10)
  curves.value.newReturning = baseCurves.newReturning.map(
    (y) => y + Math.floor(Math.random() * 21) - 10,
  )
  curves.value.paidUnpaid = baseCurves.paidUnpaid.map(
    (y) => y + Math.floor(Math.random() * 21) - 10,
  )
}

// Données pour le graphique Chart.js
const chartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'By Device',
      data: curves.value.byDevice.map((y) => Math.max(5, Math.min(100, 100 - y / 2))),
      borderColor: '#C1E3B1',
      backgroundColor: '#C1E3B1',
      tension: 0.4,
    },
    {
      label: 'New v. Returning',
      data: curves.value.newReturning.map((y) => Math.max(5, Math.min(100, 100 - y / 2))),
      borderColor: '#6D9A7A',
      backgroundColor: '#6D9A7A',
      tension: 0.4,
    },
    {
      label: 'Paid v. Unpaid',
      data: curves.value.paidUnpaid.map((y) => Math.max(5, Math.min(100, 100 - y / 2))),
      borderColor: '#2F654B',
      backgroundColor: '#2F654B',
      tension: 0.4,
    },
  ],
}))

// Données pour le graphique YoY par canal d'acquisition
const acquisitionChannelsData = ref<
  { label: string; values: number[]; display: (val: number) => string }[]
>([])

function randomizeAcquisitionChannelsData() {
  const channels = [
    { label: 'Direct (30%)' },
    { label: 'Organic Search (25%)' },
    { label: 'Paid Search (15%)' },
    { label: 'Email (8%)' },
    { label: 'Paid Social (6%)' },
    { label: 'Display & Ads (9%)' },
  ]
  acquisitionChannelsData.value = channels.map((c) => ({
    label: c.label,
    values: [0, Math.round(Math.random() * 20 - 4), 0],
    display: (val: number) => `${val > 0 ? '+' : ''}${val}%`,
  }))
}

// Initialisation immédiate
randomizeAcquisitionChannelsData()

// Synchronisation sur les filtres globaux
watch(
  [
    () => trafficStore.selectedCountry,
    () => trafficStore.selectedIndustry,
    () => trafficStore.selectedMonth,
    () => trafficStore.selectedDevice,
  ],
  () => {
    randomizeAcquisitionChannelsData()
  },
  { immediate: true },
)

// Valeur dynamique pour le header
const headerValue = ref(43.1)

function randomizeHeaderValue() {
  // Génère un pourcentage entre 20 et 70 avec une décimale
  headerValue.value = Math.round((Math.random() * 50 + 20) * 10) / 10
}

// Texte dynamique selon le mois sélectionné
enum HeaderText {
  ThisYear = 'This year',
  UpFromLastMonth = '⬆ Up from last month',
}
const headerText = computed(() =>
  globalFilters.selectedMonth === 'All Months' ? HeaderText.ThisYear : HeaderText.UpFromLastMonth,
)

// Randomise à chaque changement de filtre
watch(
  [
    () => trafficStore.selectedCountry,
    () => trafficStore.selectedIndustry,
    () => trafficStore.selectedMonth,
    () => trafficStore.selectedDevice,
  ],
  () => {
    randomizeBenchmark()
    randomizeChange()
    randomizeTrafficShare()
    randomizeBounceRates()
    randomizeCurves()
    randomizeHeaderValue()
  },
  { immediate: true },
)

// Charger les données initiales
trafficStore.fetchTrafficData()
</script>
