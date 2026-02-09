<script lang="ts">
  const { text }: { text?: string } = $props();
</script>

<style lang="scss">
  @import "../styles/variables";

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;

    &.other {
      background-color: $blue;
      color: white;
    }
  }
</style>

<div class="content other">
  <p>{text}</p>
</div>
