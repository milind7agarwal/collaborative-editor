import "./App.css"
import { Editor } from "@monaco-editor/react"
import { MonacoBinding } from "y-monaco"
import { useRef, useMemo, useState, useEffect } from "react"
import * as Y from "yjs"
import { SocketIOProvider } from "y-socket.io"

const USER_COLORS = ['#f7b731', '#eb3b5a', '#20bf6b', '#2d98da', '#a55eea', '#4b6584', '#00b894', '#0984e3'];

function App() {

  const editorRef = useRef(null)
  const [ username, setUsername ] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || ""
  })
  const [ userColor ] = useState(() => USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)])
  const [ users, setUsers ] = useState([])

  const ydoc = useMemo(() => new Y.Doc(), [])
  const yText = useMemo(() => ydoc.getText("monaco"), [ ydoc ])
  
  const provider = useMemo(() => {
    const backendUrl = "/";
    return new SocketIOProvider(backendUrl, "monaco", ydoc, { autoConnect: false });
  }, [ydoc]);


  const handleMount = (editor) => {
    editorRef.current = editor

    new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([ editorRef.current ]),
      provider.awareness
    )
  }

  const handleJoin = (e) => {
    e.preventDefault()
    setUsername(e.target.username.value)
    window.history.pushState({}, "", "?username=" + e.target.username.value)
  }

  useEffect(() => {

    console.log(username)

    if (username) {

      provider.connect()

      provider.awareness.setLocalStateField("user", { 
        username,
        name: username,
        color: userColor 
      })


      const states = Array.from(provider.awareness.getStates().values())

      setUsers(states.filter(state => state.user && state.user.username).map(state => state.user))

      provider.awareness.on("change", () => {
        const states = Array.from(provider.awareness.getStates().values())
        setUsers(states.filter(state => state.user && state.user.username).map(state => state.user))
      })

      function handleBeforeUnload() {
        provider.awareness.setLocalStateField("user", null)
      }

      window.addEventListener("beforeunload", handleBeforeUnload)


      return () => {
        provider.disconnect()
        window.removeEventListener("beforeunload", handleBeforeUnload)
      }
    }
  }, [
    username
  ])

  if (!username) {
    return (
      <main className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center font-sans text-gray-200">
        <form
          onSubmit={handleJoin}
          className="flex flex-col gap-6 w-full max-w-sm p-8 bg-[#111] rounded-2xl border border-gray-800 shadow-2xl">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Join Session</h1>
            <p className="text-sm text-gray-400">Enter a username to start collaborating</p>
          </div>
          <input
            type="text"
            placeholder="Username"
            className="px-4 py-3 rounded-lg bg-black border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all"
            name="username"
            autoComplete="off"
            required
          />
          <button
            className="px-4 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition-colors"
          >
            Enter Workspace
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="h-screen w-full bg-[#0a0a0a] flex flex-col font-sans text-gray-200 overflow-hidden">
      <header className="h-14 border-b border-gray-800 bg-[#0a0a0a] flex items-center px-4 md:px-6 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-500 hidden md:block"></div>
          <h1 className="text-sm font-medium tracking-wide text-gray-300">Collaborative Editor</h1>
          <span className="px-2 py-0.5 ml-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
            Python
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="hidden md:inline">{users.length} Online</span>
            <span className="md:hidden">{users.length}</span>
          </span>
          <span className="px-2 py-1 bg-gray-800 rounded-md text-gray-300 ml-2 max-w-[100px] truncate">
            {username}
          </span>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <aside className="w-full md:w-64 h-32 md:h-auto bg-[#0f0f0f] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col shrink-0">
          <div className="p-3 md:p-4 border-b border-gray-800/50 flex justify-between items-center">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Connected Users</h2>
          </div>
          <ul className="p-2 md:p-3 overflow-y-auto flex-1 flex md:flex-col gap-2 space-y-0 md:space-y-1">
            {users.map((user, index) => (
              <li key={index} className="flex items-center gap-3 px-3 py-2 rounded-md bg-gray-800/30 md:bg-transparent md:hover:bg-gray-800/50 transition-colors text-sm text-gray-300 min-w-fit">
                <div 
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: user.color || '#4b6584' }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{user.username}</span>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex-1 bg-[#1e1e1e] relative">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            onMount={handleMount}
            options={{
              minimap: { enabled: false },
              padding: { top: 24, bottom: 24 },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              formatOnPaste: true,
            }}
          />
        </section>
      </div>
    </main>
  )
}

export default App