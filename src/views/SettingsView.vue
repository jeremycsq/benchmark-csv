<template>
  <div class="settings-page bg-white min-h-screen">
    <main class="flex max-w-5xl mx-auto p-16 gap-16">
      <!-- Colonne gauche -->
      <aside class="w-1/4 flex flex-col items-start">
        <img src="@/assets/logo_bcg.svg" alt="BCG Logo" class="h-10 mb-4" />
        <p class="text-gray-600 text-sm text-left">
          Nous sommes un partenaire de confiance des dix plus grands fonds de private equity et
          investisseurs tech.
        </p>
      </aside>
      <!-- Colonne centrale -->
      <section class="flex-1 bg-white rounded-xl">
        <div class="flex items-start gap-6 mb-6">
          <div class="flex flex-row items-center justify-between w-full">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              class="w-16 h-16 rounded-full object-cover mb-2"
            />
            <button
              class="px-3 py-1 uppercase tracking-wide font-semibold rounded border text-xs text-gray-400 border-gray-300 hover:bg-gray-100"
            >
              Update Avatar
            </button>
          </div>
        </div>
        <div class="flex items-start gap-6 mb-6">
          <div class="flex flex-row items-center justify-between w-full">
            <div class="flex flex-col w-full">
              <h2 class="text-3xl font-newedge">Benjamin Entraygues</h2>
              <h3 class="text-gray-400 text-sm">
                Managing Director & Senior Partner; Global Leader, <br />Principal Investors and
                Private Equity Practice
              </h3>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <div class="mb-6">
            <label
              for="email"
              class="block text-xs tracking-wide uppercase font-light text-gray-400 mb-1"
              >Email</label
            >
            <input
              id="email"
              type="email"
              class="input w-full border rounded-3xl px-3 py-2"
              value="benjamin.entraygues@bcg.com"
            />
          </div>
          <div class="mb-8">
            <label
              for="phone"
              class="block text-xs tracking-wide uppercase font-light text-gray-400 mb-1"
              >Phone</label
            >
            <input
              id="phone"
              type="text"
              class="input w-full border rounded-3xl px-3 py-2"
              value="+1 222 354 845"
            />
          </div>
          <div class="mb-8">
            <label
              for="company"
              class="block text-xs tracking-wide uppercase font-light text-gray-400 mb-1"
              >Company</label
            >
            <input
              id="company"
              type="text"
              class="input w-full border rounded-3xl px-3 py-2"
              value="BCG"
            />
          </div>
          <div class="mb-8">
            <label
              for="phone"
              class="block text-xs tracking-wide uppercase font-light text-gray-400 mb-1"
              >Password</label
            >
            <input
              id="password"
              type="password"
              class="input w-full border rounded-3xl px-3 py-2"
              value="********"
            />
          </div>
        </div>
        <div class="mb-6">
          <h3 class="text-sm tracking-wide uppercase font-light text-gray-400 mb-2">
            Subscription
          </h3>
          <div class="flex items-center">
            <span class="text-sm">Vous utilisez le plan premium. 10 / 2500</span>
          </div>
        </div>
        <div>
          <h3 class="text-gray-400 text-xs mb-2">API</h3>
          <span class="text-green-600 font-medium">Connecté</span>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
// Pas de logique complexe pour cette page statique
</script>
