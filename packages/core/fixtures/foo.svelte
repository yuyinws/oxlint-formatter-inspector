<script>
  let count = 0

  if (count === -0) {
  }
</script>

<button on:click={() => count++}>
  Click me
</button>

<p>
  Count: {count}
</p>
