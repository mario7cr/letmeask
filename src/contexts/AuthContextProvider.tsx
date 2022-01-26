import { createContext, ReactNode, useEffect, useState } from "react"
import { auth, GoogleAuthProvider, signInWithPopup } from "../services/firebase"

type AuthContextType = {
  user?: User
  signInWithGoogle: () => Promise<void>
}

type User = {
  id: string
  name: string
  avatar: string
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return

      const { uid, displayName, photoURL } = user

      if (!displayName || !photoURL) {
        throw new Error("Insufficient data from Google account")
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      })
    })

    return () => {
      unsubscribe()
    }
  })

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)

    if (!result.user) {
      throw new Error("It was not possible to sign in using this account")
    }

    const { uid, displayName, photoURL } = result.user

    if (!displayName || !photoURL) {
      throw new Error("Insufficient data from Google account")
    }

    setUser({
      id: uid,
      name: displayName,
      avatar: photoURL,
    })
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}
