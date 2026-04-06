import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

// ============================================
// Firebase 설정
// ============================================
// TODO: Firebase Console에서 프로젝트 생성 후 아래 값을 교체하세요
// https://console.firebase.google.com/
// 1. 프로젝트 생성 (ai-matchmaker)
// 2. 웹 앱 추가 -> 설정값 복사
// 3. Authentication -> 익명 로그인 활성화
// 4. Firestore Database -> 생성 (테스트 모드)
// 5. Storage -> 생성
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyDCE-xzTWRYzpyHSpCah9JshZjQ66DkdfQ",
  authDomain: "couple-f08ee.firebaseapp.com",
  projectId: "couple-f08ee",
  storageBucket: "couple-f08ee.firebasestorage.app",
  messagingSenderId: "30116689025",
  appId: "1:30116689025:web:1c4c43cfd8e85391cd0980",
  measurementId: "G-PW5GWKQ200",
};

// Firebase가 설정되었는지 확인
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

// 앱 초기화 (설정이 있을 때만)
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage, isConfigured };

// ============================================
// 사용자 프로필 CRUD
// ============================================

export async function saveUserProfile(userId: string, profileData: any) {
  if (!isConfigured || !db) return;
  await setDoc(doc(db, 'users', userId), {
    ...profileData,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getUserProfile(userId: string) {
  if (!isConfigured || !db) return null;
  const docSnap = await getDoc(doc(db, 'users', userId));
  return docSnap.exists() ? docSnap.data() : null;
}

export async function getAllUsers() {
  if (!isConfigured || !db) return [];
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ============================================
// 채팅
// ============================================

export async function sendChatMessage(
  roomId: string,
  senderId: string,
  text: string,
) {
  if (!isConfigured || !db) return;
  await addDoc(collection(db, 'chatRooms', roomId, 'messages'), {
    senderId,
    text,
    timestamp: serverTimestamp(),
  });
  // 채팅방 마지막 메시지 업데이트
  await updateDoc(doc(db, 'chatRooms', roomId), {
    lastMessage: text,
    lastMessageTime: serverTimestamp(),
  });
}

export function subscribeToChatMessages(
  roomId: string,
  callback: (messages: any[]) => void,
) {
  if (!isConfigured || !db) return () => {};
  const q = query(
    collection(db, 'chatRooms', roomId, 'messages'),
    orderBy('timestamp', 'asc'),
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      timestamp: d.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
    callback(messages);
  });
}

// ============================================
// 좋아요 / 매칭
// ============================================

export async function saveLike(fromUserId: string, toUserId: string) {
  if (!isConfigured || !db) return;
  await setDoc(doc(db, 'likes', `${fromUserId}_${toUserId}`), {
    from: fromUserId,
    to: toUserId,
    createdAt: serverTimestamp(),
  });

  // 상대방도 나를 좋아했는지 확인 (매칭 성립)
  const reverseDoc = await getDoc(doc(db, 'likes', `${toUserId}_${fromUserId}`));
  if (reverseDoc.exists()) {
    // 양방향 좋아요 = 매칭 성립!
    const roomId = [fromUserId, toUserId].sort().join('_');
    await setDoc(doc(db, 'chatRooms', roomId), {
      users: [fromUserId, toUserId],
      createdAt: serverTimestamp(),
      lastMessage: '매칭되었습니다! 대화를 시작해보세요 💕',
      lastMessageTime: serverTimestamp(),
    });
    return { matched: true, roomId };
  }
  return { matched: false };
}

// ============================================
// 사진 업로드
// ============================================

export async function uploadProfilePhoto(
  userId: string,
  photoType: string,
  fileBlob: Blob,
) {
  if (!isConfigured || !storage) return null;
  const storageRef = ref(storage, `profiles/${userId}/${photoType}_${Date.now()}.jpg`);
  await uploadBytes(storageRef, fileBlob);
  return getDownloadURL(storageRef);
}
