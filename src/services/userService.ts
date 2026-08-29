import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { db, auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile, UserNotificationPrefs } from '../types/types';

export function checkIsAge14OrOlder(birthYear: number, birthMonth: number, currentDate: Date = new Date()): boolean {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  let age = currentYear - birthYear;
  if (currentMonth < birthMonth) {
    age--;
  }
  return age >= 14;
}

class UserService {
  private currentProfile: UserProfile | null = null;
  private listeners: ((profile: UserProfile | null) => void)[] = [];

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener() {
    if (isFirebaseConfigured && auth && db) {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const profile = await this.fetchUserProfile(user.uid);
          this.setCurrentProfile(profile);
        } else {
          this.setCurrentProfile(null);
        }
      });
    }
  }

  public subscribe(listener: (profile: UserProfile | null) => void): () => void {
    this.listeners.push(listener);
    listener(this.currentProfile);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getCurrentProfile(): UserProfile | null {
    return this.currentProfile;
  }

  private setCurrentProfile(profile: UserProfile | null) {
    this.currentProfile = profile;
    this.listeners.forEach(l => l(profile));
  }

  public async fetchUserProfile(uid: string): Promise<UserProfile | null> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'users', uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return snap.data() as UserProfile;
        }
      } catch (err) {
        console.warn('[UserService] fetchUserProfile error:', err);
      }
    }
    return null;
  }

  public async signupWithEmail(
    email: string,
    pass: string,
    displayName: string,
    birthYear: number,
    birthMonth: number
  ): Promise<{ success: boolean; error?: string }> {
    if (!checkIsAge14OrOlder(birthYear, birthMonth)) {
      return { 
        success: false, 
        error: 'UNDER_14_BLOCKED: 이 서비스는 만 14세 이상만 가입하실 수 있습니다.' 
      };
    }

    if (!isFirebaseConfigured || !auth || !db) {
      const demoProfile: UserProfile = {
        uid: `demo_${Date.now()}`,
        email,
        displayName: displayName || 'K-POP Fan',
        favoriteArtistIds: ['bigbang-gd'],
        ageVerified: true,
        ageVerifiedAt: new Date().toISOString(),
        notificationPrefs: {
          emailEnabled: false,
          ticketOpen: true,
          statusChange: true,
          language: 'ko'
        }
      };
      this.setCurrentProfile(demoProfile);
      return { success: true };
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email,
        displayName: displayName || email.split('@')[0],
        favoriteArtistIds: ['bigbang-gd'],
        ageVerified: true,
        ageVerifiedAt: new Date().toISOString(),
        notificationPrefs: {
          emailEnabled: false,
          ticketOpen: true,
          statusChange: true,
          language: 'ko'
        }
      };
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      this.setCurrentProfile(newProfile);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public async signInWithGoogle(): Promise<{ success: boolean; requiresAgeVerification?: boolean; uid?: string; email?: string; displayName?: string; error?: string }> {
    if (!isFirebaseConfigured || !auth || !googleProvider || !db) {
      return this.signupWithEmail('demo_google@fan.com', '', 'Google Fan', 2000, 1);
    }

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const existing = await this.fetchUserProfile(user.uid);

      if (!existing || !existing.ageVerified) {
        return {
          success: true,
          requiresAgeVerification: true,
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Google Fan'
        };
      }

      this.setCurrentProfile(existing);
      return { success: true, requiresAgeVerification: false };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public async completeSocialSignup(
    uid: string,
    email: string,
    displayName: string,
    birthYear: number,
    birthMonth: number
  ): Promise<{ success: boolean; error?: string }> {
    if (!checkIsAge14OrOlder(birthYear, birthMonth)) {
      if (auth) await signOut(auth);
      return { 
        success: false, 
        error: 'UNDER_14_BLOCKED: 이 서비스는 만 14세 이상만 이용하실 수 있습니다.' 
      };
    }

    const newProfile: UserProfile = {
      uid,
      email,
      displayName,
      favoriteArtistIds: ['bigbang-gd'],
      ageVerified: true,
      ageVerifiedAt: new Date().toISOString(),
      notificationPrefs: {
        emailEnabled: false,
        ticketOpen: true,
        statusChange: true,
        language: 'ko'
      }
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'users', uid), newProfile);
    }
    this.setCurrentProfile(newProfile);
    return { success: true };
  }

  public async loginWithEmail(email: string, pass: string): Promise<{ success: boolean; error?: string }> {
    if (!isFirebaseConfigured || !auth) {
      return this.signupWithEmail(email, '', 'K-POP Fan', 2000, 1);
    }
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const profile = await this.fetchUserProfile(res.user.uid);
      this.setCurrentProfile(profile);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    this.setCurrentProfile(null);
  }

  public async toggleFavoriteArtist(artistId: string): Promise<boolean> {
    if (!this.currentProfile) return false;
    const current: string[] = this.currentProfile.favoriteArtistIds || [];
    const isFav = current.includes(artistId);
    const updated = isFav ? current.filter((id: string) => id !== artistId) : [...current, artistId];

    this.currentProfile.favoriteArtistIds = updated;
    this.setCurrentProfile({ ...this.currentProfile });

    if (isFirebaseConfigured && db && this.currentProfile.uid) {
      try {
        await updateDoc(doc(db, 'users', this.currentProfile.uid), {
          favoriteArtistIds: updated
        });
      } catch (err) {
        console.warn('[UserService] Update favorites error:', err);
      }
    }
    return !isFav;
  }

  public async updateNotificationPrefs(prefs: UserNotificationPrefs): Promise<void> {
    if (!this.currentProfile) return;
    this.currentProfile.notificationPrefs = prefs;
    this.setCurrentProfile({ ...this.currentProfile });

    if (isFirebaseConfigured && db && this.currentProfile.uid) {
      try {
        await updateDoc(doc(db, 'users', this.currentProfile.uid), {
          notificationPrefs: prefs
        });
      } catch (err) {
        console.warn('[UserService] Update prefs error:', err);
      }
    }
  }

  public async unsubscribeByToken(uid: string): Promise<void> {
    if (this.currentProfile && this.currentProfile.uid === uid) {
      this.currentProfile.notificationPrefs.emailEnabled = false;
      this.setCurrentProfile({ ...this.currentProfile });
    }
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'users', uid), {
          'notificationPrefs.emailEnabled': false
        });
      } catch (err) {
        console.warn('[UserService] Unsubscribe error:', err);
      }
    }
  }

  public loginDemoUser(displayName = 'K-POP Fan'): UserProfile {
    const demo: UserProfile = {
      uid: 'demo_user_2026',
      email: 'demo@kpop-tour.com',
      displayName,
      favoriteArtistIds: ['bigbang-gd', 'bts'],
      ageVerified: true,
      ageVerifiedAt: new Date().toISOString(),
      notificationPrefs: {
        emailEnabled: false,
        ticketOpen: true,
        statusChange: true,
        language: 'ko'
      }
    };
    this.setCurrentProfile(demo);
    return demo;
  }
}

export const userService = new UserService();