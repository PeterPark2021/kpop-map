import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, googleProvider, db, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile, LanguageCode } from '../types/types';

class UserService {
  private currentUserProfile: UserProfile | null = null;
  private listeners: ((profile: UserProfile | null) => void)[] = [];

  constructor() {
    if (isFirebaseConfigured && auth) {
      onAuthStateChanged(auth, async (user: User | null) => {
        if (user) {
          const profile = await this.getOrCreateUserProfile(user);
          this.currentUserProfile = profile;
        } else {
          this.currentUserProfile = null;
        }
        this.notifyListeners();
      });
    }
  }

  public subscribe(callback: (profile: UserProfile | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUserProfile);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentUserProfile));
  }

  public async signUpWithEmail(email: string, pass: string, name: string): Promise<UserProfile> {
    if (!auth) throw new Error('Firebase Auth 미초기화');
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    return await this.getOrCreateUserProfile(cred.user, name);
  }

  public async loginWithEmail(email: string, pass: string): Promise<void> {
    if (!auth) throw new Error('Firebase Auth 미초기화');
    await signInWithEmailAndPassword(auth, email, pass);
  }

  public async loginWithGoogle(): Promise<void> {
    if (!auth || !googleProvider) throw new Error('Google Auth 미초기화');
    await signInWithPopup(auth, googleProvider);
  }

  public async logout(): Promise<void> {
    if (auth) await signOut(auth);
    this.currentUserProfile = null;
    this.notifyListeners();
  }

  private async getOrCreateUserProfile(user: User, customName?: string): Promise<UserProfile> {
    if (!db) {
      return {
        uid: user.uid,
        email: user.email || '',
        displayName: customName || user.displayName || 'K-POP 팬',
        favoriteArtistIds: [],
        notificationPrefs: { emailEnabled: false, language: 'ko', consentGivenAt: null },
        createdAt: new Date().toISOString()
      };
    }

    const userDocRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      return snap.data() as UserProfile;
    }

    // 신규 사용자 생성 (기본값: emailEnabled=false, 동의일시=null)
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: customName || user.displayName || user.email?.split('@')[0] || 'K-POP 팬',
      favoriteArtistIds: [],
      notificationPrefs: {
        emailEnabled: false,
        language: 'ko',
        consentGivenAt: null
      },
      createdAt: new Date().toISOString()
    };

    await setDoc(userDocRef, newProfile);
    return newProfile;
  }

  // 아티스트 팔로우 / 언팔로우 토글
  public async toggleFavoriteArtist(artistId: string): Promise<boolean> {
    if (!this.currentUserProfile) return false;

    const isFav = this.currentUserProfile.favoriteArtistIds.includes(artistId);
    const nextFavorites = isFav
      ? this.currentUserProfile.favoriteArtistIds.filter(id => id !== artistId)
      : [...this.currentUserProfile.favoriteArtistIds, artistId];

    this.currentUserProfile.favoriteArtistIds = nextFavorites;
    this.notifyListeners();

    if (db && auth?.currentUser) {
      const ref = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(ref, {
        favoriteArtistIds: isFav ? arrayRemove(artistId) : arrayUnion(artistId)
      });
    }

    return !isFav;
  }

  // 이메일 알림 수신 동의 설정 저장 (법적 필수)
  public async updateNotificationPrefs(enabled: boolean, language: LanguageCode): Promise<void> {
    if (!this.currentUserProfile) return;

    const consentTime = enabled ? (this.currentUserProfile.notificationPrefs.consentGivenAt || new Date().toISOString()) : null;

    const newPrefs = {
      emailEnabled: enabled,
      language,
      consentGivenAt: consentTime
    };

    this.currentUserProfile.notificationPrefs = newPrefs;
    this.notifyListeners();

    if (db && auth?.currentUser) {
      const ref = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(ref, {
        notificationPrefs: newPrefs
      });
    }
  }

  // 원클릭 수신 거부 (이메일 링크용)
  public async unsubscribeByToken(uid: string): Promise<void> {
    if (db) {
      const ref = doc(db, 'users', uid);
      await updateDoc(ref, {
        'notificationPrefs.emailEnabled': false,
        'notificationPrefs.consentGivenAt': null
      });
    }
  }

  public getCurrentProfile(): UserProfile | null {
    return this.currentUserProfile;
  }
}

export const userService = new UserService();