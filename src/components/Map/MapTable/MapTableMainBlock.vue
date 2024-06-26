<template>
	<div
		class="MapTableMainBlock__wrapper"
		:class="{
			isEditing,
			fitMode: fitMode && totalZet <= 2,
			'MapTableMainBlock__wrapper--small': fitMode,
		}"
		:style="styleVars"
	>
		<div class="MapTableMainBlock">
			<v-tooltip bottom :open-delay="300">
				<template #activator="{ on, attrs }">
					<span class="MapTableMainBlock__name" v-bind="attrs" v-on="on">
						{{ disciplineName }}
					</span>
				</template>

				<span>{{ disciplineName }}</span>
			</v-tooltip>

			<MapTableMainBlockEditButton
				v-if="showEditButton"
				:dark-mode="needIsDarkMode"
				@click="onEdit"
			/>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import determinateTextColor from '@utils/determinateTextColor'
import shadeColor from '@utils/shadeColor'

import MapTableMainBlockEditButton from '@components/Map/MapTable/MapTableMainBlockEditButton.vue'
import { ModesEnum } from '@models/Maps'

export default {
	name: 'MapTableMainBlock',
	components: { MapTableMainBlockEditButton },

	props: {
		data: {
			type: Object,
			required: true,
		},

		isEditing: {
			type: Boolean,
			default: false,
		},

		fitMode: {
			type: Boolean,
			default: false,
		},

		height: {
			type: String,
			default: '90px',
		},

		totalZet: {
			type: Number,
			default: 0,
		},
	},

	computed: {
		...mapGetters('Map', ['currentMode']),

		showEditButton() {
			return !this.isEditing && this.currentMode === ModesEnum.Aup
		},

		backgroundColor() {
			let color

			switch (this.currentMode) {
				case ModesEnum.Map: {
					color = this.data.group?.color
					break
				}

				case ModesEnum.Aup: {
					color = this.data.module?.color
					break
				}
			}

			return color || '#ffffff'
		},

		shadowColor() {
			return shadeColor(this.backgroundColor, -45)
		},

		needIsDarkMode() {
			return determinateTextColor(this.backgroundColor)
		},

		styleVars() {
			return {
				'--height-block': this.height,
				'--background-color': this.backgroundColor,
				'--shadow-color': this.shadowColor,
				'--text-color': this.needIsDarkMode ? '#333' : '#fff',
			}
		},

		disciplineName() {
			return this.data?.element?.discipline || ''
		},
	},

	methods: {
		onEdit() {
			this.$emit('edit', this.data.element)
		},
	},
}
</script>

<style lang="sass">
.MapTableMainBlock
    position: relative
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    height: 100%
    padding: 5px
    text-align: center
    border-radius: 8px
    font-size: 100%
    font-family: sans-serif
    cursor: grab
    transition: box-shadow .25s ease
    background-color: var(--background-color)

    .MapTableMainBlockEditButton
        opacity: 0
        transition: opacity .25s ease

    &:hover
        .MapTableMainBlockEditButton
            opacity: 1

    &__wrapper
        transition: all 0.3s ease
        padding: 5px 0
        height: var(--height-block)

        &:not(.isEditing)
            &.fitMode:hover
                height: calc(var(--height-block) * 3)

        &.isEditing
            .MapTableMainBlock
                box-shadow: 0px 0px 0px 4px var(--shadow-color) inset
        &.isViewOnly
            .MapTableMainBlock
                cursor: default

        &--small
            .MapTableMainBlock__name
                transform: scale(.75)

    &__name
        color: var(--text-color)
        overflow: hidden
        line-height: 1.5rem
        max-height: 8rem
        -webkit-box-orient: vertical
        display: block
        max-height: 100%
        display: -webkit-box
        overflow: hidden !important
        text-overflow: ellipsis
        font-weight: bold
        -webkit-line-clamp: 4
        transition: transform .25s ease

        &__full
          -webkit-line-clamp: 1
</style>
