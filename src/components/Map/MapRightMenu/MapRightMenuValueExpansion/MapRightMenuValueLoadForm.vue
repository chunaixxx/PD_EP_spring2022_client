<template>
	<div class="MapRightMenuValueLoadForm">
		<v-select
			:value="selectedControlTypes"
			:items="allValueTypes"
			label="Нагрузки"
			item-text="control"
			item-disabled="disabled"
			return-object
			filled
			dense
			hide-details
			multiple
			no-data-text="Доступные нагрузки отсутствуют"
			@change="onSelectControlTypes"
		>
			<template #selection="{ item, index }">
				<v-chip v-if="index === 0" small>
					<span>{{ item.control }}</span>
				</v-chip>
				<span v-if="index === 1" class="grey--text text-caption">
					(+{{ selectedControlTypes.length - 1 }} нагрузки)
				</span>
			</template>
		</v-select>
	</div>
</template>

<script>
import MapsService from '@services/Maps/MapsService'

import { ValueAmountTypeEnum } from '@models/Maps/IMapItemValueRaw'

export default {
	name: 'MapRightMenuValueLoadForm',

	props: {
		values: {
			type: Array,
			default: () => [],
		},
	},

	data: () => ({
		MapsService,
	}),

	computed: {
		allValueTypes() {
			return this.MapsService.controlTypes.value
				.filter(el => !el.is_control)
				.map(el => {
					return {
						...el,
						control: el.name,
					}
				})
		},

		selectedControlTypes() {
			return this.allValueTypes.filter(el =>
				this.values.find(_el => _el.control_type_id === el.id),
			)
		},
	},

	methods: {
		onSelectControlTypes(e) {
			this.$emit('selectControlTypes', e)

			if (e.length < this.selectedControlTypes.length) {
				/* Находим и удаляем нагрузку */
				const newValues = this.values.filter(el =>
					e.find(_el => _el.id === el.control_type_id),
				)

				this.$emit('selectControlTypes', newValues)
			} else {
				const newType = e.at(-1)

				const newValue = {
					amount: 0,
					control_type_id: newType.id,
					amount_type: ValueAmountTypeEnum.HOUR,
					type: 'load',
				}

				const newValues = [...this.values, newValue]

				this.$emit('selectControlTypes', newValues)
			}
		},
	},
}
</script>

<style lang="sass">
.MapRightMenuValueLoadForm
    margin-top: 8px
</style>
