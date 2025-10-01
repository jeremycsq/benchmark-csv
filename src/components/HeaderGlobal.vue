<template>
  <header
    ref="headerRef"
    :class="[
      'bg-white border-b border-gray-200 shadow-sm',
      $route.path === '/admin' ? '' : 'sticky top-0 z-50',
    ]"
  >
    <div
      v-if="$route.path === '/settings'"
      class="max-w-12xl mx-auto px-4 py-4 flex items-center justify-between gap-4"
    >
      <!-- Logo à gauche -->
      <div class="flex items-center">
        <img
          alt="Vue logo"
          class="h-10 w-10 cursor-pointer"
          src="@/assets/logo.svg"
          @click="$router.push('/traffic')"
        />
      </div>
      <!-- Texte centré -->
      <div class="flex-1 flex justify-center">
        <span class="text-sm font-newedge">Your Workspace Settings</span>
      </div>
      <!-- Avatar à droite -->
      <div class="flex items-center gap-4">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Avatar"
          class="w-6 h-6 rounded-full object-cover cursor-pointer"
          @click="$router.push('/settings')"
        />
      </div>
    </div>
    <!-- Header normal pour les pages autres que admin -->
    <div
      v-else-if="$route.path !== '/admin'"
      class="max-w-12xl mx-auto px-4 py-4 flex items-center justify-between gap-4"
    >
      <!-- Logo à gauche -->
      <div class="flex items-center">
        <svg class="h-6 w-auto" viewBox="0 0 74 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.28842 1.10585C7.66924 1.10585 9.29054 2.61833 9.29054 4.47862V4.68312H7.68984V4.25359C7.68984 3.33371 7.25895 2.74111 6.19182 2.74111H4.24228C3.33926 2.74111 2.62097 3.47701 2.62097 4.35584V7.25841C2.62097 8.15777 3.33926 8.89367 4.24228 8.89367H6.19182C7.27956 8.89367 7.71045 8.42347 7.71045 7.36066V6.95204H9.31115V7.19721C9.31115 8.87315 7.75129 10.5289 5.28842 10.5289C2.82554 10.5289 0.793945 8.42347 0.793945 5.80713C0.793564 3.23146 2.82554 1.10585 5.28842 1.10585ZM1.40919 18.7661L3.00988 18.7455V19.4404C3.00988 19.9106 3.33812 20.2375 3.83084 20.2375H6.90934C7.40207 20.2375 7.7303 19.9106 7.7303 19.4404V19.2359C7.7303 18.7657 7.50436 18.6228 7.15552 18.5205L3.3385 17.376C2.41487 17.0897 1.5733 16.4561 1.5733 15.1276V15.0865C1.5733 13.5946 2.98927 12.4907 5.34948 12.4907C7.91503 12.4907 9.24894 13.717 9.24894 15.475V15.6179H7.64824V14.9432C7.64824 14.473 7.34024 14.1461 6.82729 14.1461H3.91328C3.42056 14.1461 3.09232 14.473 3.09232 14.9432V15.2907C3.09232 15.6993 3.29766 15.8833 3.76978 16.0266L7.15628 17.0282C8.44936 17.4166 9.2497 17.9887 9.2497 19.3176C9.2497 20.7894 7.83373 21.8929 5.4323 21.8929C2.74387 21.8929 1.40957 20.5845 1.40957 18.9086V18.7661H1.40919ZM11.7122 5.80675C11.7122 3.23146 13.7442 1.10547 16.2067 1.10547C18.6902 1.10547 20.7011 3.23108 20.7011 5.80675C20.7011 8.42309 18.6898 10.5286 16.2067 10.5286C13.7438 10.5286 11.7122 8.42309 11.7122 5.80675ZM16.1861 12.5318C18.6695 12.5318 20.6603 14.6372 20.6603 17.2125C20.6603 18.2548 20.2088 19.3587 19.4905 20.1968C19.4493 20.2379 19.4493 20.3196 19.4905 20.3603L20.5576 21.5253C20.5782 21.5459 20.5782 21.5865 20.5782 21.607C20.5782 21.6682 20.537 21.7298 20.455 21.7298H16.1861C13.7232 21.7298 11.7118 19.6244 11.7118 17.2125C11.7122 14.6372 13.7236 12.5318 16.1861 12.5318ZM15.1189 20.1151H17.3971L16.1658 18.7049L17.1715 17.8055L18.3413 19.0728C18.4028 19.134 18.4848 19.1751 18.5673 19.1751C18.7314 19.1751 18.8753 19.0523 18.8753 18.8683V15.7612C18.8753 14.8619 18.157 14.126 17.254 14.126H15.1197C14.2167 14.126 13.4984 14.8619 13.4984 15.7612V18.4798C13.4976 19.3792 14.2159 20.1151 15.1189 20.1151ZM15.1601 8.89329H17.2742C18.1772 8.89329 18.8955 8.15739 18.8955 7.25803V4.35546C18.8955 3.47663 18.1772 2.74073 17.2742 2.74073H15.1601C14.2571 2.74073 13.5388 3.47663 13.5388 4.35546V7.25803C13.5388 8.15739 14.2571 8.89329 15.1601 8.89329ZM23.5541 1.28983H24.9086L28.4592 6.52251C28.6233 6.76768 28.8287 6.86993 29.0134 6.86993C29.2596 6.86993 29.4649 6.68596 29.4649 6.35906L29.4443 1.28983H30.9629V10.3446H29.6084L26.017 5.07084C25.8734 4.84581 25.6681 4.74394 25.4834 4.74394C25.2372 4.74394 25.0319 4.94845 25.0319 5.25482V10.3446H23.5541V1.28983ZM33.3029 1.28983H41.9434V2.51608H39.2958C38.7622 2.51608 38.3722 2.90456 38.3722 3.43596V10.3446H36.8944V3.43596C36.8944 2.90456 36.5043 2.51608 35.9707 2.51608H33.3025V1.28983H33.3029ZM44.5292 1.28983H50.9736V2.51608H46.91C46.3764 2.51608 45.9864 2.90456 45.9864 3.43596V4.15134C45.9864 4.68274 46.3764 5.07122 46.91 5.07122H50.4194V6.21575H46.0066V9.11832H51.1991V10.3446H44.5292V1.28983ZM44.5292 12.6747H48.9416C50.5014 12.6747 51.4865 13.8192 51.4865 15.0865C51.4865 15.9448 51.035 16.4766 50.727 16.7625C50.5835 16.9054 50.5011 17.0076 50.5011 17.1304C50.5011 17.2327 50.5831 17.3554 50.7064 17.4573C51.1167 17.7842 51.322 18.1727 51.322 18.7858V21.7291H49.824L49.8446 18.7448C49.8446 18.254 49.5164 17.9271 49.0236 17.9271H46.8069C46.3348 17.9271 46.0066 18.254 46.0066 18.7448V21.7291H44.5288V12.6747H44.5292ZM46.8482 16.7834H48.1821C49.1263 16.7834 49.8648 16.3337 49.8648 15.2914C49.8648 14.3103 49.1259 13.9013 48.1821 13.9013H46.8482C46.376 13.9013 46.0066 14.2693 46.0066 14.7596V15.9247C46.0066 16.3949 46.376 16.7834 46.8482 16.7834ZM54.7497 1.28983H56.1043L59.6549 6.52251C59.819 6.76768 60.0243 6.86993 60.2091 6.86993C60.4552 6.86993 60.6606 6.68596 60.6606 6.35906L60.64 1.28983H62.1586V10.3446H60.8041L57.2126 5.07084C57.0691 4.84581 56.8638 4.74394 56.679 4.74394C56.4329 4.74394 56.2275 4.94845 56.2275 5.25482V10.3446H54.7497V1.28983ZM64.4367 1.28983H73.1593V2.51608H70.4296C69.8961 2.51608 69.506 2.90456 69.506 3.43596V10.3446H68.0282V3.43596C68.0282 2.90456 67.6381 2.51608 67.1046 2.51608H64.4364V1.28983H64.4367ZM54.7497 12.6747H61.1941V13.9009H57.1306C56.597 13.9009 56.2069 14.2894 56.2069 14.8208V15.5362C56.2069 16.0676 56.597 16.4561 57.1306 16.4561H60.64V17.6006H56.2275V20.5032H61.4201V21.7294H54.7501V12.6747H54.7497ZM38.3718 12.6751H36.9352L33.1796 21.7294H34.7395L35.6833 19.4404H39.6236L40.5675 21.7294H42.1274L38.3718 12.6751ZM36.1555 18.2959L37.202 15.5978C37.4073 15.0869 37.8997 15.0869 38.105 15.5978L39.1515 18.2959H36.1555ZM23.5545 12.6751H25.0319V18.8273C25.0319 19.8289 25.8528 20.2375 26.5093 20.2375H27.8638C28.7054 20.2375 29.4851 19.7878 29.4851 18.8273V12.6751H30.9626V18.5821C30.9626 20.4013 29.526 21.8728 27.2482 21.8728C24.9701 21.8728 23.5541 20.4013 23.5541 18.5821V12.6751H23.5545Z"
            :fill="logoColor"
          />
        </svg>
      </div>
      <!-- Selects custom centrés -->
      <div class="flex flex-wrap items-center gap-2 justify-center">
        <CustomSelect
          :label="globalFilters.selectedCountry"
          icon="globe"
          :options="globalFilters.countryOptions"
          @change="handleCountryChange"
        />
        <span class="text-gray-200 text-sm">/</span>
        <CustomSelect
          :label="globalFilters.selectedIndustry"
          icon="tag"
          :options="globalFilters.industryOptions"
          @change="handleIndustryChange"
        />
        <span class="text-gray-200 text-sm">/</span>
        <CustomSelect
          :label="globalFilters.selectedMonth"
          icon="calendar"
          :options="globalFilters.monthOptions"
          @change="handleMonthChange"
        />
        <span class="text-gray-200 text-sm">/</span>
        <CustomSelect
          :label="globalFilters.selectedDevice"
          icon="devices"
          :options="globalFilters.deviceOptions"
          @change="handleDeviceChange"
        />
        <span class="text-gray-200 text-sm">/</span>
        <CustomSelect
          :label="globalFilters.selectedVisitorType"
          icon="users"
          :options="globalFilters.visitorTypeOptions"
          @change="handleVisitorTypeChange"
        />

        <button
          class="font-semibold px-4 py-2 rounded transition-all duration-300"
          :class="{
            'bg-[#8D0A38] text-white hover:bg-[#72082C]': $route.path === '/traffic',
            'bg-[#2E614F] text-white hover:bg-[#1F4A3A]': $route.path === '/engagement',
            'bg-[#EB6909] text-white hover:bg-[#C15607]': $route.path === '/frustration',
            'bg-gradient-to-r from-[#0A95B3] to-[#0EA9CC] text-white hover:from-[#086C82] hover:to-[#068DAB]':
              $route.path === '/conversion',
          }"
          @click="showDownloadModal = true"
        >
          {{
            $route.path === '/traffic'
              ? 'Download Traffic'
              : $route.path === '/engagement'
                ? 'Download Engagement'
                : $route.path === '/frustration'
                  ? 'Download Frustration'
                  : 'Download Conversion'
          }}
        </button>
      </div>
      <!-- Bouton et avatar à droite -->
      <div class="flex items-center gap-4">
        <button
          @click="handleLogout"
          class="text-sm text-gray-500 hover:text-red-600 transition-colors"
          title="Se déconnecter"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
        </button>
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Avatar"
          class="w-6 h-6 rounded-full object-cover cursor-pointer"
          @click="$router.push('/settings')"
        />
      </div>
    </div>

    <!-- Header simplifié pour la page admin -->
    <div v-else class="max-w-12xl mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo à gauche -->
      <div class="flex items-center">
        <svg class="h-6 w-auto" viewBox="0 0 74 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.28842 1.10585C7.66924 1.10585 9.29054 2.61833 9.29054 4.47862V4.68312H7.68984V4.25359C7.68984 3.33371 7.25895 2.74111 6.19182 2.74111H4.24228C3.33926 2.74111 2.62097 3.47701 2.62097 4.35584V7.25841C2.62097 8.15777 3.33926 8.89367 4.24228 8.89367H6.19182C7.27956 8.89367 7.71045 8.42347 7.71045 7.36066V6.95204H9.31115V7.19721C9.31115 8.87315 7.75129 10.5289 5.28842 10.5289C2.82554 10.5289 0.793945 8.42347 0.793945 5.80713C0.793564 3.23146 2.82554 1.10585 5.28842 1.10585ZM1.40919 18.7661L3.00988 18.7455V19.4404C3.00988 19.9106 3.33812 20.2375 3.83084 20.2375H6.90934C7.40207 20.2375 7.7303 19.9106 7.7303 19.4404V19.2359C7.7303 18.7657 7.50436 18.6228 7.15552 18.5205L3.3385 17.376C2.41487 17.0897 1.5733 16.4561 1.5733 15.1276V15.0865C1.5733 13.5946 2.98927 12.4907 5.34948 12.4907C7.91503 12.4907 9.24894 13.717 9.24894 15.475V15.6179H7.64824V14.9432C7.64824 14.473 7.34024 14.1461 6.82729 14.1461H3.91328C3.42056 14.1461 3.09232 14.473 3.09232 14.9432V15.2907C3.09232 15.6993 3.29766 15.8833 3.76978 16.0266L7.15628 17.0282C8.44936 17.4166 9.2497 17.9887 9.2497 19.3176C9.2497 20.7894 7.83373 21.8929 5.4323 21.8929C2.74387 21.8929 1.40957 20.5845 1.40957 18.9086V18.7661H1.40919ZM11.7122 5.80675C11.7122 3.23146 13.7442 1.10547 16.2067 1.10547C18.6902 1.10547 20.7011 3.23108 20.7011 5.80675C20.7011 8.42309 18.6898 10.5286 16.2067 10.5286C13.7438 10.5286 11.7122 8.42309 11.7122 5.80675ZM16.1861 12.5318C18.6695 12.5318 20.6603 14.6372 20.6603 17.2125C20.6603 18.2548 20.2088 19.3587 19.4905 20.1968C19.4493 20.2379 19.4493 20.3196 19.4905 20.3603L20.5576 21.5253C20.5782 21.5459 20.5782 21.5865 20.5782 21.607C20.5782 21.6682 20.537 21.7298 20.455 21.7298H16.1861C13.7232 21.7298 11.7118 19.6244 11.7118 17.2125C11.7122 14.6372 13.7236 12.5318 16.1861 12.5318ZM15.1189 20.1151H17.3971L16.1658 18.7049L17.1715 17.8055L18.3413 19.0728C18.4028 19.134 18.4848 19.1751 18.5673 19.1751C18.7314 19.1751 18.8753 19.0523 18.8753 18.8683V15.7612C18.8753 14.8619 18.157 14.126 17.254 14.126H15.1197C14.2167 14.126 13.4984 14.8619 13.4984 15.7612V18.4798C13.4976 19.3792 14.2159 20.1151 15.1189 20.1151ZM15.1601 8.89329H17.2742C18.1772 8.89329 18.8955 8.15739 18.8955 7.25803V4.35546C18.8955 3.47663 18.1772 2.74073 17.2742 2.74073H15.1601C14.2571 2.74073 13.5388 3.47663 13.5388 4.35546V7.25803C13.5388 8.15739 14.2571 8.89329 15.1601 8.89329ZM23.5541 1.28983H24.9086L28.4592 6.52251C28.6233 6.76768 28.8287 6.86993 29.0134 6.86993C29.2596 6.86993 29.4649 6.68596 29.4649 6.35906L29.4443 1.28983H30.9629V10.3446H29.6084L26.017 5.07084C25.8734 4.84581 25.6681 4.74394 25.4834 4.74394C25.2372 4.74394 25.0319 4.94845 25.0319 5.25482V10.3446H23.5541V1.28983ZM33.3029 1.28983H41.9434V2.51608H39.2958C38.7622 2.51608 38.3722 2.90456 38.3722 3.43596V10.3446H36.8944V3.43596C36.8944 2.90456 36.5043 2.51608 35.9707 2.51608H33.3025V1.28983H33.3029ZM44.5292 1.28983H50.9736V2.51608H46.91C46.3764 2.51608 45.9864 2.90456 45.9864 3.43596V4.15134C45.9864 4.68274 46.3764 5.07122 46.91 5.07122H50.4194V6.21575H46.0066V9.11832H51.1991V10.3446H44.5292V1.28983ZM44.5292 12.6747H48.9416C50.5014 12.6747 51.4865 13.8192 51.4865 15.0865C51.4865 15.9448 51.035 16.4766 50.727 16.7625C50.5835 16.9054 50.5011 17.0076 50.5011 17.1304C50.5011 17.2327 50.5831 17.3554 50.7064 17.4573C51.1167 17.7842 51.322 18.1727 51.322 18.7858V21.7291H49.824L49.8446 18.7448C49.8446 18.254 49.5164 17.9271 49.0236 17.9271H46.8069C46.3348 17.9271 46.0066 18.254 46.0066 18.7448V21.7291H44.5288V12.6747H44.5292ZM46.8482 16.7834H48.1821C49.1263 16.7834 49.8648 16.3337 49.8648 15.2914C49.8648 14.3103 49.1259 13.9013 48.1821 13.9013H46.8482C46.376 13.9013 46.0066 14.2693 46.0066 14.7596V15.9247C46.0066 16.3949 46.376 16.7834 46.8482 16.7834ZM54.7497 1.28983H56.1043L59.6549 6.52251C59.819 6.76768 60.0243 6.86993 60.2091 6.86993C60.4552 6.86993 60.6606 6.68596 60.6606 6.35906L60.64 1.28983H62.1586V10.3446H60.8041L57.2126 5.07084C57.0691 4.84581 56.8638 4.74394 56.679 4.74394C56.4329 4.74394 56.2275 4.94845 56.2275 5.25482V10.3446H54.7497V1.28983ZM64.4367 1.28983H73.1593V2.51608H70.4296C69.8961 2.51608 69.506 2.90456 69.506 3.43596V10.3446H68.0282V3.43596C68.0282 2.90456 67.6381 2.51608 67.1046 2.51608H64.4364V1.28983H64.4367ZM54.7497 12.6747H61.1941V13.9009H57.1306C56.597 13.9009 56.2069 14.2894 56.2069 14.8208V15.5362C56.2069 16.0676 56.597 16.4561 57.1306 16.4561H60.64V17.6006H56.2275V20.5032H61.4201V21.7294H54.7501V12.6747H54.7497ZM38.3718 12.6751H36.9352L33.1796 21.7294H34.7395L35.6833 19.4404H39.6236L40.5675 21.7294H42.1274L38.3718 12.6751ZM36.1555 18.2959L37.202 15.5978C37.4073 15.0869 37.8997 15.0869 38.105 15.5978L39.1515 18.2959H36.1555ZM23.5545 12.6751H25.0319V18.8273C25.0319 19.8289 25.8528 20.2375 26.5093 20.2375H27.8638C28.7054 20.2375 29.4851 19.7878 29.4851 18.8273V12.6751H30.9626V18.5821C30.9626 20.4013 29.526 21.8728 27.2482 21.8728C24.9701 21.8728 23.5541 20.4013 23.5541 18.5821V12.6751H23.5545Z"
            :fill="logoColor"
          />
        </svg>
      </div>

      <!-- Titre au centre -->
      <div class="flex-1 flex justify-center">
        <h1 class="text-xl font-semibold text-gray-800">Admin Panel</h1>
      </div>

      <!-- Actions à droite -->
      <div class="flex items-center gap-4">
        <button
          @click="$router.push('/traffic')"
          class="bg-[#8D0A38] text-white py-2 px-4 rounded-md hover:bg-[#72082C] transition-colors font-medium text-sm"
        >
          See CSQ Data
        </button>
        <button
          @click="handleLogout"
          class="text-sm text-red-600 hover:text-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
  <nav
    v-if="$route.path !== '/settings' && $route.path !== '/admin'"
    class="sticky z-30 mx-auto px-4 p-2 flex space-x-8 text-gray-500 text-sm justify-center backdrop-blur-md bg-white/70 bg-gradient-to-b from-white/80 to-white/40"
    ref="navRef"
    :style="{ top: `${navTop}px` }"
  >
    <RouterLink
      to="/traffic"
      class="py-3 font-medium transition-colors"
      :class="{
        'text-[#8D0A38]': $route.path === '/traffic',
        'text-gray-400 hover:text-[#8D0A38]': $route.path !== '/traffic',
      }"
    >
      Traffic
    </RouterLink>
    <RouterLink
      to="/engagement"
      class="py-3 font-medium transition-colors"
      :class="{
        'text-[#2E614F]': $route.path === '/engagement',
        'text-gray-400 hover:text-[#2E614F]': $route.path !== '/engagement',
      }"
    >
      Engagement
    </RouterLink>
    <RouterLink
      to="/frustration"
      class="py-3 font-medium transition-colors"
      :class="{
        'text-[#EB6909]': $route.path === '/frustration',
        'text-gray-400 hover:text-[#EB6909]': $route.path !== '/frustration',
      }"
    >
      Frustration
    </RouterLink>
    <RouterLink
      to="/conversion"
      class="py-3 font-medium transition-colors"
      :class="{
        'text-[#119DBC]': $route.path === '/conversion',
        'text-gray-400 hover:text-[#119DBC]': $route.path !== '/conversion',
      }"
    >
      Conversion
    </RouterLink>
  </nav>
  <DownloadModal
    :open="showDownloadModal"
    :sections="downloadSections"
    :title="downloadModalTitle"
    :theme="downloadModalTheme"
    @close="showDownloadModal = false"
    @confirm="handleDownloadConfirm"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import CustomSelect from './CustomSelect.vue'
import { useSupabase } from '../composables/useSupabase'
import { useTrafficDataStore } from '../stores/trafficData'
import { useEngagementDataStore } from '../stores/engagementData'
import DownloadModal from '@/components/DownloadModal.vue'
import { useGlobalFiltersStore } from '@/stores/globalFilters'
import { useConversionDataStore } from '../stores/conversionData'
import { useAuth } from '../composables/useAuth'

const isSticky = ref(false)
const navRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const navTop = ref(0)

// État de connexion Supabase
const isConnected = ref(false)
const isChecking = ref(true)

// Store des données de trafic
const trafficStore = useTrafficDataStore()
const engagementStore = useEngagementDataStore()
const conversionStore = useConversionDataStore()

// Les options sont maintenant gérées par le store globalFilters

// Les données sont maintenant chargées via le store globalFilters

// Vérifier la connexion Supabase
const checkSupabaseConnection = async () => {
  try {
    isChecking.value = true
    const { supabase } = useSupabase()

    // Test simple de connexion en récupérant la session
    const { error } = await supabase.auth.getSession()

    if (error) {
      console.error('Erreur de connexion Supabase:', error)
      isConnected.value = false
    } else {
      isConnected.value = true
      console.log('✅ Connecté à Supabase')
    }
  } catch (err) {
    console.error('Erreur lors de la vérification Supabase:', err)
    isConnected.value = false
  } finally {
    isChecking.value = false
  }
}

function updateNavTop() {
  if (headerRef.value) {
    navTop.value = headerRef.value.offsetHeight
  }
}

function handleScroll() {
  const header = headerRef.value
  if (!header || !navRef.value) return
  const headerRect = header.getBoundingClientRect()
  isSticky.value = headerRect.bottom <= 0
}

function handleCountryChange(value: string) {
  const country = value === 'All Countries' ? '' : value
  globalFilters.setCountry(value)
  if (route.path === '/traffic') {
    trafficStore.updateFilters({ country })
  } else if (route.path === '/engagement') {
    engagementStore.setCountry(value)
  } else if (route.path === '/conversion') {
    conversionStore.setCountry(value)
  }
}

const globalFilters = useGlobalFiltersStore()
const { logout } = useAuth()

function handleMonthChange(value: string) {
  globalFilters.setMonth(value)
  if (route.path === '/traffic') {
    trafficStore.updateFilters({ month: value })
  } else if (route.path === '/engagement') {
    engagementStore.setMonth(value)
  } else if (route.path === '/conversion') {
    conversionStore.setMonth(value)
  }
}

function handleDeviceChange(value: string) {
  const device = value === 'All Devices' ? '' : value
  globalFilters.setDevice(value)
  if (route.path === '/traffic') {
    trafficStore.updateFilters({ device })
  } else if (route.path === '/engagement') {
    engagementStore.setDevice(value)
  } else if (route.path === '/conversion') {
    conversionStore.setDevice(value)
  }
}

function handleIndustryChange(value: string) {
  const industry = value === 'All Industries' ? '' : value
  globalFilters.setIndustry(value)
  if (route.path === '/traffic') {
    trafficStore.updateFilters({ industry })
  } else if (route.path === '/engagement') {
    engagementStore.setIndustry(value)
  } else if (route.path === '/conversion') {
    conversionStore.setIndustry(value)
  }
}

function handleVisitorTypeChange(value: string) {
  globalFilters.setVisitorType(value)
  // Pour l'instant, on ne fait que stocker la valeur dans le store global
  // Les composants peuvent utiliser globalFilters.selectedVisitorType pour filtrer
}

const showDownloadModal = ref(false)
const route = useRoute()
const downloadSectionsMap = {
  '/traffic': [
    { label: 'Overview', value: 'overview' },
    { label: 'Traffic share by types', value: 'traffic_share' },
    { label: 'Change by type', value: 'change_type' },
    { label: 'Traffic share by acquisition source', value: 'acquisition_share' },
  ],
  '/engagement': [
    { label: 'Overview', value: 'overview' },
    { label: 'Benchmark', value: 'benchmark' },
  ],
  '/frustration': [
    { label: 'Overview', value: 'overview' },
    { label: 'Benchmark', value: 'benchmark' },
  ],
  '/conversion': [
    { label: 'Overview', value: 'overview' },
    { label: 'Benchmark', value: 'benchmark' },
  ],
}
const downloadSections = computed(
  () => downloadSectionsMap[route.path as keyof typeof downloadSectionsMap] || [],
)
const downloadModalTitle = computed(() => {
  if (route.path === '/traffic') return 'Download Traffic Data'
  if (route.path === '/engagement') return 'Download Engagement Data'
  if (route.path === '/frustration') return 'Download Frustration Data'
  if (route.path === '/conversion') return 'Download Conversion Data'
  return 'Download Data'
})
const downloadModalTheme = computed(() => {
  if (route.path === '/traffic') return 'traffic'
  if (route.path === '/engagement') return 'engagement'
  if (route.path === '/frustration') return 'frustration'
  if (route.path === '/conversion') return 'conversion'
  return 'traffic'
})

// Couleur du logo selon la page
const logoColor = computed(() => {
  if (route.path === '/traffic') return '#8D0A38'
  if (route.path === '/engagement') return '#2E614F'
  if (route.path === '/frustration') return '#EB6909'
  if (route.path === '/conversion') return '#0A95B3'
  return '#8D0A38' // Par défaut, couleur traffic
})
function handleDownloadConfirm(selected: string[]) {
  // Ici tu fais ce que tu veux avec les sections sélectionnées
  console.log('Sections à télécharger :', selected)
}

function handleLogout() {
  logout()
  window.location.href = '/'
}

onMounted(() => {
  updateNavTop()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', updateNavTop)
  nextTick(updateNavTop)

  // Vérifier la connexion Supabase au montage
  checkSupabaseConnection()

  // Initialiser les données via le store globalFilters
  globalFilters.initializeData()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateNavTop)
})
</script>
