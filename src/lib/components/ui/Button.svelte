<!-- src/lib/components/ui/Button.svelte -->
<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'warning' | 'success' | 'neutral' | 'main-cta' = 'primary';
  export let size: 'sm' | 'md' = 'md';
  export let iconOnly = false;
  export let fullWidth = false; // Nueva prop para w-full
  // type nativo de HTMLButtonElement para el type del botón
  export let type: "button" | "submit" | "reset" = "button";
  export let disabled = false;

  // Clases base
  const base = "font-semibold rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800";
  
  // Clases específicas de variante (simplificado, puedes expandir esto)
  $: variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white focus:ring-blue-500",
    secondary: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 focus:ring-slate-500",
    neutral: "bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 focus:ring-gray-500",
    warning: "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500",
    success: "bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-500",
    'main-cta': "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white focus:ring-green-500"
  }[variant];

  // Clases específicas de tamaño y layout
  $: sizeLayoutClasses = {
    md: iconOnly ? "p-3 flex items-center justify-center" : "px-6 py-3 flex items-center justify-center",
    sm: iconOnly ? "p-2 flex items-center justify-center space-x-1 text-sm" : "px-4 py-2 flex items-center justify-center space-x-2 text-sm",
  }[size];

  $: widthClass = fullWidth ? "w-full" : "";
  $: disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

</script>

<button
  {type}
  class="{base} {variantClasses} {sizeLayoutClasses} {widthClass} {disabledClass} {$$props.class || ''}"
  {disabled}
  on:click
>
  <slot />
</button>