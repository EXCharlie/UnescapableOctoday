<template>
  <div id="app-container">
    <TitleSection id="title-section" />
    <ProductionSection id="production-section" />
    <StorySection id="story-section" />
    <LinkSection id="link-section" />
    <!-- <Character1Section id="character-section" /> -->
  </div>
</template>

<script setup>
import TitleSection from './components/TitleSection.vue';
import ProductionSection from './components/ProductionSection.vue';
import StorySection from './components/StorySection.vue';
import LinkSection from './components/LinkSection.vue';
//import Character1Section from './components/Character1Section.vue';


</script>

<style scoped>
#app-container {
  width: 100%;
  overflow-x: hidden; 
  overflow-y: auto; 
}

/* Apple's website often uses a technique where sections snap.
  While true scroll snapping can be complex with dynamic content heights or specific scroll effects,
  ensuring each section is 100vh and content is centered gives a similar feel.
  For actual scroll snapping, you might explore CSS Scroll Snap properties on #app-container
  if the design allows for it without conflicting with other scroll-based animations.
  e.g.,
  #app-container {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: 100vh;
  }
  .section {
    scroll-snap-align: start;
  }
  However, this can interfere with fine-grained scroll animations like the blur effect.
  For this implementation, we'll rely on distinct 100vh sections.
*/
</style>
