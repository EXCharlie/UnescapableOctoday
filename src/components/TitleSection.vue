<template>
  <section class="section title-section" ref="titleSectionRef">
    <div class="video-background-container">
      <video
        ref="backgroundVideo"
        src="/video/background.mp4"
        autoplay
        loop
        muted
        playsinline
        class="background-video"
      ></video>
      <div class="video-blur-overlay" :style="{ backdropFilter: `blur(${videoBlurAmount}px)` }"></div>
    </div>

    <div
      class="title-content"
      ref="titleContentRef"
      :style="{
        top: titleTop,
        opacity: titleOpacity,
        filter: `blur(${titleBlur}px)`,
        pointerEvents: titleOpacity > 0.05 ? 'auto' : 'none'
      }"
    >
      <h1 class="main-title">
        <span class="font-light">无法逃离的</span>
        <span class="font-bold">星期八</span>
      </h1>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const titleSectionRef = ref(null);
const backgroundVideo = ref(null);
const titleContentRef = ref(null);

const videoBlurAmount = ref(0);
const maxVideoBlur = 15;

const titleOpacity = ref(0);
const titleBlur = ref(20);
const maxTextBlur = 20;
const titleTop = ref('50%');

const animationRangePercentage = 0.1;

const handleScroll = () => {
  if (!titleSectionRef.value || !titleContentRef.value) return;

  const section = titleSectionRef.value;
  const titleContent = titleContentRef.value;
  const rect = section.getBoundingClientRect();
  const sectionHeight = section.offsetHeight;
  const titleContentHeight = titleContent.offsetHeight;

  const scrollOutOfView = -rect.top;

  const videoBlurProgress = Math.min(scrollOutOfView / (sectionHeight * 0.75), 1);
  videoBlurAmount.value = videoBlurProgress * maxVideoBlur;

  const titleAnimationThreshold = sectionHeight * animationRangePercentage;
  const titleAnimationProgress = Math.max(0, Math.min(scrollOutOfView / titleAnimationThreshold, 1));

  titleOpacity.value = titleAnimationProgress;
  titleBlur.value = (1 - titleAnimationProgress) * maxTextBlur;

  if (titleBlur.value < 0.1) titleBlur.value = 0;
  if (titleOpacity.value > 0.99) titleOpacity.value = 1;

  let newTitleTop;

  if (scrollOutOfView <= 0) {
    const centerTopPx = sectionHeight * 0.5 - titleContentHeight * 0.5;
    newTitleTop = centerTopPx + 'px';
  } else {
    const initialCenterTopPx = sectionHeight * 0.5 - titleContentHeight * 0.5;
    const calculatedTopPx = initialCenterTopPx + scrollOutOfView;
    const maxTopPx = sectionHeight - titleContentHeight;
    newTitleTop = Math.min(calculatedTopPx, maxTopPx) + 'px';
  }

  titleTop.value = newTitleTop;
};

onMounted(() => {
  nextTick(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    if (backgroundVideo.value) {
      backgroundVideo.value.play().catch(error => {
        console.warn("Video autoplay was prevented:", error);
      });
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.title-section {
  color: var(--text-color-primary);
  position: relative;
  height: var(--section-height);
  background-color: #000;
  overflow: hidden;
}

.video-background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.video-blur-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  transition: backdrop-filter 0.1s ease-out;
  z-index: 2;
}

.title-content {
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 50px;
  transition: top 0.3s ease-out, opacity 0.3s ease-out, filter 0.3s ease-out;
}

.main-title {
  font-size: clamp(2rem, 8vw, 6rem);
  text-shadow: 0px 0px 20px rgba(0, 0, 0, 0.7);
  margin: 0;
  padding: 0 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .main-title {
    font-size: clamp(2rem, 15vw, 6rem);
    align-items: flex-start;
    display: flex;
    flex-direction: column;
  }
}
.font-light {
  font-weight: 100;
}

.font-bold {
  font-weight: 600;
}
</style>