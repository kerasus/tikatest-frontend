<script setup lang="ts">
import { ref } from 'vue'
import Portlet from 'src/components/cards/portlet.vue'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import ProductPartAPI, { type ProductParRequirementType } from 'src/repositories/productPart'

const emit = defineEmits(['remove'])

const props = defineProps<{
  productPartId: number,
  requirements: ProductParRequirementType[],
  editMode: boolean
}>()

const productPartAPI = new ProductPartAPI()
const loading = ref(false)

async function removeRequirement (requirement: ProductParRequirementType) {
  if (!props.productPartId) {
    return
  }

  try {
    loading.value = true
    await productPartAPI.removeRequirement(props.productPartId, requirement.id)
  } finally {
    loading.value = false
    emit('remove')
  }
}
</script>

<template>
  <portlet title="لیست نیازمندی ها">
    <q-list
      bordered
      separator
      class="role-list full-width">
      <q-linear-progress
        v-if="loading"
        indeterminate />
      <template v-else>
        <q-item
          v-for="(requirement, requirementIndex) in requirements"
          :key="requirementIndex"
          v-ripple
          clickable
          class="role-item">
          <q-item-section>
            <q-item-label>
              {{ requirement.required_item.name }}
              -
              {{ requirement.quantity }}
              {{ requirement.unit }}
            </q-item-label>
            <q-item-label caption>
              {{ requirement.required_item_type_label }}
            </q-item-label>
          </q-item-section>
          <q-item-section
            v-if="editMode"
            side>
            <div>
              <delete-btn
                :row="requirement"
                :loading="loading"
                :change-status-promise="removeRequirement"
                :use-flag="false" />
            </div>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </portlet>
</template>

<style scoped lang="scss">

</style>
