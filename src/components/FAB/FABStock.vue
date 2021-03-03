<template>
  <div class="fab-stock">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.fab-stock {
  position: fixed;
  bottom: 20px;
  right: 20px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;

  & > *:not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
