<template>
  <section class="section link-section" ref="linkSectionRef">
    <h2 class="section-title link-main-title" ref="titleRef">
      <span class="title-part light">无法逃离的</span>
      <span class="title-part bold">星期八</span>
    </h2>

    <div class="link-items-container">

      <div class="link-item-row">
        <p class="item-description content-text" ref="descriptionRef1">
          无法逃离的星期八微视频
        </p>

        <a
          href="https://www.bilibili.com/video/BV14iR4YvE9t"
          target="_blank"
          class="action-link play-link"
          aria-label="播放微视频"
          ref="playLinkRef"
        >
          <svg class="action-icon play-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19L19 12L8 5Z"/>
          </svg>
          <span class="action-text">立即播放</span>
        </a>
      </div>

      <div class="link-item-row">
         <p class="item-description content-text" ref="descriptionRef2">
          无法逃离的星期八互动游戏
        </p>

        <a
          href="https://excharlie.github.io/interactive_game/"
          target="_blank"
          class="action-link game-link"
          aria-label="立即跳转到互动游戏"
          ref="gameLinkRef"
        >
          <svg class="action-icon game-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 13V19C18 19.5523 17.5523 20 17 20H5C4.44772 20 4 19.5523 4 19V7C4 6.44772 4.44772 6 5 6H11M15 4H20V9M20 4L11 13"/>
          </svg>
          <span class="action-text">立即跳转</span>
        </a>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const linkSectionRef = ref(null);
const titleRef = ref(null);
const descriptionRef1 = ref(null);
const playLinkRef = ref(null);
const descriptionRef2 = ref(null);
const gameLinkRef = ref(null);

let rafId = null;
let isPendingUpdate = false;

const updateAnimation = () => {
  isPendingUpdate = false;

  const sectionElement = linkSectionRef.value;
  const elementsToAnimate = [
      titleRef.value,
      descriptionRef1.value,
      playLinkRef.value,
      descriptionRef2.value,
      gameLinkRef.value
  ].filter(el => el != null);

  if (!sectionElement || elementsToAnimate.length === 0) {
    rafId = null;
    return;
  }

  const sectionRect = sectionElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  const animationStart = viewportHeight * 0.8;
  const animationEnd = viewportHeight * 0.2;

  const sectionTop = sectionRect.top;

  let progress = 0;

  if (sectionTop >= animationStart) {
    progress = 0;
  } else if (sectionTop <= animationEnd) {
    progress = 1;
  } else {
    progress = (animationStart - sectionTop) / (animationStart - animationEnd);
    progress = Math.max(0, Math.min(1, progress));
  }

  const opacity = progress;
  const translateY = (1 - progress) * 50;
  const blur = (1 - progress) * 5;

  elementsToAnimate.forEach(el => {
    el.style.transition = 'none';
    el.style.opacity = opacity;
    el.style.transform = `translateY(${translateY}px)`;
    el.style.filter = `blur(${blur}px)`;
  });

  rafId = null;
};

const handleScroll = () => {
  if (!isPendingUpdate) {
    isPendingUpdate = true;
    rafId = requestAnimationFrame(updateAnimation);
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  requestAnimationFrame(() => {
       updateAnimation();
   });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);

  if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
      isPendingUpdate = false;
  }

  const elementsToReset = [
      titleRef.value,
      descriptionRef1.value,
      playLinkRef.value,
      descriptionRef2.value,
      gameLinkRef.value
  ].filter(el => el != null);

   elementsToReset.forEach(el => {
       if(el) {
           el.style.opacity = '';
           el.style.transform = '';
           el.style.filter = '';
           el.style.transition = '';
       }
   });
});
</script>

<style scoped>
:root {
  --sk-body-link-color: rgb(0,102,204);
  --text-color-primary: #fff;
  --text-color-secondary: #ccc;
}

.link-section {
  background-color: #000;
  color: var(--text-color-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.link-main-title {
   text-align: center;
   margin-bottom: 40px;
}

.title-part {
  font-family: "Helvetica Neue", Arial, sans-serif;
}

.title-part.light {
  font-weight: 100;
}

.title-part.bold {
  font-weight: 600;
}

.link-items-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 900px;
    width: 100%;
}

.link-item-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
}

.link-item-row[style*="flex-direction: column"], 
.link-item-row:has(.item-description:not(:only-child)) { 
}

@media (max-width: 768px) { 
    .link-item-row {
        flex-direction: row; 
        justify-content: space-between; 
        align-items: center; 
        text-align: left; 
    }
    .item-description {
        text-align: left; 
    }
}

.item-description {
    text-align: left;
    font-size: clamp(1.2rem, 2vw, 1.8rem);
    font-weight: 300;
    color: var(--text-color-secondary);
    flex-grow: 1;
    flex-basis: 0;
    min-width: 250px;
}

.action-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: var(--sk-body-link-color);
    font-size: clamp(1rem, 1.5vw, 1.2rem);
    font-weight: 400;
    border: 1px solid var(--sk-body-link-color);
    border-radius: 20px;
    cursor: pointer;
    flex-shrink: 0;
}

.action-link:hover {
    background-color: var(--sk-body-link-color);
    color: #fff;
    border-color: var(--sk-body-link-color);
    text-decoration: none;
}

.action-icon {
    width: 1em;
    height: 1em;
    margin-right: 8px;
}
</style>