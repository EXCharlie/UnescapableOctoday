<template>
  <section class="section production-section" ref="productionSectionRef">
    <h2 class="section-title" ref="titleRef">制作单位</h2>
    <p class="production-team content-text" ref="teamNameRef">高二8班（2026届）</p>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const productionSectionRef = ref(null);
const titleRef = ref(null);
const teamNameRef = ref(null);

let rafId = null;
let isPendingUpdate = false;

const updateAnimation = () => {
  isPendingUpdate = false;

  const sectionElement = productionSectionRef.value;
  const titleElement = titleRef.value;
  const teamNameElement = teamNameRef.value;

  if (!sectionElement || !titleElement || !teamNameElement) {
    rafId = null;
    return;
  }

  const sectionRect = sectionElement.getBoundingClientRect();
  const teamNameRect = teamNameElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;

  const standardAnimStart = viewportHeight * 0.8;
  const standardAnimEnd = viewportHeight * 0.2;

  const sectionTop = sectionRect.top;
  let standardProgress = 0;

  if (sectionTop >= standardAnimStart) {
    standardProgress = 0;
  } else if (sectionTop <= standardAnimEnd) {
    standardProgress = 1;
  } else {
    standardProgress = (standardAnimStart - sectionTop) / (standardAnimStart - standardAnimEnd);
    standardProgress = Math.max(0, Math.min(standardProgress, 1));
  }

  const opacity = standardProgress;
  const translateY = (1 - standardProgress) * 50;
  const blur = (1 - standardProgress) * 5;

  const elementsForStandardAnim = [titleElement, teamNameElement];

  elementsForStandardAnim.forEach(el => {
    el.style.transition = 'none';
    el.style.opacity = opacity;
    el.style.transform = `translateY(${translateY}px)`;
    el.style.filter = `blur(${blur}px)`;
  });

  const teamNameCenter = teamNameRect.top + teamNameRect.height / 2;
  const distanceToCenter = Math.abs(teamNameCenter - viewportCenter);

  const maxGlowDistance = 250;

  let glowProgress = 0;

  if (distanceToCenter >= maxGlowDistance) {
    glowProgress = 0;
  } else {
    glowProgress = 1 - (distanceToCenter / maxGlowDistance);
    glowProgress = Math.max(0, Math.min(glowProgress, 1));
  }

  if (glowProgress > 0) {
    const glowAlpha = glowProgress * 0.8;
    const glowColor = `rgba(255, 255, 255, ${glowAlpha})`;
    teamNameElement.style.textShadow = `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor}`;
  } else {
    teamNameElement.style.textShadow = 'none';
  }

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

  const elementsToReset = [titleRef.value, teamNameRef.value].filter(el => el !== null);
  elementsToReset.forEach(el => {
    if(el) {
       el.style.opacity = '';
       el.style.transform = '';
       el.style.filter = '';
       el.style.transition = '';
    }
  });
  if(teamNameRef.value) {
      teamNameRef.value.style.textShadow = '';
  }
});
</script>

<style scoped>
.production-section {
  background-color: #000;
  color: var(--text-color-primary, #fff);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  min-height: 80vh;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.section-title {
    text-align: center;
    margin-bottom: 40px;
}

.production-team {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 700;
  color: white;
  text-align: center;
  transition: text-shadow 0.3s ease-out; 
}
</style>