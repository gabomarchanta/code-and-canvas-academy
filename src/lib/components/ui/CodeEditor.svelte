<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import type { EditorView } from '@codemirror/view';
	import type { LanguageSupport } from '@codemirror/language';
	import { oneDark } from '@codemirror/theme-one-dark';

	export let lang: LanguageSupport;
	export let value: string;
	export let placeholder = '';

	let view: EditorView;
</script>

<div class="code-editor-wrapper">
	<CodeMirror
		bind:value
		{lang}
		theme={oneDark}
		styles={{
			'&': {
				height: '100%'
			},
			'.cm-scroller': {
				overflow: 'auto'
			},
			'.cm-content': {
				color: '#c9d1d9'
			},
			'.cm-gutters': {
				color: '#8b949e'
			}
		}}
		{placeholder}
		on:ready={(e) => (view = e.detail)}
	/>
</div>

<style>
	.code-editor-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 0.5rem;
	}
</style> 