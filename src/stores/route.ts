import { defineStore } from "pinia";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useRouteStore = defineStore("route", () => {
  const hasSwitchedRoutes = ref<boolean>(false);
  const route = useRoute();
  const router = useRouter();

  /**
   * Go to the parent route of the current route. We attempt to do this by looking at the breadcrumb metadata of the
   *  current route, and if possible, we go to the route before the last one in the breadcrumb. If we can't do this,
   *  we just go back one page (equivalent to pressing back button in the browser).
   */
  function goToParent() {
    const metaBreadcrumb = route.meta?.breadcrumb;
    let breadcrumbValue;
    if (!metaBreadcrumb) {
      router.go(-1);
      return;
    } else if (typeof metaBreadcrumb === "function") {
      breadcrumbValue = metaBreadcrumb(route);
    } else if (Array.isArray(metaBreadcrumb)) {
      breadcrumbValue = metaBreadcrumb;
    } else {
      throw new Error(
        "Breadcrumb metadata value must be of the type () => {name: string, route: RouteLocationRaw}[] | {name: string, route: RouteLocationRaw}[]."
      );
    }

    if (breadcrumbValue.length < 2) {
      router.go(-1);
      return;
    }
    const parentRoute = breadcrumbValue[breadcrumbValue.length - 2];
    if (parentRoute.route) {
      router.push(parentRoute.route);
    } else {
      router.go(-1);
    }
  }

  return {
    hasSwitchedRoutes,
    goToParent,
  };
});
