<template>
  <section class="section story-section" ref="storySectionRef">
    <h2 v-fade-in class="section-title story-main-title">故事简介</h2>
    <div class="story-content">
      <div
        v-for="(sentence, index) in storySentences"
        :key="index"
        :ref="el => { if (el) sentenceRefs[index] = el }"
        class="story-sentence"
        :class="{ 'highlighted': index === highlightedSentenceIndex }"
      >
        {{ sentence }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const fullStory = "周六放学的铃声响起，少年顾醒却发现自己被困在无限循环的教学楼中。他经历了作业被毁、求助无门、目睹霸凌等困境。当最终与被霸凌者产生共情时，顾醒在记忆闪回中发现自己也曾是施暴者。这场时空牢笼成为他直面内心、完成救赎的契机。";

const storySentences = ref([]);

const storySectionRef = ref(null);
const sentenceRefs = ref([]);

const highlightedSentenceIndex = ref(-1);

let observer = null;

let rafId = null;
let isPendingUpdate = false;

const splitSentences = () => {
  storySentences.value = fullStory.match(/[^。？！]+[。？！]?\s*/g) || [];
  storySentences.value = storySentences.value.map(s => s.trim());
  sentenceRefs.value = new Array(storySentences.value.length).fill(null);
};

const updateHighlight = () => {
  isPendingUpdate = false;

  const sectionElement = storySectionRef.value;
  const sentenceElements = sentenceRefs.value;

  if (!sectionElement || sentenceElements.length === 0) {
    rafId = null;
    return;
  }

  const sectionRect = sectionElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;

  if (sectionRect.bottom < 0 || sectionRect.top > viewportHeight) {
    highlightedSentenceIndex.value = -1;
    rafId = null;
    return;
  }

  let closestSentenceIndex = -1;
  let minDistance = Infinity;

  sentenceElements.forEach((sentenceEl, index) => {
    if (!sentenceEl) return;

    const rect = sentenceEl.getBoundingClientRect();
    const sentenceCenter = rect.top + rect.height / 2;
    const distance = Math.abs(sentenceCenter - viewportCenter);

    if (rect.bottom > 0 && rect.top < viewportHeight) {
      if (distance < minDistance) {
        minDistance = distance;
        closestSentenceIndex = index;
      }
    }
  });

  highlightedSentenceIndex.value = closestSentenceIndex;

  rafId = null;
};

const handleScroll = () => {
  if (!isPendingUpdate) {
    isPendingUpdate = true;
    rafId = requestAnimationFrame(updateHighlight);
  }
};

onMounted(() => {
  splitSentences();

  nextTick().then(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', handleScroll, { passive: true });
          handleScroll();
        } else {
          window.removeEventListener('scroll', handleScroll);
          if (rafId !== null) {
              cancelAnimationFrame(rafId);
              rafId = null;
              isPendingUpdate = false;
          }
          highlightedSentenceIndex.value = -1;
        }
      });
    }, observerOptions);

    if (storySectionRef.value) {
      observer.observe(storySectionRef.value);
    }
  });
});

onUnmounted(() => {
  if (observer && storySectionRef.value) {
    observer.unobserve(storySectionRef.value);
  }
  observer = null;

  window.removeEventListener('scroll', handleScroll);

  if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
      isPendingUpdate = false;
  }
});
</script>

<style scoped>
.story-section {
  background-color: #000;
  display: flex;
  flex-direction: column;
  align-items: center; 
  padding: 40px 10px;
  box-sizing: border-box;
  position: relative;
  min-height: 100vh; 
}

.story-main-title {
  background-color: #000;
  padding-bottom: 40px;
  z-index: 10;
  animation-delay: 0.1s;
  text-align: center;
  width: 100%;
  flex-shrink: 0;
}

.story-content {
  max-width: 900px;
  width: 80%;
  text-align: left;
  flex-grow: 1;
  overflow: visible;
}

.story-sentence {
  display: block;

  font-size: clamp(28px, 2.4vw, 48px);
  line-height: 1.8;
  color: var(--text-color-secondary);
  opacity: 0.4;
  transition: opacity 0.5s ease-in-out, color 0.5s ease-in-out;

  padding: 0;
}

.story-sentence:last-child {
  margin-bottom: 0;
}

.story-sentence.highlighted {
  font-weight: 700;
  color: var(--text-color-primary);
  opacity: 1;
}

@media (max-width: 768px) {
  .story-section {
    min-height: 120vh; 
  }
}
</style>