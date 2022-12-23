<template>
  <section class="mt-8 px-4">
    <Input label="Nama Rekening" input_class="w-4/6" class="mb-2.5" />
    <Input
      type="number"
      label="No. Rekening"
      input_class="w-4/6"
      class="mb-2.5"
    />
    <Input label="Nama Bank" input_class="w-4/6" class="mb-2.5" />
    <div class="flex justify-end w-full">
      <Button class="bg-primary text-white w-24 text-sm rounded py-2">
        Save
      </Button>
    </div>
  </section>
</template> 

<script>
import Input from "./Input.vue";
import Button from "./Button.vue";

export default {
  name: "ExperienceComponent",
  components: { Input, Button },
};
</script>

<style scoped>
</style>