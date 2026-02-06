import httpPublic from './httpPublic'
import httpAccount from './httpAccount'

// Public
export const owLfgListTeams = (params) => httpPublic.get('/api/ow/lfg/teams', { params })
export const owLfgInvite = (inviteCode) => httpPublic.get(`/api/ow/lfg/t/${encodeURIComponent(inviteCode)}`)

// Account required
export const owLfgCreateTeam = (body) => httpAccount.post('/api/ow/lfg/teams', body)
export const owLfgTeamDetail = (id) => httpAccount.get(`/api/ow/lfg/teams/${id}`)
export const owLfgMyState = (id) => httpAccount.get(`/api/ow/lfg/teams/${id}/my-state`, { meta: { silenceError: true } })
export const owLfgJoin = (id) => httpAccount.post(`/api/ow/lfg/teams/${id}/join`)
export const owLfgRequestJoin = (id, body) => httpAccount.post(`/api/ow/lfg/teams/${id}/join-requests`, body || {})
export const owLfgCancelJoinRequest = (joinRequestId) => httpAccount.post(`/api/ow/lfg/join-requests/${joinRequestId}/cancel`)
export const owLfgApproveJoinRequest = (joinRequestId) => httpAccount.post(`/api/ow/lfg/join-requests/${joinRequestId}/approve`)
export const owLfgRejectJoinRequest = (joinRequestId) => httpAccount.post(`/api/ow/lfg/join-requests/${joinRequestId}/reject`)
export const owLfgKick = (teamId, memberId) => httpAccount.post(`/api/ow/lfg/teams/${teamId}/members/${memberId}/kick`)
export const owLfgLeave = (id) => httpAccount.post(`/api/ow/lfg/teams/${id}/leave`)
export const owLfgClose = (id) => httpAccount.post(`/api/ow/lfg/teams/${id}/close`)
export const owLfgDisband = (id) => httpAccount.post(`/api/ow/lfg/teams/${id}/disband`)
export const owLfgMyTeams = () => httpAccount.get('/api/ow/lfg/my/teams')
export const owLfgReport = (body) => httpAccount.post('/api/ow/lfg/reports', body)

