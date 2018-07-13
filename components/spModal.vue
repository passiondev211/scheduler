<template>
  <div tabindex="-1" role="dialog" aria-hidden="true" class="modal text-left">
    <div role="document" class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" data-dismiss="modal" aria-label="Close" class="close" @click.prevent="onClose"><span aria-hidden="true">×</span></button>
        </div>
        <div class="modal-body">
          <slot name="modal-body"></slot>
        </div>
        <div class="modal-footer">
          <button type="button" data-dismiss="modal" class="btn btn-secondary" @click.prevent="onClose">Close</button>
          <button type="button" class="btn btn-primary" @click.prevent="onApprove">Approve</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'spModal',
  props: [ 'title', 'onClose', 'onApprove' ],
}

</script>