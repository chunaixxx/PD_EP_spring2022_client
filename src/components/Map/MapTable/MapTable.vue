<template>
	<div class="MapTable">
		<div v-if="!isEmpty" class="MapTable__inner">
			<MapTableMain
				:table="table"
				:loading="loading && !isLoadingSaveMapList"
				:active-editing-item-id="activeEditingItemId"
				:max-zet="maxZet"
				:fit-mode="isFullScreen"
				@edit="onEdit"
				@drag="onDrag"
			/>

			<MapTableTools
				:available-save="isAvailableSave"
				:loading-save="isLoadingSaveMapList"
				@clickSave="onClickSave"
				@clickChangeMode="onClickChangeMode"
			/>
		</div>

		<div v-else class="MapTable__empty">
			<MDataPreloader>
				<template #title> Нет данных </template>
				<template #subtitle> Выберите факультет и направление </template>
			</MDataPreloader>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ModesEnum } from '@models/Maps'

import mapsService from '@services/Maps/MapsService'
import ToastService from '@services/ToastService'

import MapTableMain from '@components/Map/MapTable/MapTableMain.vue'
import MapTableTools from '@components/Map/MapTable/MapTableTools.vue'
import MDataPreloader from '@components/common/MDataPreloader.vue'

export default {
	name: 'MapTable',
	components: { MapTableMain, MapTableTools, MDataPreloader },
	props: {
		table: {
			type: Array,
			default: () => [],
		},

		activeEditingItemId: {
			type: [String, Number],
			default: null,
		},

		loading: Boolean,
	},

	data() {
		return {
			isFullScreen: true,
			isDataChanged: false,
		}
	},

	computed: {
		...mapGetters('Map', ['currentMode']),

		isAvailableSave() {
			return this.isDataChanged && this.currentMode !== ModesEnum.View
		},

		maxZet() {
			return mapsService.maxZet
		},

		isLoadingSaveMapList() {
			return mapsService.isLoadingSaveMapList
		},

		isEmpty() {
			return !this.table.length && !this.isLoadingSaveMapList
		},
	},

	methods: {
		onEdit(item) {
			this.$emit('editClick', item.id)
		},

		async onSaveMap() {
			if (!mapsService.aupCode) return

			const res = await mapsService.saveAllMap(mapsService.aupCode)

			if (res) {
				ToastService.showSuccess('Карта успешно сохранена.')
			} else {
				ToastService.showError('Произошла ошибка при сохранении карты.')
			}

			this.isDataChanged = false
		},

		onDrag({ data, columnIndex }) {
			if (this.currentMode === ModesEnum.Map && !data.moved) {
				if (data.added) {
					ToastService.showError('В этом режиме Вы не можете это сделать.')
				}

				return
			}

			const added = data.added
			const removed = data.removed
			const moved = data.moved

			if (removed) {
				mapsService.deleteMapItemLocal(removed.element)
			}

			if (added) {
				const element = {
					...added.element,
					num_col: columnIndex,
					num_row: added.newIndex,
				}

				mapsService.addMapItemLocal(element)
			}

			if (moved) {
				mapsService.moveMapItemInColLocal(
					moved.element,
					moved.oldIndex,
					moved.newIndex,
				)
			}

			this.isDataChanged = true
		},

		onClickSave() {
			this.onSaveMap()
		},

		onClickChangeMode() {
			this.isFullScreen = !this.isFullScreen
		},
	},
}
</script>

<style lang="sass">
.MapTable
    height: 100%

    &__empty
        height: 100%
        display: flex
        align-items: center
        justify-content: center
</style>
