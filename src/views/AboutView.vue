<template>
  <div class="container">
    <h1 class="title">
      About Us
    </h1>
    <n-grid x-gap="10" :cols="2">
      <n-grid-item>
        <p class="info">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac orci vestibulum, fermentum lorem accumsan,
          aliquet turpis. Donec lectus diam, tincidunt ut eleifend et, dignissim at ipsum. Integer interdum luctus
          sapien, in finibus leo condimentum lobortis. Sed nibh mauris, semper at magna sit amet, ornare pulvinar
          mauris. Duis fermentum, mauris at tristique volutpat, metus enim accumsan augue, ut semper urna ipsum et
          nisl.
        </p>
      </n-grid-item>
      <n-grid-item>
        <iframe class="player" src="https://www.youtube.com/embed/MfzmM3EFqIY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </n-grid-item>
    </n-grid>
    <h1>
      Policy
    </h1>
    <ul>
      <li>RPI TV Constitution</li>
      <li>Rensselaer Union Media Statement</li>
    </ul>
    <h1>Our Team</h1>
    <h2>
      <ul>Leadership
      <div v-for="person in persons.result.value.findManyPerson">
        <PersonDisplay role="president" :name="person.name" />
      </div>
      </ul>
      <ul>Members</ul>
    </h2>
  </div>
</template>

<script setup lang="ts">
import {NGrid, NGridItem} from "naive-ui";
import {useQuery} from "@vue/apollo-composable";
import gql from "graphql-tag"
import PersonDisplay from "@/components/PersonDisplay.vue";

const persons = useQuery(gql`
    query MyQuery {
      findManyPerson {
        roles {
          name
          priority
        }
        name
      }
    }`);

console.log(persons.result.value.findManyPerson);
</script>

<style scoped lang="scss">

.info {
  width: 95%;
}

.player {
  aspect-ratio: 16/9;
  width: 90%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

</style>
