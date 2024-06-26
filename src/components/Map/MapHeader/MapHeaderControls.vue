<template>
	<div class="MapHeaderControls">
		<!-- Проверки -->
		<!-- Пока не доделали, скрыто -->
		<!-- <MapHeaderButton
			label="Проверка"
			v-if="aupCode"
			@click="$router.push(`/check?aup=${aupCode}`)"
		/> -->
		<!--  -->

		<!-- Группировки -->
		<template v-if="currentMode === ModesEnum.Map && isAuth">
			<MapHeaderButton
				label="Группировки"
				outlined
				@click="openGroupSettingsPopupModel"
			/>

			<v-divider class="MapHeader__divider" vertical></v-divider>
		</template>
		<!--  -->

		<!-- Модули -->
		<template v-if="currentMode === ModesEnum.Aup && isAuth">
			<MapHeaderButton label="Модули" outlined @click="openModulesPopup" />

			<v-divider class="MapHeader__divider" vertical></v-divider>
		</template>
		<!--  -->

		<!-- Работа с файлами -->
		<MapHeaderDropdown
			icon="mdi-file-download"
			:disabled="!isAuth && !aupCode && isLoadingFile"
			:loading="isLoadingFile"
		>
			<v-list-item
				class="MapHeaderDropdownListItem"
				:disabled="!isAuth"
				@click="openUploadPopup"
			>
				<v-list-item-icon>
					<v-icon :size="18">mdi-upload</v-icon>
				</v-list-item-icon>
				<v-list-item-title>Загрузить план</v-list-item-title>
			</v-list-item>

			<v-list-item
				class="MapHeaderDropdownListItem"
				:disabled="!aupCode"
				@click="downloadMap"
			>
				<v-list-item-icon>
					<v-icon :size="18">mdi-download</v-icon>
				</v-list-item-icon>
				<v-list-item-title>Скачать</v-list-item-title>
			</v-list-item>

			<v-list-item
				v-if="currentMode === ModesEnum.Aup"
				class="MapHeaderDropdownListItem"
				:disabled="!aupCode"
				@click="downloadMapXML"
			>
				<v-list-item-icon>
					<v-icon :size="18">mdi-download</v-icon>
				</v-list-item-icon>
				<v-list-item-title>Скачать в XML</v-list-item-title>
			</v-list-item>
		</MapHeaderDropdown>

		<MapUploadFilePopup v-model="uploadPopupModel" />

		<MapGroupsPopup v-model="groupSettingsPopupModel" />
		<!--  -->

		<v-divider class="MapHeader__divider" vertical></v-divider>

		<!-- Авторизация -->
		<MapHeaderButton v-if="!isAuth" label="Войти" @click="openAuthPopup" />
		<MapHeaderAuthDropdown v-else @onLogout="logout" />

		<MapAuthPopup v-model="authPopupModel" @login="onLogin" />
		<!--  -->

		<!-- Модули -->
		<MapModulesPopup v-if="modulesPopupModel" v-model="modulesPopupModel" />
		<!--  -->
	</div>
</template>

<script>
import MapHeaderButton from '@components/Map/MapHeader/MapHeaderButton.vue'
import MapHeaderDropdown from '@components/Map/MapHeader/MapHeaderDropdown.vue'
import MapHeaderAuthDropdown from '@components/Map/MapHeader/MapHeaderAuthDropdown.vue'
import MapGroupsPopup from '@components/Map/MapGroupsPopup/MapGroupsPopup.vue'
import MapUploadFilePopup from '@components/Map/MapUploadFilePopup/MapUploadFilePopup.vue'
import MapAuthPopup from '@components/Map/MapAuthPopup/MapAuthPopup.vue'
import MapModulesPopup from '@components/Map/MapModulesPopup/MapModulesPopup.vue'
import { ModesEnum } from '@models/Maps'

import { mapGetters } from 'vuex'

import mapsService from '@services/Maps/MapsService'
import ToastService from '@services/ToastService'
import Api from '@services/api/Api'
import authService from '@services/auth/AuthService'

import downloadAsFile from '@services/utils/downloadAsFile'

export default {
	name: 'MapHeaderControls',
	components: {
		MapHeaderButton,
		MapHeaderDropdown,
		MapHeaderAuthDropdown,
		MapGroupsPopup,
		MapUploadFilePopup,
		MapModulesPopup,
		MapAuthPopup,
	},

	data() {
		return {
			uploadPopupModel: false,
			groupSettingsPopupModel: false,
			authPopupModel: false,
			modulesPopupModel: false,
			isLoadingFile: false,
			ModesEnum,
		}
	},

	computed: {
		...mapGetters('Map', ['isAuth', 'currentMode']),
		isReady() {
			return !!mapsService.mapList.value.length
		},

		aupCode() {
			return mapsService.aupCode
		},

		downloadURL() {
			return `${import.meta.env.VITE_API}/save_excel/${this.aupCode}`
		},
	},

	methods: {
		openGroupSettingsPopupModel() {
			this.groupSettingsPopupModel = true
		},

		openUploadPopup() {
			this.uploadPopupModel = true
		},

		openAuthPopup() {
			this.authPopupModel = true
		},

		openModulesPopup() {
			this.modulesPopupModel = true
		},

		onLogin() {
			this.authPopupModel = false
		},

		logout() {
			authService.logout()
		},

		async downloadMap() {
			try {
				this.isLoadingFile = true

				const { res, data, success, error } = await Api.downloadMap(
					this.aupCode,
				)

				const splitted = decodeURIComponent(
					res.headers['content-disposition'],
				).split('/')
				const filename = splitted[splitted.length - 1]

				if (success) {
					downloadAsFile(data, filename)
					ToastService.showSuccess('Карта успешно загружена')
				} else {
					throw new Error('Ошибка при скачивании карты', error)
				}
			} catch (err) {
				console.log(err)
				ToastService.showError('Произошла ошибка при загрузке карты')
			} finally {
				this.isLoadingFile = false
			}
		},

		async downloadMapXML() {
			try {
				this.isLoadingFile = true

				const { data, success, error } = await Api.downloadMapXML(this.aupCode)

				if (success) {
					downloadAsFile(data, `${this.aupCode}.xml`)
					ToastService.showSuccess('Карта в XML успешно загружена')
				} else {
					throw new Error('Ошибка при скачивании XML', error)
				}
			} catch (err) {
				console.log(err)
				ToastService.showError('Произошла ошибка при загрузке карты в XML')
			} finally {
				this.isLoadingFile = false
			}
		},
	},
}
</script>

<style lang="sass">
.MapHeaderControls
    display: flex
    gap: 8px
    align-items: center
    height: 100%
    max-height: 48px

.header-buttons
    display: flex
    align-items: center
    margin-right: 20px

.AuthUser
    display: flex
    align-items: center

.avatar-icon
    margin-right: 7px
</style>
