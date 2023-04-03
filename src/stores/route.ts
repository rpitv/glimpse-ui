import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useRouteStore = defineStore("route", () => {
  const route = useRoute();
  const router = useRouter();

  const hasSwitchedRoutes = ref<boolean>(false);

  /**
   * Go to the parent route of the current route. We attempt to use the parentRoute value, but if it is null, we
   *  fall back to using the router's go(-1) method.
   */
  async function goToParent() {
    const parent = parentRoute.value;
    if (parent) {
      await router.push(parent);
    } else {
      router.go(-1);
    }
  }

  /**
   * Parent route is computed by looking at a few different values, in the following order:
   *  1. The breadcrumb metadata of the current route. If present, and if there is a parent breadcrumb value, we use that.
   *  2. The matched routes of the current route. If there is a parent route, we use that.
   *  3. The back page in the history state. If there is a back page, and it is a page within our Vue app, we use that.
   *  4. If none of the above are present, we return null.
   */
  const parentRoute = computed(() => {
    let routeBreadcrumb = route.meta?.breadcrumb;
    if (typeof routeBreadcrumb === "function") {
      routeBreadcrumb = routeBreadcrumb(route);
    }
    if (Array.isArray(routeBreadcrumb) && routeBreadcrumb.length >= 2) {
      return router.resolve(routeBreadcrumb[routeBreadcrumb.length - 2].route);
    }

    const routeMatches = route.matched;
    if (routeMatches.length >= 2) {
      return routeMatches[routeMatches.length - 2];
    }

    if (typeof router.options.history.state.back === "string") {
      const backPage = router.resolve(router.options.history.state.back);
      if (backPage.name !== "404") {
        return backPage;
      }
    }

    return null;
  });

  return {
    hasSwitchedRoutes,
    goToParent,
    parentRoute,
  };
});
