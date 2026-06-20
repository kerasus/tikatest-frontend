<script setup lang="ts">
import { ref } from 'vue'
import Portlet from 'src/components/cards/portlet.vue'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import ProductAPI, { type ProductRequirementType } from 'src/repositories/product'

const emit = defineEmits(['remove'])

const props = defineProps<{
  productId: number,
  requirements: ProductRequirementType[],
  editMode: boolean
}>()

const productAPI = new ProductAPI()
const loading = ref(false)

async function removeRequirement (requirement: ProductRequirementType) {
  if (!props.productId) {
    return
  }

  try {
    loading.value = true
    await productAPI.removeRequirement(props.productId, requirement.id)
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
