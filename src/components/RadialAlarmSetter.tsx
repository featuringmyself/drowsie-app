import Ionicons from "@expo/vector-icons/Ionicons"
import * as Haptics from "expo-haptics"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { PanResponder, Platform, StyleSheet, Text, View } from "react-native"
import Svg, {
    Circle,
    Defs,
    G,
    Line,
    LinearGradient,
    Mask,
    Path,
    Rect,
    Stop,
    Text as SvgText,
} from "react-native-svg"

// ——— theme ———
const SLEEP_GRAD_FROM = "#e634dd"
const SLEEP_GRAD_TO = "#e38ae5"
const MOON_ICON = "#f25add"
const ALARM_ICON = "#f35be3"
const TRACK_GRAD_TOP = "#1e1926"
const TRACK_GRAD_BOT = "#38353f"
const LABEL_MUTED = "#7A7A80"
const TICK = "#FFFFFF"
const TICK_ALPHA = 0.5
const INNER_FACE = "#000000"

export type RadialAlarmSetterProps = {
    size: number
    bedTime: Date
    wakeTime: Date
    onWakeTimeChange: (next: Date) => void
}

// ——— geometry & time (pure) ———

function timeToAngleRad(d: Date): number {
    const t = (d.getHours() % 12) + d.getMinutes() / 60
    return (t / 12) * 2 * Math.PI
}

function polar(cx: number, cy: number, r: number, angleRad: number) {
    return { x: cx + r * Math.sin(angleRad), y: cy - r * Math.cos(angleRad) }
}

/** Clockwise arc on 12h dial (sweep flag 1). */
function arcPathD(cx: number, cy: number, r: number, a0: number, a1: number): string {
    const p0 = polar(cx, cy, r, a0)
    const p1 = polar(cx, cy, r, a1)
    const sweep = a1 - a0
    const large = sweep > Math.PI ? 1 : 0
    return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y}`
}

function normAngle(a: number): number {
    let x = a % (2 * Math.PI)
    if (x < 0) x += 2 * Math.PI
    return x
}

function angleDist(a: number, b: number): number {
    const d = Math.abs(normAngle(a) - normAngle(b))
    return Math.min(d, 2 * Math.PI - d)
}

function sleepMinutes(bed: Date, wake: Date): number {
    let m = (wake.getTime() - bed.getTime()) / 60_000
    if (m <= 0) m += 24 * 60
    return Math.round(m)
}

/** Each :00 strictly after `bed` and strictly before `wake` — one star per clock hour in the sleep window. */
function clockHourInstantsBetween(bed: Date, wake: Date): Date[] {
    const out: Date[] = []
    let cur = new Date(bed.getTime())
    cur.setSeconds(0, 0)
    cur.setMilliseconds(0)
    cur.setMinutes(0)
    if (cur.getTime() <= bed.getTime()) {
        cur.setHours(cur.getHours() + 1)
    }
    while (cur.getTime() < wake.getTime()) {
        out.push(new Date(cur.getTime()))
        cur.setHours(cur.getHours() + 1)
    }
    return out
}

function formatDuration(totalMin: number): string {
    const h = Math.floor(totalMin / 60)
    const m = Math.round(totalMin % 60)
    return m === 0 ? `${h}h` : `${h}h ${m}m`
}

/** Nearest valid wake time in 5-minute steps after `bed`. */
function nearestWake(bed: Date, targetAngle: number, prevWake: Date): Date {
    let best = prevWake
    let bestScore = Infinity
    const target = normAngle(targetAngle)

    for (let add = 5; add < 24 * 60; add += 5) {
        const w = new Date(bed.getTime() + add * 60_000)
        const wa = timeToAngleRad(w)
        const dist = angleDist(target, wa)
        const drift = Math.abs(w.getTime() - prevWake.getTime()) / 60_000
        const score = dist + drift * 0.0001
        if (score < bestScore) {
            bestScore = score
            best = w
        }
    }
    return best
}

function touchAngle(cx: number, cy: number, lx: number, ly: number): number {
    return normAngle(Math.atan2(lx - cx, -(ly - cy)))
}

// ——— component ———

export function RadialAlarmSetter({ size, bedTime, wakeTime, onWakeTimeChange }: RadialAlarmSetterProps) {
    const cx = size / 2
    const cy = size / 2
    const ringR = size * 0.42
    const ringW = size * 0.095
    const handle = ringW - 4
    const innerR = ringR - ringW / 2 - 1
    const tickOuter = innerR - 3
    const tickInHour = tickOuter - size * 0.026
    const tickInHalf = tickOuter - size * 0.014

    const ids = useMemo(() => {
        const u = Math.random().toString(36).slice(2, 10)
        return { track: `t-${u}`, sleepG: `g-${u}`, sleepM: `m-${u}` }
    }, [])

    const bedA = useMemo(() => timeToAngleRad(bedTime), [bedTime])
    const wakeA = useMemo(() => timeToAngleRad(wakeTime), [wakeTime])

    const arc = useMemo(() => {
        let w = wakeA
        const b = bedA
        if (w <= b) w += 2 * Math.PI
        const d = arcPathD(cx, cy, ringR, b, w)
        const g1 = polar(cx, cy, ringR, b)
        const g2 = polar(cx, cy, ringR, w)
        return { start: b, end: w, d, gx1: g1.x, gy1: g1.y, gx2: g2.x, gy2: g2.y }
    }, [bedA, wakeA, cx, cy, ringR])

    const stars = useMemo(() => {
        const hours = clockHourInstantsBetween(bedTime, wakeTime)
        const n = hours.length
        const s0 = size * 0.014
        const s1 = size * 0.048
        return hours.map((t, i) => {
            const ang = timeToAngleRad(t)
            const p = polar(cx, cy, ringR, ang)
            const tLin = n <= 1 ? 0.5 : i / (n - 1)
            // Smoothstep: gentle start, gradual ramp toward wake.
            const f = tLin * tLin * (3 - 2 * tLin)
            return { x: p.x, y: p.y, size: s0 + (s1 - s0) * f }
        })
    }, [bedTime, wakeTime, cx, cy, ringR, size])

    const mins = useMemo(() => sleepMinutes(bedTime, wakeTime), [bedTime, wakeTime])
    const moon = polar(cx, cy, ringR, bedA)
    const alarm = polar(cx, cy, ringR, wakeA)

    const wakeRef = useRef(wakeTime)
    useEffect(() => {
        wakeRef.current = wakeTime
    }, [wakeTime])

    const snapBlock = useRef(Math.floor(sleepMinutes(bedTime, wakeTime) / 5))

    const applyAngle = useCallback(
        (angle: number) => {
            const next = nearestWake(bedTime, angle, wakeRef.current)
            onWakeTimeChange(next)
            const block = Math.floor(sleepMinutes(bedTime, next) / 5)
            if (block !== snapBlock.current) {
                snapBlock.current = block
                void Haptics.selectionAsync()
            }
        },
        [bedTime, onWakeTimeChange],
    )

    const applyRef = useRef(applyAngle)
    applyRef.current = applyAngle
    const wakeForHit = useRef(wakeTime)
    wakeForHit.current = wakeTime
    const dragging = useRef(false)

    const pan = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: (e) => {
                    const { locationX: lx, locationY: ly } = e.nativeEvent
                    const aa = timeToAngleRad(wakeForHit.current)
                    const p = polar(cx, cy, ringR, aa)
                    const hit = Math.hypot(lx - p.x, ly - p.y) < ringW * 1.2
                    dragging.current = hit
                    return hit
                },
                onMoveShouldSetPanResponder: () => dragging.current,
                onPanResponderMove: (e) => {
                    if (!dragging.current) return
                    const { locationX: lx, locationY: ly } = e.nativeEvent
                    applyRef.current(touchAngle(cx, cy, lx, ly))
                },
                onPanResponderRelease: () => {
                    dragging.current = false
                },
                onPanResponderTerminate: () => {
                    dragging.current = false
                },
            }),
        [cx, cy, ringR, ringW],
    )

    const labelR = tickInHour - size * 0.028

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size} pointerEvents="none">
                <Defs>
                    <LinearGradient id={ids.track} x1="50%" y1="0%" x2="50%" y2="100%">
                        <Stop offset="0%" stopColor={TRACK_GRAD_TOP} />
                        <Stop offset="100%" stopColor={TRACK_GRAD_BOT} />
                    </LinearGradient>
                    <LinearGradient
                        id={ids.sleepG}
                        gradientUnits="userSpaceOnUse"
                        x1={arc.gx1}
                        y1={arc.gy1}
                        x2={arc.gx2}
                        y2={arc.gy2}
                    >
                        <Stop offset="0%" stopColor={SLEEP_GRAD_FROM} />
                        <Stop offset="100%" stopColor={SLEEP_GRAD_TO} />
                    </LinearGradient>
                    <Mask id={ids.sleepM} width={size} height={size} x="0" y="0" maskUnits="userSpaceOnUse">
                        <Rect width={size} height={size} fill="#000000" />
                        <Path d={arc.d} stroke="#FFFFFF" strokeWidth={ringW} strokeLinecap="round" fill="none" />
                    </Mask>
                </Defs>

                <Circle
                    cx={cx}
                    cy={cy}
                    r={ringR}
                    stroke={`url(#${ids.track})`}
                    strokeWidth={ringW}
                    fill="none"
                />
                <Circle cx={cx} cy={cy} r={innerR} fill={INNER_FACE} />

                {/* Gradient + stars only inside the sleep arc (same mask as highlight). */}
                <G mask={`url(#${ids.sleepM})`}>
                    <Rect x={0} y={0} width={size} height={size} fill={`url(#${ids.sleepG})`} />
                    {stars.map((s, i) => (
                        <SvgText
                            key={i}
                            x={s.x}
                            y={s.y}
                            fill={TICK}
                            fillOpacity={0.92}
                            fontSize={s.size}
                            fontWeight="600"
                            textAnchor="middle"
                            alignmentBaseline="central"
                        >
                            ✦
                        </SvgText>
                    ))}
                </G>

                <G>
                    {Array.from({ length: 24 }, (_, i) => {
                        const ang = (i / 24) * 2 * Math.PI
                        const inner = i % 2 === 0 ? tickInHour : tickInHalf
                        const o = polar(cx, cy, tickOuter, ang)
                        const inn = polar(cx, cy, inner, ang)
                        return (
                            <Line
                                key={i}
                                x1={o.x}
                                y1={o.y}
                                x2={inn.x}
                                y2={inn.y}
                                stroke={TICK}
                                strokeWidth={1.5}
                                strokeOpacity={TICK_ALPHA}
                            />
                        )
                    })}
                </G>
            </Svg>

            {(
                [
                    ["12", 0],
                    ["3", Math.PI / 2],
                    ["6", Math.PI],
                    ["9", (3 * Math.PI) / 2],
                ] as const
            ).map(([label, ang]) => {
                const p = polar(cx, cy, labelR, ang)
                return (
                    <Text
                        key={label}
                        pointerEvents="none"
                        style={[
                            styles.clockLabel,
                            {
                                position: "absolute",
                                left: p.x - 12,
                                top: p.y - 10,
                            },
                        ]}
                    >
                        {label}
                    </Text>
                )
            })}

            <View pointerEvents="none" style={styles.center}>
                <Text style={styles.durLabel}>Sleep duration</Text>
                <Text style={styles.durValue}>{formatDuration(mins)}</Text>
                <View style={styles.icons}>
                    <Ionicons name="flash" size={14} color={LABEL_MUTED} />
                    <Ionicons name="wifi" size={14} color={LABEL_MUTED} style={{ marginLeft: 12 }} />
                </View>
            </View>

            <View style={StyleSheet.absoluteFill} {...pan.panHandlers}>
                <View
                    pointerEvents="none"
                    style={[
                        styles.handle,
                        {
                            left: moon.x - handle / 2,
                            top: moon.y - handle / 2,
                            width: handle,
                            height: handle,
                            borderRadius: handle / 2,
                        },
                    ]}
                >
                    <Ionicons name="moon" size={handle * 0.6} color={MOON_ICON} />
                </View>
                <View
                    pointerEvents="none"
                    style={[
                        styles.handle,
                        {
                            left: alarm.x - handle / 2,
                            top: alarm.y - handle / 2,
                            width: handle,
                            height: handle,
                            borderRadius: handle / 2,
                        },
                    ]}
                >
                    <Ionicons name="alarm" size={handle * 0.7} color={ALARM_ICON} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    clockLabel: {
        width: 24,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
        ...(Platform.OS === "android" ? { includeFontPadding: false } : {}),
    },
    center: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
    durLabel: {
        fontSize: 18,
        fontWeight: "500",
        color: LABEL_MUTED,
        marginBottom: 4,
    },
    durValue: {
        fontSize: 28,
        fontWeight: "600",
        color: "#FFFFFF",
        letterSpacing: -0.5,
    },
    icons: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    handle: {
        position: "absolute",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
})
