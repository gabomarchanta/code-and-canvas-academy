<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { theme } from '$lib/stores/themeStore';
</script>

<button on:click={theme.toggle} class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
	{#if $theme === 'dark'}
		<Sun class="h-5 w-5" />
	{:else}
		<Moon class="h-5 w-5" />
	{/if}
</button> 