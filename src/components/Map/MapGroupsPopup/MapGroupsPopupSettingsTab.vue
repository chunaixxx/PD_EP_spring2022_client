<template>
	<v-list class="MapGroupsPopupSettingsTab" dense>
		<v-list-item-group v-model="_value" color="primary">
			<v-tooltip
				v-for="item in disciplines"
				:key="item.id"
				content-class="MapGroupsPopupSettingsTab__tooltip"
				max-width="200"
				open-delay="700"
				left
			>
				<template v-if="item.id !== 1" #activator="{ on, attrs }">
					<v-hover v-slot="{ hover }">
						<v-list-item v-bind="attrs" :value="item.id" v-on="on">
							<v-list-item-icon>
								<v-icon :color="item.color">mdi-circle</v-icon>
							</v-list-item-icon>

							<v-list-item-content>
								<v-list-item-title>{{ item.name }}</v-list-item-title>
							</v-list-item-content>

							<v-list-item-icon
								v-if="hover"
								@click.stop="$emit('deleteGroup', item)"
							>
								<v-hover v-slot="{ hover: _hover }">
									<v-icon :color="_hover ? 'black' : 'grey'">mdi-delete</v-icon>
								</v-hover>
							</v-list-item-icon>
						</v-list-item>
					</v-hover>
				</template>
				<span>{{ item.name }}</span>
			</v-tooltip>
		</v-list-item-group>
	</v-list>
</template>

<script>
export default {
	name: 'MapGroupsPopupSettingsTab',

	props: {
		disciplines: {
			type: Array,
			required: true,
		},

		value: {
			type: [String, Number],
			required: false,
			default: null,
		},
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
	},
}
</script>

<style lang="sass">
.MapGroupsPopupSettingsTab
    height: 305px
    overflow-y: scroll

    &__tooltip
        background-color: rgba(97, 97, 97, 1)
        opacity: 1 !important
</style>
