<template>
  <div class="container">
    <h1 class="title">
      About Us
    </h1>
    <NGrid :cols="2">
      <n-grid-item>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac orci vestibulum, fermentum lorem accumsan,
          aliquet turpis. Donec lectus diam, tincidunt ut eleifend et, dignissim at ipsum. Integer interdum luctus
          sapien, in finibus leo condimentum lobortis. Sed nibh mauris, semper at magna sit amet, ornare pulvinar
          mauris. Duis fermentum, mauris at tristique volutpat, metus enim accumsan augue, ut semper urna ipsum et
          nisl. Sed non commodo elit. Vestibulum lacinia leo facilisis libero faucibus ullamcorper quis nec eros.
          Nulla vitae eleifend elit. Sed lacinia pellentesque quam a ultrices. Nam nisi neque, tincidunt in varius
          sed, tempor quis est. Suspendisse odio leo, pellentesque dictum mattis sed, tincidunt nec nunc. Vivamus id
          rhoncus mi. Integer ac finibus nunc. Etiam eget euismod nisl. Aliquam non tempus nisi, a gravida magna. Morbi
          vitae tellus nisl.
        </p>
        <h1>Policy</h1>
        <ul>
          <li>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">RPI TV CONSITUTION</a>
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Rensselaer Union Media Statement</a>
          </li>
        </ul>
      </n-grid-item>
      <n-grid-item class="video-flex">
        <iframe class="player" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" allowfullscreen/>
      </n-grid-item>
    </NGrid>
    <h1>Our Team</h1>
    <ul>
      <h2>Leadership</h2>
      <n-grid :cols="3">
        <n-grid-item v-for="officer in leadershipRole.result.value?.findManyRole">
          <Person :role="officer"/>
        </n-grid-item>
      </n-grid>
    </ul>
    <ul>
      <h2>Members</h2>
      <n-grid :cols="3">
        <n-grid-item v-for="member in memberRole.result.value?.findManyRole">
          <Person :role="member"/>
        </n-grid-item>
      </n-grid>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { NGrid, NGridItem } from "naive-ui";
import Person from "@/components/Person.vue";
import { useQuery } from "@vue/apollo-composable";
import { FindAllMembersDocument, OrderDirection, RoleOrderableFields } from "@/graphql/types";

const leadershipRole = useQuery(FindAllMembersDocument, {
  filter: {
    displayInLeadership: {
      equals: true
    }
  },
  order: {
    field: RoleOrderableFields.Priority,
    direction: OrderDirection.Desc
  }
});

const memberRole = useQuery(FindAllMembersDocument, {
  filter: {
    displayInMembership: {
      equals: true
    }
  },
  order: {
    field: RoleOrderableFields.Priority,
    direction: OrderDirection.Desc
  }
});

console.log(memberRole);

</script>

<style scoped lang="scss">
.video-flex {
  display: flex;
  justify-content: center;
}
.player {
  aspect-ratio: 16 / 9;
  height: 80%;
  width: 80%;
  border: 0px;
}
a {
  text-decoration: underline;
}

</style>
