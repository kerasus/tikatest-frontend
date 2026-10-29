<template>
  <div class="entity-index">
    <q-card>
      <q-toolbar class="entity-index__toolbar">
        <div class="entity-index__heading">
          <div class="text-subtitle1"><span class="doc-card-title"><slot name="title" /></span></div>
          <div
            v-if="$slots.subtitle"
            class="entity-index__subtitle"><slot name="subtitle" /></div>
        </div>
        <q-space />
        <div class="entity-index__actions"><slot name="header-actions" /></div>
      </q-toolbar>
      <q-separator />
      <q-card-section
        v-if="$slots.filters"
        class="entity-index__filters">
        <slot name="filters" />
      </q-card-section>
      <div class="entity-index__body"><slot /></div>
      <q-separator v-if="$slots.footer" />
      <div
        v-if="$slots.footer"
        class="entity-index__footer"><slot name="footer" /></div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
// Presentational shell: toolbar, filters, content and footer are entirely slot-driven.
</script>

<style lang="scss" scoped>
.entity-index {
  padding: 12px 6px;
  & > .q-card {
    background: #fff; border-radius: 24px; border: 1.5px solid rgba(238,242,246,.95);
    box-shadow: 0 16px 36px -10px rgba(99,102,241,.08), 0 4px 12px -2px rgba(15,23,42,.03);
    overflow: hidden; transition: box-shadow .25s ease;
  }
  .entity-index__toolbar {
    min-height: $space-16;
    padding: $space-1 $space-4;
    background: linear-gradient(180deg,#fafbfc 0%,#fff 100%);
  }
  .entity-index__heading { min-width: 0; }
  .doc-card-title {
    display: inline-flex; align-items: center; padding: .55rem 1.35rem; position: relative; overflow: hidden;
    color: #fff; border-radius: 14px; font-size: 1.15rem; font-weight: 800; line-height: 1.2;
    background: linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%);
    box-shadow: 0 6px 18px -3px rgba(124,58,237,.35);
    &:empty { display:none; }
    &::before { content:''; position:absolute; top:0; left:-120%; width:75%; height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);
      transform:skewX(-25deg); animation:entity-shine 4s infinite cubic-bezier(.4,0,.2,1); }
  }
  .entity-index__subtitle { margin-top: 6px; color: #64748b; font-size: .82rem; }
  .entity-index__actions { display:flex; align-items:center; gap:8px; }
  .entity-index__actions .q-btn {
    width:40px; height:40px; border-radius:12px; background:#f1f5f9; color:#475569;
    border:1px solid rgba(226,232,240,.8); transition:all .2s ease;
    &:hover { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; transform:translateY(-2px); }
  }
  & > .q-card > .q-separator { background:linear-gradient(90deg,transparent,#e2e8f0 50%,transparent); opacity:.8; }
  .entity-index__filters {
    padding: $space-2 $space-4;
    background:#fff;
  }
  .entity-index__body { width:100%; background:#fff; }
  .entity-index__body > .q-table__container .q-table__top { display:none; }
  .entity-index__body .q-table { width:100%; border-collapse:collapse; }
  .entity-index__body .q-table thead tr { background:#f8fafc; height:50px; }
  .entity-index__body .q-table thead th { color:#475569; font-weight:700; font-size:.88rem; border-bottom:2px solid #e2e8f0; }
  .entity-index__body .q-table tbody tr { height:56px; border-bottom:1px solid #f1f5f9; transition:background .2s ease; }
  .entity-index__body .q-table tbody tr:hover { background:#faf5ff !important; }
  .entity-index__body .q-table tbody td { color:#334155; font-size:.9rem; }
  .entity-index__footer { border-top:1px solid #edf2f7; }
}
@keyframes entity-shine { 0% {left:-120%} 20%,100% {left:220%} }
@media (max-width: 700px) {
  .entity-index .entity-index__toolbar { align-items:flex-start; padding:.85rem; }
  .entity-index__actions { flex-wrap:wrap; justify-content:flex-end; }
}
</style>
