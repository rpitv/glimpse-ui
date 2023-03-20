<template>
  <div class="container">
    <h1 class="title">
      About Us
    </h1>
    <NGrid cols="1 800:2">
      <n-grid-item>
        <p class="info">
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
      </n-grid-item>
      <n-grid-item class="video-flex">
        <iframe class="player" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" allowfullscreen/>
      </n-grid-item>
    </NGrid>
    <h1>Policy</h1>
    <ul>
      <li>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">RPI TV CONSITUTION</a>
      </li>
      <li>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Rensselaer Union Media Statement</a>
      </li>
    </ul>
    <h1>Our Team</h1>
    <ul>
      <h2>Leadership</h2>
      <n-grid cols="1 500:2 750:3 1000:4 1250:5 1500:6">
        <n-grid-item v-for="leader in leadershipPeople">
          <PersonCard :person="leader" :displayed-role="leader.displayedRole"/>
        </n-grid-item>
      </n-grid>
    </ul>
    <ul>
      <h2>Members</h2>
      <n-grid cols="1 500:2 750:3 1000:4 1250:5 1500:6">
        <n-grid-item v-for="member in membershipPeople">
          <PersonCard :person="member" :displayed-role="member.displayedRole"/>
        </n-grid-item>
      </n-grid>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { NGrid, NGridItem } from "naive-ui";
import PersonCard from "@/components/PersonCard.vue";
import { useQuery } from "@vue/apollo-composable";
import { FindAboutPageMembersDocument, Person } from "@/graphql/types";
import { computed } from "vue";

const leadershipRoles = useQuery(FindAboutPageMembersDocument, {
  filter: {
    displayInLeadership: {
      equals: true
    }
  }
});

const membershipRoles = useQuery(FindAboutPageMembersDocument, {
  filter: {
    displayInMembership: {
      equals: true
    }
  }
});

// leadershipPeople is a mutated form of leadershipRoles which has all the people in the given roles, with the role
//  name attached to each person in the "displayedRole" field. Order is maintained.
const leadershipPeople = computed<(Person & { displayedRole?: string | null })[]>(() => {
  // If the query hasn't finished yet or there are no roles, return an empty list
  if (!leadershipRoles.result.value?.findManyRole) {
    return [];
  }
  // Otherwise, reduce the list of roles to a list of all the people in those roles, with the role name attached
  //  to each person in the "displayedRole" field. The same person cannot be in the list twice.
  return leadershipRoles.result.value.findManyRole.reduce<(Person & { displayedRole?: string | null })[]>((acc, role) => {
    for (const personRole of role.people ?? []) {
      // Filter out people who we couldn't retrieve from the API, and people who are already in the list
      if (!personRole?.person || acc.findIndex(p => p.id === personRole?.person?.id) !== -1) {
        continue;
      }
      acc.push({
        displayedRole: role.name,
        ...personRole.person
      });
    }
    return acc;
  }, []);
});

// membershipPeople is a mutated form of membershipRoles which has all the people in the given roles, with the role
//  name attached to each person in the "displayedRole" field. Order is maintained.
const membershipPeople = computed<(Person & { displayedRole?: string | null })[]>(() => {
  // If the query hasn't finished yet or there are no roles, return an empty list
  if(!membershipRoles.result.value?.findManyRole) {
    return [];
  }
  // Otherwise, reduce the list of roles to a list of all the people in those roles, with the role name attached
  //  to each person in the "displayedRole" field. The same person cannot be in the list twice.
  return membershipRoles.result.value.findManyRole.reduce<(Person & { displayedRole?: string | null })[]>((acc, role) => {
    for(const personRole of role.people ?? []) {
      // Filter out people who we couldn't retrieve from the API, and people who are already in the list
      if (!personRole?.person || acc.findIndex(p => p.id === personRole?.person?.id) !== -1) {
          continue;
      }
      acc.push({
        displayedRole: role.name,
        ...personRole.person
      });
    }
    return acc;
  }, []);
})

</script>

<style scoped lang="scss">
.info {
  width: 95%;
}
.video-flex {
  display: flex;
  justify-content: center;
}
.player {
  aspect-ratio: 16 / 9;
  height: 100%;
  width: 100%;
  border: 0px;
}
a {
  text-decoration: underline;
}

</style>
