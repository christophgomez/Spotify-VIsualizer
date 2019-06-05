<template>
	<div>
		<div class='foo' v-bind:style="{background: color}" :class='{selected:isSelected}'>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		color: String,
		isSelected: Boolean
	}
}
</script>

<style>
:root {
  --borderWidth: 3px;
  --height: 24px;
  --width: 12px;
  --borderColor: #78b13f;
}
.foo {
  float: left;
  width: 25px;
  height: 25px;
  margin: 6px;
  border: 1px solid rgba(0, 0, 0, .75);
  opacity: 0.5;
}
.selected {
	opacity: 1;
	filter:blur(0px);
  border-radius: 15px;
}
.foo:hover {
	cursor:pointer;
}
</style>
