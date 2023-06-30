<template>
	<v-dialog v-model="_value" max-width="500" class="MapUploadFilePopup">
		<v-card class="MapUploadFilePopup__card">
			<v-card-title class="text-h5">Сформировать КД</v-card-title>

			<v-card-text class="MapUploadFilePopup__text">
				<v-checkbox
					v-model="form.checkboxIntegralityModel"
					:disabled="isLoadingUploadFile"
					class="MapUploadFilePopup__checkbox"
					label="Проверять целочисленность ЗЕТ"
					hide-details="auto"
				/>

				<v-checkbox
					v-model="form.checkboxSumModel"
					:disabled="isLoadingUploadFile"
					class="MapUploadFilePopup__checkbox"
					label="Проверять объем программы в ЗЕТ"
					hide-details="auto"
				/>

				<MUploadFileDragArea
					v-model="form.uploadedFiles"
					:accessTypes="accessTypes"
					icon="mdi-file-excel"
					badgeLabel=".xlsx, .xls"
				/>
			</v-card-text>

			<v-card-actions>
				<v-spacer />
				<v-btn color="error" @click="_value = false">Отмена</v-btn>
				<v-btn
					color="success"
					:disabled="!isValidForm"
					:loading="isLoadingUploadFile"
					@click="onUploadBtnClick"
				>
					Загрузить
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import Api from '@services/api/Api'

import MUploadFileDragArea from '@components/common/MUploadFileDragArea.vue'

export default {
	name: 'MapUploadFilePopup',
	components: { MUploadFileDragArea },
	props: { value: Boolean },

	data() {
		return {
			form: {
				checkboxIntegralityModel: true,
				checkboxSumModel: true,
				uploadedFiles: [],
			},

			isLoadingUploadFile: false,
		}
	},

	computed: {
		_value: {
			get() {
				return this.value
			},
			set(v) {
				this.$emit('input', v)
			},
		},

		isValidForm() {
			return !!this.form.uploadedFiles?.length
		},

		// Файлы которые можно загружать через форму загрузки (только excel)
		accessTypes() {
			return [
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'application/vnd.ms-excel',
			]
		},
	},

	methods: {
		async onUploadBtnClick() {
			const form = {
				file: this.form.uploadedFiles[0],
				options: {
					checkboxIntegralityModel: this.form.checkboxIntegralityModel,
					checkboxSumModel: this.form.checkboxSumModel,
				},
			}

			this.isLoadingUploadFile = true

			try {
				const res = await Api.uploadFile(form)

				this._value = false
				this.$emit('success', res.data)
			} catch (res) {
				this.$emit('error', res.response)
			} finally {
				this.isLoadingUploadFile = false
				this.clearForm()
			}
		},

		clearForm() {
			this.form = {
				checkboxIntegralityModel: true,
				checkboxSumModel: true,
				uploadedFiles: [],
			}
		},
	},
}
</script>

<style lang="sass">
.MapUploadFilePopup
    &__text
        padding-bottom: 8px !important

    &__checkbox
        margin-top: 0px !important
        margin-bottom: 12px
</style>