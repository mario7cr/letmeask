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

  /**
   * useEffect -> listen to one or more events and trigger actions when the state is changed
   * @ param1 -> a function that will be triggered when the event is detected
   * @ param2 -> list of what should be heard, when not given the execution will happen on the component startup
   */
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

    /**
     * It is a good practice to unsubscribe from listeners when the component is down, otherwise,
     * the listener function will keep running and might can cause some problems
     */
    return () => {
      unsubscribe()
    }
  }, [])

  /**
   * Method to authenticate the user using Google's auth provider (Firebase)
   */
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
