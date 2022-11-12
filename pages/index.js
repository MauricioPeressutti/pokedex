import Head from "next/head"
import Image from "next/image"
import { useEffect, useState } from "react"
import styles from "../styles/Home.module.css"

export default function Home() {
  const [pokemonName, setPokemonName] = useState("")
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState("")

  const handleChange = ({ target }) =>
    setPokemonName(target.value.toLowerCase())

  const catchPokemon = async () => {
    if (!pokemonName) return

    setLoading("catching")
    const res = await fetch(`/api/pokemon`, {
      method: "POST",
      body: JSON.stringify({ name: pokemonName }),
      "Content-Type": "application/json",
    })

    if (res.ok) {
      const resJSON = await res.json()

      await fetchPokemons()

      console.log({ resJSON })
    }
  }

  const fetchPokemons = async () => {
    setLoading("fetching")
    const res = await fetch("/api/pokemon")

    if (res.ok) {
      const { data } = await res.json()
      setLoading("")
      setPokemons(data)
    } else {
      console.log("Hubo un error al obtener los pokemons")
    }
  }

  useEffect(() => {
    fetchPokemons()
  }, [])

  console.log({ pokemons })

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokedex</title>
        <meta
          name="description"
          content="Pokedex con PlanetScale, Prisma y Next JS"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3>¿Qué pokemón deseas atrapar?</h3>
        <span
          style={{ color: "grey", marginBottom: "1rem", marginTop: "-1rem" }}
        >
          Ya se han atrapado {pokemons.length}
        </span>
        <input onChange={handleChange} value={pokemonName} />
        <button onClick={catchPokemon}>Atrapar</button>

        {loading === "catching" && <p>Intentando atrapar a {pokemonName}</p>}
        {loading === "fetching" && <p>Obteniendo pokemons...</p>}
        {!loading && (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              martinTop: "1.5rem",
              maxWidth: "70rem",
            }}
          >
            {pokemons.map((p) => (
              <div
                className="poke-card"
                key={p.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "white",
                  marginTop: "1rem",
                  borderRadius: "0.5rem",
                  boxShadow: "0 0 10px white",
                  minWidth: "10rem",
                }}
              >
                <Image src={p.imageUrl} width={130} height={130} />
                <p style={{ color: "#333", fontWeight: "bold" }}>
                  {p.name.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
