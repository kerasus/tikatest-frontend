import { ref, shallowRef } from 'vue'
import FormBuilderInput from 'components/controls/formBuilderCustomInput/FormBuilderInput.vue'

const FormBuilderInputComponent = shallowRef(FormBuilderInput)

const typeOptions = [
  { label: 'مدرسه', value: 'school' },
  { label: 'موسسه', value: 'institute' }
]

export function getInputs () {
  return [
    {
      type: 'hidden',
      name: 'id',
      responseKey: 'id'
    },
    {
      type: 'file',
      name: 'logo',
      responseKey: 'logo',
      label: 'تصویر لوگو',
      placeholder: 'فایل لوگو را انتخاب کنید',
      col: 'col-md-3 col-12'
    },
    {
      type: 'space',
      name: 'space',
      responseKey: 'space',
      col: 'col-12'
    },
    {
      type: FormBuilderInputComponent,
      name: 'name',
      responseKey: 'name',
      label: 'نام مدرسه',
      placeholder: ' ',
      rules: 'required',
      col: 'col-12'
    },
    {
      type: 'select',
      name: 'type',
      responseKey: 'type',
      label: 'نوع',
      rules: 'required',
      options: typeOptions,
      col: 'col-md-4 col-12'
    },
    {
      type: FormBuilderInputComponent,
      name: 'slug',
      responseKey: 'slug',
      label: 'نامک',
      class: 'ltr',
      rules: 'required',
      hint: 'کاراکتر های انگلیسی و بدون فاصله ثبت شود',
      col: 'col-md-4 col-12'
    },
    {
      type: FormBuilderInputComponent,
      name: 'website',
      responseKey: 'website',
      label: 'وب‌سایت',
      class: 'ltr',
      clearable: true,
      hint: 'مثال: https://school.example.com',
      col: 'col-md-4 col-12'
    },
    {
      type: FormBuilderInputComponent,
      name: 'address',
      responseKey: 'address',
      inputType: 'textarea',
      label: 'آدرس',
      placeholder: ' ',
      col: 'col-12'
    }
  ]
}
