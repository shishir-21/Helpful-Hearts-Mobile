import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices, type MediaStream } from "react-native-webrtc";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getConsultationSession } from "./api";
import { secureTokenStorage } from "@/lib/auth/secureStorage";
import { env } from "@/config/env";
import { colors, spacing } from "@/theme";

type SignalDescription = { type: "offer" | "answer"; sdp: string };
type SignalMessage =
  | { type: "ready"; initiator: boolean }
  | { type: "peer_joined" }
  | { type: "peer_left" }
  | ({ type: "offer" } & { sdp: SignalDescription })
  | ({ type: "answer" } & { sdp: SignalDescription })
  | { type: "candidate"; candidate: RTCIceCandidateInit };

export default function ConsultationVideoScreen() {
  const params = useLocalSearchParams<{ sessionId: string }>();
  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId;
  const query = useQuery({ queryKey: ["consultation-session", sessionId], queryFn: () => getConsultationSession(sessionId), enabled: Boolean(sessionId) });
  const socketRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localRef = useRef<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.data || !sessionId) return;
    let disposed = false;

    const connect = async () => {
      try {
        const token = await secureTokenStorage.getAccessToken();
        if (!token) throw new Error("Authentication required");
        const stream = await mediaDevices.getUserMedia({ audio: true, video: { facingMode: "user", width: 640, height: 480, frameRate: 24 } });
        if (disposed) { stream.getTracks().forEach((track) => track.stop()); return; }
        localRef.current = stream;
        setLocalStream(stream);

        const baseUrl = env.EXPO_PUBLIC_API_URL.replace(/^http/, "ws");
        const ws = new WebSocket(`${baseUrl}${query.data.signaling_path}?token=${encodeURIComponent(token)}`);
        socketRef.current = ws;
        const send = (message: object) => { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message)); };

        const createPeer = () => {
          const pc = new RTCPeerConnection({ iceServers: query.data.ice_servers });
          peerRef.current = pc;
          stream.getTracks().forEach((track) => pc.addTrack(track, stream));
          pc.ontrack = (event) => { const remote = event.streams?.[0]; if (remote) setRemoteStream(remote); };
          pc.onicecandidate = (event) => { if (event.candidate) send({ type: "candidate", candidate: event.candidate }); };
          pc.onconnectionstatechange = () => { setConnected(pc.connectionState === "connected"); if (pc.connectionState === "failed") setError("The video connection failed. Please leave and rejoin."); };
          return pc;
        };

        ws.onopen = () => setError(null);
        ws.onerror = () => setError("Could not connect to the consultation session.");
        ws.onclose = () => setConnected(false);
        ws.onmessage = async (event) => {
          const message = JSON.parse(event.data) as SignalMessage;
          if (message.type === "ready") {
            const pc = createPeer();
            if (message.initiator) {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              send({ type: "offer", sdp: { type: "offer", sdp: offer.sdp ?? "" } });
            }
          } else if (message.type === "offer") {
            const pc = peerRef.current ?? createPeer();
            await pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            send({ type: "answer", sdp: { type: "answer", sdp: answer.sdp ?? "" } });
          } else if (message.type === "answer" && peerRef.current) {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(message.sdp));
          } else if (message.type === "candidate" && peerRef.current) {
            await peerRef.current.addIceCandidate(new RTCIceCandidate(message.candidate));
          } else if (message.type === "peer_left") {
            setRemoteStream(null);
            setConnected(false);
          }
        };
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not start the consultation.");
      }
    };
    void connect();

    return () => {
      disposed = true;
      socketRef.current?.close();
      peerRef.current?.close();
      localRef.current?.getTracks().forEach((track) => track.stop());
      socketRef.current = null;
      peerRef.current = null;
      localRef.current = null;
    };
  }, [query.data, sessionId]);

  const toggleMute = () => { const track = localRef.current?.getAudioTracks()[0]; if (!track) return; track.enabled = !track.enabled; setMuted(!track.enabled); };
  const toggleCamera = () => { const track = localRef.current?.getVideoTracks()[0]; if (!track) return; track.enabled = !track.enabled; setCameraOff(!track.enabled); };

  if (query.isLoading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (query.isError || !query.data) return <View style={styles.center}><Text style={styles.error}>Could not load the consultation.</Text></View>;

  return <View style={styles.container}>
    {remoteStream ? <RTCView style={styles.remote} streamURL={remoteStream.toURL()} objectFit="cover" /> : <View style={styles.waiting}><Text style={styles.waitingTitle}>Waiting for the other participant</Text><Text style={styles.waitingText}>Keep this screen open while the doctor joins.</Text></View>}
    {localStream ? <RTCView style={styles.local} streamURL={localStream.toURL()} mirror objectFit="cover" /> : null}
    <View style={styles.header}><Text style={styles.status}>{connected ? "Connected" : "Connecting…"}</Text>{error ? <Text style={styles.errorSmall}>{error}</Text> : null}</View>
    <View style={styles.controls}>
      <Pressable style={styles.control} onPress={toggleMute}><Text style={styles.controlText}>{muted ? "Unmute" : "Mute"}</Text></Pressable>
      <Pressable style={styles.control} onPress={toggleCamera}><Text style={styles.controlText}>{cameraOff ? "Camera on" : "Camera off"}</Text></Pressable>
      <Pressable style={styles.end} onPress={() => { socketRef.current?.close(); router.back(); }}><Text style={styles.endText}>Leave</Text></Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:"#000"}, remote:{flex:1},
  local:{position:"absolute",right:spacing.md,top:spacing.xl,width:120,height:170,borderRadius:12},
  waiting:{flex:1,alignItems:"center",justifyContent:"center",padding:spacing.xl}, waitingTitle:{color:"#fff",fontSize:20,fontWeight:"800",textAlign:"center"}, waitingText:{color:"#ddd",fontSize:14,textAlign:"center",marginTop:spacing.sm},
  header:{position:"absolute",top:spacing.xl,left:spacing.md,right:spacing.md}, status:{color:"#fff",fontWeight:"800"}, errorSmall:{color:"#ffd0d0",marginTop:4,fontSize:12},
  controls:{position:"absolute",bottom:spacing.xl,left:spacing.md,right:spacing.md,flexDirection:"row",justifyContent:"center",gap:spacing.sm},
  control:{paddingHorizontal:spacing.md,paddingVertical:spacing.sm,borderRadius:24,backgroundColor:"rgba(255,255,255,0.18)"}, controlText:{color:"#fff",fontWeight:"800"},
  end:{paddingHorizontal:spacing.lg,paddingVertical:spacing.sm,borderRadius:24,backgroundColor:colors.danger}, endText:{color:"#fff",fontWeight:"800"},
  center:{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:colors.background}, error:{color:colors.danger,fontWeight:"800",padding:spacing.lg,textAlign:"center"},
});
