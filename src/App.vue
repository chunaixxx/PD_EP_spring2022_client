<template>
	<div>
		<router-view />
	</div>
</template>

<script>
export default {
	name: 'App',

	data: () => ({
		//
	}),
}
</script>

<style lang="sass">
html
    overflow-y: auto !important

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button
  -webkit-appearance: none
  margin: 0

input[type=number]
  -moz-appearance: textfield
</style>
