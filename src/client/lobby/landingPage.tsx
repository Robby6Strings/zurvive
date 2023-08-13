import * as Cinnabun from "cinnabun"
import { Cinnabun as cb, createSignal, For } from "cinnabun"
import { LiveSocket } from "../liveSocket"
import { auth, characters, selectedCharacter } from "../state"
import { Experience } from "../../shared/components/experience"

export const LandingPage = () => {
  const loading = createSignal(true)
  if (cb.isClient) {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }

  const liveSocket = cb.isClient
    ? (cb.getRuntimeService(LiveSocket) as LiveSocket)
    : null
  const clientGameState = cb.isClient ? liveSocket!.gameState : null
  const username = createSignal("")
  const newCharacterName = createSignal("")

  return (
    <>
      <div
        className="loader-wrapper fullscreen"
        watch={loading}
        bind:visible={() => loading.value}
      >
        <div className="loader" />
      </div>
      <div
        id="main-menu"
        className="fullscreen"
        watch={[
          loading,
          clientGameState ?? createSignal(false),
          selectedCharacter,
        ]}
        bind:visible={() => {
          if (loading.value) return false
          if (cb.isClient)
            return !clientGameState!.value && !selectedCharacter.value
          return true
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-settings settings-icon-container"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        <div className="main-menu__title lobby-title">Zurvive</div>
        <div
          watch={auth}
          bind:visible={() => !auth.value && !selectedCharacter.value}
          className=""
        >
          <input
            value={username}
            className="lobby-input"
            placeholder="Username"
            onchange={(e: Event) =>
              (username.value = (e.target as HTMLInputElement).value)
            }
          />
          <button
            className="main-menu__button lobby-join-button"
            onclick={() => liveSocket?.authenticate(username.value)}
          >
            Login
          </button>
        </div>
        <div
          watch={[characters, auth]}
          bind:visible={() => !!auth.value && !selectedCharacter.value}
          bind:children
        >
          <ul className="character-list">
            <h4>Characters</h4>
            {() =>
              characters.value.length === 0 ? <li>No characters</li> : <></>
            }
            <For
              each={characters}
              template={(c) => (
                <li key={c.id}>
                  <button
                    key={c.id}
                    onclick={() => liveSocket?.selectCharacter(c.id)}
                  >
                    <span className="character-title">{c.name}</span>
                    <span className="character-level">
                      level {c.getComponent(Experience)!.currentLevel}
                    </span>
                  </button>
                </li>
              )}
            />
          </ul>

          <div>
            <input
              value={newCharacterName}
              onchange={(e: Event) =>
                (newCharacterName.value = (e.target as HTMLInputElement).value)
              }
              className="lobby-input"
              placeholder="New Character Name"
            />
            <button
              onclick={() => liveSocket?.newCharacter(newCharacterName.value)}
              className="main-menu__button lobby-join-button"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
