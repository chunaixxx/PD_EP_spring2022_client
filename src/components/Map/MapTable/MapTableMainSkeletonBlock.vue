<template>
	<div
		class="MapTableMainSkeletonBlock"
		:style="{ height: getRandomNum() * 90 + 'px' }"
	>
		<v-skeleton-loader
			dark
			class="MapTableMainSkeletonBlock__skeleton"
			max-width="300"
			type="list-item-two-line"
		/>
	</div>
</template>

<script>
export default {
	name: 'MapTableMainSkeletonBlock',

	data: () => ({
		randomNums: [1, 2, 3, 4],
	}),

	methods: {
		getRandomNum() {
			return Math.floor(Math.random() * (4 - 1) + 1)
		},
	},
}
</script>

<style lang="sass">
.MapTableMainSkeletonBlock
    width: 100%
    padding: 5px 0

    &__skeleton
        height: 100%

        & > div
            height: 100%
            width: 100%
</style>
