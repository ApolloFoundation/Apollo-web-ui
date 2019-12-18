export default function normalizeDeadline(deadLine, timestamp) {
    const z = (deadLine - timestamp) / 60 / 60
    const h = Math.floor(z)
    const m = Math.floor((z - h) * 60)
    return `${h}:${m}`
}