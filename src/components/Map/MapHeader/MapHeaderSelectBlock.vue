<template>
	<div class="MapHeaderSelectBlock">
		<MapHeaderFacultySelect
			:value="facultyModel"
			:loading="isLoadingFacultyInput"
			:items="filteredFacultyItems"
			@input="setFaculty"
		/>

		<MapHeaderDirectionAutocomplete
			v-model="directionModel"
			:items="directionItemsByYear"
			:loading="isLoadingDirectionInput"
			@input="onSelectDirection"
		/>

		<MapHeaderYearSelect
			v-model="year"
			style="max-width: 100px"
			:items="yearItems"
		/>

		<MapHeaderModeSelect v-if="isAuth" style="max-width: 250px" />
	</div>
</template>

<script>
import withEventEmitter from '@mixins/withEventEmitter'

import mapsService from '@services/Maps/MapsService'
import permissionService from '@services/auth/PermissionService'
import authService from '@services/auth/AuthService'

import MapHeaderDirectionAutocomplete from '@components/Map/MapHeader/MapHeaderDirectionAutocomplete.vue'
import MapHeaderFacultySelect from '@components/Map/MapHeader/MapHeaderFacultySelect.vue'
import MapHeaderYearSelect from '@components/Map/MapHeader/MapHeaderYearSelect.vue'
import MapHeaderModeSelect from '@components/Map/MapHeader/MapHeaderModeSelect.vue'
import getCurrentYear from '@services/utils/getCurrentYear'

import { mapGetters, mapMutations } from 'vuex'

export default {
	name: 'MapHeaderSelectBlock',
	components: {
		MapHeaderFacultySelect,
		MapHeaderDirectionAutocomplete,
		MapHeaderYearSelect,
		MapHeaderModeSelect,
	},

	mixins: [
		withEventEmitter('mapsService', 'mapsServiceHandlers'),
		withEventEmitter('authService', 'authServiceHandlers'),
	],

	data() {
		return {
			facultyModel: null,
			directionModel: null,
			year: new Date(Date.now()).getFullYear(),

			mapsService,
			mapsServiceHandlers: {
				setFacultiesList: this.updateFormFields,
			},

			authService,
			authServiceHandlers: {
				updateUser: this.callRefreshKey,
			},

			directionItems: [],
			yearItems: [],

			isLoadingFacultyInput: false,
			isLoadingDirectionInput: false,

			refreshKey: 0,
		}
	},

	computed: {
		...mapGetters('Map', ['isAuth', 'currentMode', 'modes']),

		facultyItems() {
			return mapsService.facultiesList.value
		},

		// Доступные факультеты, т.к. некоторые могут быть скрыты из общего доступа
		filteredFacultyItems() {
			/* 
				Не удалять. refreshKey нужно, чтобы дергать
			    этот компьютед для перерасчета после авторизации пользователя.
				Используется в ситуации когда пользователь не авторизован и у него не видны
				скрытые факультеты, но после авторизации под учеткой Админа, нужно дернуть этот метод
				для перерасчета видимых факультетов.

				vite-ignore нужен для того, чтобы сборщик не удалил эту строку в итоговом билде
			*/
			/* @vite-ignore */
			this.refreshKey

			return this.facultyItems.filter(faculty =>
				permissionService.canViewFaculty(faculty),
			)
		},

		directionItemsByYear() {
			return this.directionItems.filter(
				direction => direction.year === this.year,
			)
		},
	},

	/* 	watch: {
		facultyModel() {
			if (!mapsService.aupCode) this.year = this.itemsYears[0]
		},
	}, */

	methods: {
		...mapMutations('Map', ['setMode']),

		findFacultyModelByAup(aup) {
			return this.facultyItems.find(faculty => {
				return faculty.directions.some(direction => direction.code === aup)
			})
		},

		findFacultyByUserFacultyId() {
			return this.facultyItems.find(faculty => {
				return faculty.faculty_id === authService.loggedUser?.faculties?.[0]
			})
		},

		findDirectionInFacultyByAup(aup) {
			return this.directionItems.find(direction => direction.code === aup)
		},

		setFaculty(faculty) {
			if (!faculty) return

			this.facultyModel = faculty

			/* Собираем все года всех карт на факультете */
			this.yearItems = [
				...new Set(
					faculty.directions
						.map(direction => direction.year)
						.sort((a, b) => b - a),
				),
			]

			/* Если там есть текущий год, то ставим его, иначе берем первый */
			if (this.yearItems.includes(getCurrentYear())) {
				this.year = getCurrentYear()
			} else {
				this.year = this.yearItems[0]
			}

			this.directionItems = faculty.directions.map(el => ({
				...el,
				canEdit: permissionService.canEditAup(el.code),
			}))
		},

		/* Перебрасываем на страницу при выборе нового направления */
		onSelectDirection() {
			this.$router
				.push({ query: { aup: this.directionModel?.code } })
				.catch(() => {})
		},

		/* Вызывается когда обновляется список факультетов*/
		async updateFormFields() {
			const aupCode = mapsService.aupCode || this.$route.query.aup

			if (!aupCode)
				return this.setFaculty(this.findFacultyByUserFacultyId() || null)

			this.setFaculty(this.findFacultyModelByAup(aupCode) || null)

			if (this.facultyModel) {
				await this.$nextTick()
				const direction = this.findDirectionInFacultyByAup(aupCode) || null

				this.year = direction?.year
				this.directionModel = direction
			}

			this.isLoadingFacultyInput = false
			this.isLoadingDirectionInput = false
		},

		callRefreshKey() {
			this.refreshKey += 1
		},
	},

	created() {
		/* переделать на норм */
		if (this.$route.query.aup) {
			this.isLoadingFacultyInput = true
			this.isLoadingDirectionInput = true
		}
	},
}
</script>

<style lang="sass">
.MapHeaderSelectBlock
    display: flex
    align-items: center
    gap: 8px
</style>
