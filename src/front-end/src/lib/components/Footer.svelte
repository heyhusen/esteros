<script lang="ts">
	export const today = new Date();
	export const currentYear = today.getFullYear();
</script>

<footer class="footer">
	<div class="wrapper wrapper--container">
		Copyright &copy; 2022 {#if currentYear > 2022}
			- {currentYear}
		{/if} &middot;
		<a href="http://husen.id" target="_blank" rel="noopener noreferrer">
			Ahmad Husen
		</a>
	</div>
</footer>

<style lang="postcss">
	.footer {
		@apply bg-neutral text-neutral-content md:text-base mt-auto;

		.wrapper {
			@apply flex justify-center;
		}
		a {
			&:hover {
				@apply underline;
			}
		}
	}
</style>
