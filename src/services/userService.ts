import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User
} from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile, UserNotificationPrefs } from '../types/types';

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  requiresAgeVerification?: boolean;
  uid?: string;
  email?: string;
  displayName?: string;
  error?: string;
}

class UserService {
  private currentProfile: UserProfile | null = null;
  private listeners: ((profile: UserProfile | null) => void)[] = [];

  constructor() {
    if (isFirebaseConfigured && auth) {
      auth.onAuthStateChanged(async (user: User | null) => {
        if (user) {
          if (db) {
            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists()) {
                this.currentProfile = userDoc.data() as UserProfile;
                this.notifyListeners();
                return;
              }
            } catch (err) {
              console.warn('[UserService] getDoc error:', err);
            }
          }
          this.currentProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'K-POP Fan',
            favoriteArtistIds: ['bigbang-gd'],
            ageVerified: true,
            notificationPrefs: {
              emailEnabled: false,
              ticketOpen: true,
              statusChange: true,
              language: 'ko'
            }
          };
        } else {
          this.currentProfile = null;
        }
        this.notifyListeners();
      });
    }
  }

  public subscribe(callback: (profile: UserProfile | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentProfile);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l(this.currentProfile));
  }

  public getCurrentProfile(): UserProfile | null {
    return this.currentProfile;
  }

  // 1. 이메일 로그인
  public async loginWithEmail(email: string, pass: string): Promise<AuthResult> {
    if (!isFirebaseConfigured || !auth) return { success: false, error: 'Firebase가 설정되지 않았습니다.' };
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      return { success: true, uid: res.user.uid, email: res.user.email || '' };
    } catch (err: any) {
      return { success: false, error: err.message || '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }
  }

  // 2. 이메일 회원가입 (서버 사이드 completeSignup)
  public async signupWithEmail(
    email: string,
    pass: string,
    displayName: string,
    birthYear: number,
    birthMonth: number
  ): Promise<AuthResult> {
    if (!isFirebaseConfigured || !auth) return { success: false, error: 'Firebase가 설정되지 않았습니다.' };
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      const functions = getFunctions();
      const completeSignupFn = httpsCallable<any, { success: boolean; profile: UserProfile }>(
        functions,
        'completeSignup'
      );

      const result = await completeSignupFn({
        birthYear,
        birthMonth,
        displayName: displayName || email.split('@')[0]
      });

      this.currentProfile = result.data.profile;
      this.notifyListeners();
      return { success: true, user: result.data.profile };
    } catch (err: any) {
      if (auth) await signOut(auth);
      this.currentProfile = null;
      this.notifyListeners();
      const errMsg = err.message || '';
      if (errMsg.includes('UNDER_14') || errMsg.includes('만 14세 미만')) {
        return { success: false, error: 'UNDER_14_BLOCKED: 만 14세 미만은 법정대리인 동의 없이 회원가입이 불가능합니다.' };
      }
      return { success: false, error: errMsg || '회원가입 처리 중 오류가 발생했습니다.' };
    }
  }

  // 3. 구글 로그인
  public async signInWithGoogle(): Promise<AuthResult> {
    if (!isFirebaseConfigured || !auth) return { success: false, error: 'Firebase가 설정되지 않았습니다.' };
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      if (db) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          // 신규 구글 유저 -> 나이 확인 단계 필요
          return {
            success: true,
            requiresAgeVerification: true,
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Google Fan'
          };
        }
        this.currentProfile = userDoc.data() as UserProfile;
        this.notifyListeners();
        return { success: true, user: this.currentProfile };
      }

      return { success: true, uid: user.uid, email: user.email || '' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google 로그인에 실패했습니다.' };
    }
  }

  // 4. 소셜 신규 가입 나이 확인 완료
  public async completeSocialSignup(
    uid: string,
    email: string,
    displayName: string,
    birthYear: number,
    birthMonth: number
  ): Promise<AuthResult> {
    try {
      const functions = getFunctions();
      const completeSignupFn = httpsCallable<any, { success: boolean; profile: UserProfile }>(
        functions,
        'completeSignup'
      );

      const result = await completeSignupFn({
        birthYear,
        birthMonth,
        displayName: displayName || (email ? email.split('@')[0] : 'Fan')
      });

      this.currentProfile = result.data.profile;
      this.notifyListeners();
      return { success: true, user: result.data.profile };
    } catch (err: any) {
      if (auth) await signOut(auth);
      this.currentProfile = null;
      this.notifyListeners();
      const errMsg = err.message || '';
      if (errMsg.includes('UNDER_14') || errMsg.includes('만 14세 미만')) {
        return { success: false, error: 'UNDER_14_BLOCKED: 만 14세 미만은 법정대리인 동의 없이 회원가입이 불가능합니다.' };
      }
      return { success: false, error: errMsg || '나이 인증 완료 중 오류가 발생했습니다.' };
    }
  }

  public async logout(): Promise<void> {
    if (auth) await signOut(auth);
    this.currentProfile = null;
    this.notifyListeners();
  }

  public async toggleFavoriteArtist(artistId: string): Promise<boolean> {
    if (!this.currentProfile) return false;
    const currentFavs = this.currentProfile.favoriteArtistIds || [];
    const isFav = currentFavs.includes(artistId);
    const nextFavs = isFav ? currentFavs.filter(id => id !== artistId) : [...currentFavs, artistId];
    this.currentProfile = { ...this.currentProfile, favoriteArtistIds: nextFavs };
    this.notifyListeners();
    return !isFav;
  }

  public async updateNotificationPrefs(prefs: UserNotificationPrefs): Promise<void> {
    if (!this.currentProfile) return;
    this.currentProfile = { ...this.currentProfile, notificationPrefs: prefs };
    this.notifyListeners();
  }

  public async unsubscribeByToken(uid: string): Promise<void> {
    if (this.currentProfile && this.currentProfile.uid === uid) {
      this.currentProfile.notificationPrefs.emailEnabled = false;
      this.notifyListeners();
    }
  }
}

export const userService = new UserService();