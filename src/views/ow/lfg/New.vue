<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { listOwHeroes } from '~/api/ow'
import { owLfgCreateTeam } from '~/api/owLfg'
import { OW_LFG_MODE_OPTIONS, OW_LFG_PLATFORM_OPTIONS, OW_LFG_ROLE_OPTIONS, OW_LFG_RANK_OPTIONS } from '~/constants/owLfgDict'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const errorMsg = ref('')
const heroes = ref([])

const form = reactive({
  title: '',
  modeCode: 'QUICK_PLAY',
  platformCode: 'PC',
  allowCrossplay: false,
  autoApprove: true,
  capacity: 5,
  voiceRequired: 1,
  regionCode: '',
  languageCode: '',
  rankMin: '',
  rankMax: '',
  needRoles: [],
  preferredHeroCodes: [],
  tagsText: '',
  note: '',
  battleTag: '',
  voiceRoom: '',
  groupNo: '',
  durationPreset: 360,
  durationMinutes: 360
})

const durationOptions = [
  { value: 120, label: '2 小时' },
  { value: 360, label: '6 小时' },
  { value: 1440, label: '24 小时' },
  { value: -1, label: '自定义' }
]

const heroOptions = computed(() => (heroes.value || []).map((h) => ({ value: h.heroCode, label: h.heroName })))

const toggleRole = (code) => {
  const idx = form.needRoles.indexOf(code)
  if (idx >= 0) form.needRoles.splice(idx, 1)
  else {
    if (form.needRoles.length >= 3) return
    form.needRoles.push(code)
  }
}

const toggleHero = (code) => {
  const idx = form.preferredHeroCodes.indexOf(code)
  if (idx >= 0) form.preferredHeroCodes.splice(idx, 1)
  else {
    if (form.preferredHeroCodes.length >= 3) return
    form.preferredHeroCodes.push(code)
  }
}

const tags = computed(() => {
  const raw = String(form.tagsText || '')
    .split(/[,，\n]/g)
    .map((s) => s.trim())
    .filter(Boolean)
  const uniq = []
  for (const t of raw) {
    if (uniq.includes(t)) continue
    uniq.push(t)
    if (uniq.length >= 10) break
  }
  return uniq
})

const onPickDuration = (v) => {
  form.durationPreset = v
  if (v !== -1) form.durationMinutes = v
}

const validate = () => {
  errorMsg.value = ''
  if (!form.title || form.title.trim().length < 2) {
    errorMsg.value = '请填写队伍标题（至少 2 个字）'
    return false
  }
  if (!form.modeCode) {
    errorMsg.value = '请选择模式'
    return false
  }
  if (!form.platformCode) {
    errorMsg.value = '请选择平台'
    return false
  }
  const cap = Number(form.capacity)
  if (!cap || cap < 2 || cap > 10) {
    errorMsg.value = '人数上限范围：2-10'
    return false
  }
  const dur = Number(form.durationMinutes)
  if (!dur || dur < 30 || dur > 10080) {
    errorMsg.value = '有效期范围：30 - 10080 分钟'
    return false
  }
  if (form.preferredHeroCodes.length > 3) {
    errorMsg.value = '主玩英雄最多 3 个'
    return false
  }
  return true
}

const onSubmit = async () => {
  if (!validate()) return
  loading.value = true
  try {
    const data = await owLfgCreateTeam({
      title: form.title.trim(),
      modeCode: form.modeCode,
      platformCode: form.platformCode,
      allowCrossplay: Boolean(form.allowCrossplay),
      capacity: Number(form.capacity),
      autoApprove: Boolean(form.autoApprove),
      voiceRequired: Number(form.voiceRequired),
      regionCode: form.regionCode?.trim() || null,
      languageCode: form.languageCode?.trim() || null,
      rankMin: form.rankMin || null,
      rankMax: form.rankMax || null,
      needRoles: form.needRoles.slice(0, 3),
      preferredHeroCodes: form.preferredHeroCodes.slice(0, 3),
      tags: tags.value,
      note: form.note?.trim() || null,
      contact: {
        battleTag: form.battleTag?.trim() || null,
        voiceRoom: form.voiceRoom?.trim() || null,
        groupNo: form.groupNo?.trim() || null
      },
      durationMinutes: Number(form.durationMinutes)
    })

    const inviteCode = data?.inviteCode
    if (!inviteCode) throw new Error('创建失败：未返回 inviteCode')
    ElMessage.success('创建成功，已生成邀请链接')
    router.replace(`/ow/lfg/t/${inviteCode}`)
  } catch (e) {
    errorMsg.value = e?.message || '创建失败'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    heroes.value = (await listOwHeroes()) || []
  } catch {
    heroes.value = []
  }

  // Optional template from query string: ?mode=COMPETITIVE
  const m = typeof route.query.mode === 'string' ? route.query.mode : ''
  if (m) form.modeCode = m
})
</script>

<template>
  <div class="lfg-new">
    <div class="lfg-container">
      <div class="lfg-new-head">
        <div>
          <h1 class="lfg-title">创建 OW 队伍</h1>
          <p class="lfg-subtitle">创建后会生成一个邀请链接，复制分享给朋友即可加入。</p>
        </div>
        <button class="lfg-btn" @click="router.push('/ow/lfg')">返回大厅</button>
      </div>

      <form class="lfg-panel" @submit.prevent="onSubmit">
        <div class="lfg-grid">
          <label class="lfg-field">
            <span class="lfg-label">队伍标题 *</span>
            <input v-model="form.title" class="lfg-input" placeholder="例：今晚竞技上分，来坦/辅" autocomplete="off" />
          </label>

          <label class="lfg-field">
            <span class="lfg-label">模式 *</span>
            <select v-model="form.modeCode" class="lfg-select">
              <option v-for="o in OW_LFG_MODE_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
          </label>

          <label class="lfg-field">
            <span class="lfg-label">平台 *</span>
            <select v-model="form.platformCode" class="lfg-select">
              <option v-for="o in OW_LFG_PLATFORM_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
          </label>

          <label class="lfg-field lfg-field--inline">
            <span class="lfg-label">跨平台</span>
            <div class="lfg-inline">
              <input id="allowCrossplay" v-model="form.allowCrossplay" type="checkbox" class="lfg-checkbox" />
              <label class="lfg-checkbox-label" for="allowCrossplay">允许跨平台</label>
            </div>
          </label>

          <label class="lfg-field">
            <span class="lfg-label">队伍类型 *</span>
            <div class="lfg-radio-row">
              <label class="lfg-radio">
                <input v-model="form.autoApprove" type="radio" :value="true" />
                <span>公开可直接加入</span>
              </label>
              <label class="lfg-radio">
                <input v-model="form.autoApprove" type="radio" :value="false" />
                <span>需队长同意</span>
              </label>
            </div>
          </label>

          <label class="lfg-field">
            <span class="lfg-label">人数上限 *</span>
            <input v-model.number="form.capacity" type="number" class="lfg-input" min="2" max="10" />
          </label>

          <label class="lfg-field">
            <span class="lfg-label">语音要求 *</span>
            <div class="lfg-radio-row">
              <label class="lfg-radio">
                <input v-model.number="form.voiceRequired" type="radio" :value="0" />
                <span>不需要</span>
              </label>
              <label class="lfg-radio">
                <input v-model.number="form.voiceRequired" type="radio" :value="1" />
                <span>可选</span>
              </label>
              <label class="lfg-radio">
                <input v-model.number="form.voiceRequired" type="radio" :value="2" />
                <span>必须</span>
              </label>
            </div>
          </label>

          <label class="lfg-field">
            <span class="lfg-label">段位范围（可选）</span>
            <div class="lfg-two">
              <select v-model="form.rankMin" class="lfg-select">
                <option value="">最低段位</option>
                <option v-for="o in OW_LFG_RANK_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
              <select v-model="form.rankMax" class="lfg-select">
                <option value="">最高段位</option>
                <option v-for="o in OW_LFG_RANK_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </div>
          </label>

          <label class="lfg-field">
            <span class="lfg-label">位置需求（最多 3）</span>
            <div class="lfg-chip-row">
              <button
                v-for="o in OW_LFG_ROLE_OPTIONS"
                :key="o.value"
                type="button"
                :class="['lfg-chip', { active: form.needRoles.includes(o.value) }]"
                @click="toggleRole(o.value)"
              >
                {{ o.label }}
              </button>
            </div>
          </label>

          <label class="lfg-field lfg-field--full">
            <span class="lfg-label">主玩英雄（最多 3，可选）</span>
            <div class="lfg-hero-grid">
              <button
                v-for="h in heroOptions"
                :key="h.value"
                type="button"
                :class="['lfg-hero', { active: form.preferredHeroCodes.includes(h.value) }]"
                @click="toggleHero(h.value)"
              >
                {{ h.label }}
              </button>
            </div>
          </label>

          <label class="lfg-field">
            <span class="lfg-label">标签（可选，逗号分隔）</span>
            <input v-model="form.tagsText" class="lfg-input" placeholder="例：上分, 轻松, 缺辅" />
            <div v-if="tags.length" class="lfg-tag-preview">预览：{{ tags.join(' / ') }}</div>
          </label>

          <label class="lfg-field">
            <span class="lfg-label">有效期 *</span>
            <div class="lfg-two">
              <select v-model.number="form.durationPreset" class="lfg-select" @change="onPickDuration(form.durationPreset)">
                <option v-for="o in durationOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
              <input
                v-model.number="form.durationMinutes"
                type="number"
                class="lfg-input"
                min="30"
                max="10080"
                :disabled="form.durationPreset !== -1"
                placeholder="分钟"
              />
            </div>
          </label>

          <label class="lfg-field lfg-field--full">
            <span class="lfg-label">备注 / 规则（可选）</span>
            <textarea v-model="form.note" class="lfg-textarea" rows="3" placeholder="例：不喷人，开麦优先，随缘上分"></textarea>
          </label>

          <div class="lfg-field lfg-field--full">
            <div class="lfg-label">联系方式（可选，仅队伍成员可见）</div>
            <div class="lfg-contact">
              <input v-model="form.battleTag" class="lfg-input" placeholder="BattleTag（例：AAA#1234）" />
              <input v-model="form.voiceRoom" class="lfg-input" placeholder="语音房间（例：Discord/YY）" />
              <input v-model="form.groupNo" class="lfg-input" placeholder="群号（例：QQ群/微信群）" />
            </div>
          </div>
        </div>

        <div v-if="errorMsg" class="lfg-alert" role="alert" aria-live="polite">{{ errorMsg }}</div>

        <div class="lfg-actions">
          <button class="lfg-btn" type="button" @click="router.push('/ow/lfg')">取消</button>
          <button class="lfg-btn lfg-btn--primary" type="submit" :disabled="loading">
            {{ loading ? '创建中…' : '创建并生成邀请' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.lfg-new {
  min-height: 100vh;
  color: #e2e8f0;
  padding-top: 5rem;
  background: radial-gradient(900px 500px at 20% 0%, rgba(124, 58, 237, 0.35) 0%, rgba(15, 15, 35, 1) 55%),
    radial-gradient(900px 600px at 80% 20%, rgba(244, 63, 94, 0.2) 0%, rgba(15, 15, 35, 1) 60%),
    #0f0f23;
}

.lfg-container {
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1rem 2rem;
}

@media (min-width: 900px) {
  .lfg-container {
    max-width: 1040px;
  }
}

.lfg-new-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.lfg-title {
  font-size: 2rem;
  line-height: 2.2rem;
  font-weight: 1000;
  margin: 0;
}

.lfg-subtitle {
  margin: 6px 0 0;
  color: rgba(226, 232, 240, 0.65);
  font-weight: 700;
}

.lfg-panel {
  border: 1px solid rgba(226, 232, 240, 0.12);
  background: rgba(15, 15, 35, 0.7);
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 18px 70px rgba(0, 0, 0, 0.4);
}

.lfg-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 900px) {
  .lfg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.lfg-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lfg-field--full {
  grid-column: 1 / -1;
}

.lfg-field--inline {
  justify-content: flex-end;
}

.lfg-label {
  font-size: 12px;
  font-weight: 900;
  color: rgba(226, 232, 240, 0.72);
}

.lfg-input,
.lfg-select,
.lfg-textarea {
  border: 1px solid rgba(226, 232, 240, 0.14);
  background: rgba(2, 6, 23, 0.35);
  color: rgba(226, 232, 240, 0.92);
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 800;
  outline: none;
}

.lfg-textarea {
  resize: vertical;
}

.lfg-input:focus,
.lfg-select:focus,
.lfg-textarea:focus {
  border-color: rgba(167, 139, 250, 0.65);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.18);
}

.lfg-two {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.lfg-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.14);
  background: rgba(2, 6, 23, 0.25);
}

.lfg-checkbox {
  width: 16px;
  height: 16px;
}

.lfg-checkbox-label {
  font-weight: 900;
  color: rgba(226, 232, 240, 0.85);
}

.lfg-radio-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.14);
  background: rgba(2, 6, 23, 0.25);
}

.lfg-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
  color: rgba(226, 232, 240, 0.86);
}

.lfg-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.lfg-chip {
  border: 1px solid rgba(226, 232, 240, 0.18);
  background: rgba(2, 6, 23, 0.35);
  color: rgba(226, 232, 240, 0.88);
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 180ms ease, border-color 180ms ease;
}

.lfg-chip:hover {
  transform: translateY(-1px);
  border-color: rgba(167, 139, 250, 0.55);
}

.lfg-chip.active {
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.14);
}

.lfg-hero-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

@media (min-width: 900px) {
  .lfg-hero-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.lfg-hero {
  border: 1px solid rgba(226, 232, 240, 0.14);
  background: rgba(2, 6, 23, 0.25);
  color: rgba(226, 232, 240, 0.88);
  border-radius: 14px;
  padding: 10px 10px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 180ms ease, border-color 180ms ease;
}

.lfg-hero:hover {
  transform: translateY(-1px);
  border-color: rgba(167, 139, 250, 0.55);
}

.lfg-hero.active {
  border-color: rgba(244, 63, 94, 0.55);
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.14);
}

.lfg-tag-preview {
  font-size: 12px;
  font-weight: 800;
  color: rgba(226, 232, 240, 0.65);
}

.lfg-contact {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

@media (min-width: 900px) {
  .lfg-contact {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.lfg-alert {
  margin-top: 12px;
  border: 1px solid rgba(244, 63, 94, 0.35);
  background: rgba(244, 63, 94, 0.12);
  border-radius: 14px;
  padding: 10px 12px;
  font-weight: 900;
}

.lfg-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}

.lfg-btn {
  border: 1px solid rgba(226, 232, 240, 0.18);
  background: rgba(2, 6, 23, 0.35);
  color: rgba(226, 232, 240, 0.9);
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.lfg-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(167, 139, 250, 0.55);
  box-shadow: 0 16px 55px rgba(0, 0, 0, 0.35);
}

.lfg-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.lfg-btn--primary {
  border-color: rgba(244, 63, 94, 0.55);
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.95) 0%, rgba(124, 58, 237, 0.9) 55%, rgba(167, 139, 250, 0.85) 100%);
  box-shadow: 0 14px 40px rgba(244, 63, 94, 0.18);
}
</style>

