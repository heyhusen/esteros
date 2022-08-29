<nav class="navbar wrapper">
	<div class="navbar__logo">
		<slot name="logo" />
	</div>

	<slot name="items" />
</nav>

<style lang="postcss">
	.navbar {
		@apply gap-4 pt-6 md:pt-8 lg:pt-10 xl:pt-12 px-4 md:px-6 lg:px-8 xl:px-0;

		&__logo {
			@apply flex-1;
		}
	}
</style>
