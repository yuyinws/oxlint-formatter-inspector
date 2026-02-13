<template>
  <div class="logo w-90 h-25 relative">
    <u-icon name="custom:logo" class="w-86 ml-1 h-full"></u-icon>
  </div>
</template>

<style>
@import '@/assets/css/main.css';

.logo::before {
  position: absolute;
  content: '';
  background-image: url('@/assets/images/oxc-bg.png');
  content: '';
  z-index: -2;
  background-color: #ccc;
  background-position: 50%;
  background-size: 150% 150%;
  border-radius: calc(0.5rem + 3px);
  transition: all 0.2s ease-in-out;
  animation: 16s ease-in-out infinite move-background;
  position: absolute;
  inset: -7px;
}

.logo::after {
  position: absolute;
  content: '';
  background: #000;
  z-index: -1;
  border-radius: 0.5rem;
  transition: all 0.3s ease-in-out;
  position: absolute;
  inset: 0;
}

@keyframes move-background {
  0%,
  to {
    background-position: 40% 40%;
  }

  50% {
    background-position: 60% 60%;
  }
}
</style>
