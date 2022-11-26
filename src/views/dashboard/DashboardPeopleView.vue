<template>
  <div class="wrapper">
    <div>
      <CMSItemTable
        type-name="Person"
        :fields="tableFields"
        :data="tableData"
        :creatable="ability.can(AbilityActions.Create, AbilitySubjects.Person)"
        v-model:page-size="tablePageSize"
        v-model:current-page="tableCurrentPage"
        :total-items="people.result.value?.userCount ?? 0"
        :loading="people.loading.value"
        @create="create"
      >
        <template #header>
          <DashboardBreadcrumb :route="breadcrumbRoute"/>
        </template>
      </CMSItemTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import {NInput, NAutoComplete, NDatePicker, useMessage} from "naive-ui";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb.vue";
import CMSItemTable from "@/components/dashboard/CMSItemTable.vue";
import type {CMSField, CMSItem, DeepPartial} from "@/util/helper";
import type {Person, PersonUpdateInput} from "@/graphql/types";
import {computed, h, ref, Ref} from "vue";
import moment from "moment";
import {useMutation, useQuery} from "@vue/apollo-composable";
import {
  AbilityActions, AbilitySubjects, CreateNewPersonDocument,
  DeletePersonDocument, EditPersonDocument, GetAllPeopleDocument
} from "@/graphql/types";
import {useGlimpseAbility} from "@/casl";
import {subject} from "@casl/ability";
import type {RowData} from "naive-ui/es/data-table/src/interface";

const breadcrumbRoute = [
  {name: 'Dashboard', route: '/dashboard'},
  {name: 'People', route: '/dashboard/people'}
];

const tablePageSize = ref<number>(20);
const tableCurrentPage = ref<number>(1);

const ability = useGlimpseAbility();
const message = useMessage();
const updateMut = useMutation(EditPersonDocument);
updateMut.onDone(() => {
  people.refetch();
});
updateMut.onError((error) => {
  console.error(error);
  message.error('Failed to update person');
});
const deleteMut = useMutation(DeletePersonDocument);
deleteMut.onDone(() => {
  people.refetch();
});
deleteMut.onError((error) => {
  console.error(error);
  message.error('Failed to delete person');
});
const createMut = useMutation(CreateNewPersonDocument);
createMut.onDone(() => {
  people.refetch();
});
createMut.onError((error) => {
  console.error(error);
  message.error('Failed to create person');
});
const getAllPeopleArgs = computed(() => {
  return {
    pagination: {
      take: tablePageSize.value,
      skip: (tableCurrentPage.value - 1) * tablePageSize.value
    }
  }
})
const people = useQuery(GetAllPeopleDocument, getAllPeopleArgs);
people.onError((error) => {
  console.error(error);
  message.error('Failed to fetch people');
});

const tableFields: CMSField<Person>[] = [
  {
    name: 'ID',
    key: 'id',
    readable: true,
    creatable: false,
    editable: false
  },
  {
    name: 'Name',
    key: 'name',
    readable: true,
    creatable: true,
    editable: true,
    renderEditInput: () => {
      return h(NInput, {maxlength: 100});
    },
    rules: [
      {required: true, message: 'Name is required', trigger: ['blur', 'input']},
      {max: 100, message: 'Name must be at most 100 characters', trigger: ['blur', 'input']}
    ]
  },
  {
    name: 'Pronouns',
    key: 'pronouns',
    readable: true,
    creatable: true,
    editable: true,
    renderEditInput: () => {
      return h(NAutoComplete, {options: ['he/him', 'she/her', 'they/them']});
    },
    rules: [
      {max: 20, message: 'Pronouns must be at most 20 characters', trigger: ['blur', 'input']}
    ]
  },
  {
    name: 'Graduation',
    key: 'graduation',
    readable: true,
    creatable: true,
    editable: true,
    renderEditInput: () => {
      return h(NDatePicker, {type: 'date', clearable: true});
    },
    renderTableCell(row: RowData) {
      return row.graduation ? h('span', {}, moment(row.graduation).format('YYYY-MM-DD')) : '';
    },
    inputValueTransformer(value: string): number|null {
      return value ? new Date(value).getTime() : null;
    },
    outputValueTransformer(value: number): string|null {
      return value ? new Date(value).toISOString() : null;
    }
  },
  {
    name: 'Start Date',
    key: 'start',
    readable: true,
    creatable: true,
    editable: true,
    renderEditInput: () => {
      return h(NDatePicker, {type: 'date'});
    },
    renderTableCell(row: RowData) {
      return h('span', {}, moment(row.start).format('YYYY-MM-DD'));
    },
    inputValueTransformer(value: string): number|null {
      return value ? new Date(value).getTime() : null;
    },
    outputValueTransformer(value: number): string|null {
      return value ? new Date(value).toISOString() : null;
    },
    rules: [
      {required: true, message: 'Start date is required', trigger: ['blur', 'input']}
    ]
  },
  {
    name: 'End Date',
    key: 'end',
    readable: true,
    creatable: true,
    editable: true,
    renderEditInput: () => {
      return h(NDatePicker, {type: 'date', clearable: true});
    },
    renderTableCell(row: RowData) {
      return row.end ? h('span', {}, moment(row.end).format('YYYY-MM-DD')) : '';
    },
    inputValueTransformer(value: string): number|null {
      return value ? new Date(value).getTime() : null;
    },
    outputValueTransformer(value: number): string|null {
      return value ? new Date(value).toISOString() : null;
    }
  },
  {
    name: 'Description',
    key: 'description',
    readable: false,
    creatable: true,
    editable: true,
    renderEditInput: () => {
      return h(NInput, {type: 'textarea'});
    }
  },
]

const tableData: Ref<CMSItem<Person>[]> = computed(() => {
  return people.result.value?.GetAllPeople.map((person): CMSItem<Person> => {
    return {
      id: person.id,
      data: {...person},
      editable: ability.can(AbilityActions.Update, subject(AbilitySubjects.Person, {...person})),
      deletable: ability.can(AbilityActions.Delete, subject(AbilitySubjects.Person, {...person})),
      edit(data: DeepPartial<Person>) {
        if (data.name === person.name) {
          delete data.name;
        }
        if (data.pronouns === person.pronouns) {
          delete data.pronouns;
        }
        if (data.graduation === person.graduation) {
          delete data.graduation;
        }
        if (data.start === person.start) {
          delete data.start;
        }
        if (data.end === person.end) {
          delete data.end;
        }
        if (data.description === person.description) {
          delete data.description;
        }
        const inputData: PersonUpdateInput = {
          name: data.name ?? undefined,
          pronouns: data.pronouns ?? undefined,
          graduation: data.graduation,
          start: data.start ?? undefined,
          end: data.end,
          description: data.description ?? undefined,
        }
        updateMut.mutate({
          id: person.id,
          input: inputData
        });
      },
      delete() {
        deleteMut.mutate({id: person.id});
      },
      deleteMessage() {
        return `Are you sure you want to delete Person "${person.name}"? This is irreversible.`
      }
    }
  }) ?? [];
});

function create(data: any) {
  createMut.mutate({
    input: {
      name: data.name,
      pronouns: data.pronouns ?? undefined,
      graduation: data.graduation ?? undefined,
      start: data.start ?? undefined,
      end: data.end ?? undefined,
      description: data.description ?? undefined,
    }
  });
}

</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  justify-content: center;

  & > div {
    width: 80%;
  }

  margin-top: 5em;
  margin-bottom: 5em;
}
</style>
