<template>
	<MapRightMenuExpansion class="MapRightMenuControlExpansion">
		<template #header>
			<div class="MapRightMenuControlExpansion__header">
				<div>Настройки контроля</div>
			</div>
		</template>

		<div class="MapRightMenuControlExpansion__content">
			<v-radio-group
				class="MapRightMenuControlExpansion__radio-group"
				:value="currentControlTypeId"
				hide-details="auto"
				@change="onChange"
			>
				<v-radio
					v-for="control in allControlTypes"
					:key="control.id"
					class="MapRightMenuControlExpansion__radio"
					:value="control.id"
				>
					<template #label>
						<div class="MapRightMenuControlExpansion__label">
							{{ control.name }}
						</div>
					</template>
				</v-radio>
			</v-radio-group>
		</div>
	</MapRightMenuExpansion>
</template>

<script>
import MapRightMenuExpansion from '@components/Map/MapRightMenu/common/MapRightMenuExpansion.vue'

import MapsService from '@services/Maps/MapsService'

export default {
	name: 'MapRightMenuControlExpansion',
	components: { MapRightMenuExpansion },

	props: {
		currentControlTypeId: {
			type: Number,
			default: null,
		},
	},

	data: () => ({
		MapsService,
	}),

	computed: {
		allControlTypes() {
			return this.MapsService.controlTypes.value.filter(el => el.is_control)
		},
	},

	methods: {
		onChange(value) {
			this.$emit('changeControlType', value)
		},
	},
}
</script>

<style lang="sass">
.MapRightMenuControlExpansion
    &__radio-group
        .v-input--radio-group__input
            gap: 8px

    &__label
        margin-left: 8px

    .v-input--selection-controls
        margin-top: 0 !important
</style>
